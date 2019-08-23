import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadWorkPackage, DeleteWorkPackageEntity, DeleteOwner, AddOwner, UpdateWorkPackageEntity } from '@app/workpackage/store/actions/workpackage.actions';
import { Store, select } from '@ngrx/store';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkPackage } from '@app/workpackage/store/selectors/workpackage.selector';
import { Subscription } from 'rxjs';
import { WorkPackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import { WorkPackageDetail, OwnersEntityOrApproversEntity } from '@app/workpackage/store/models/workpackage.models';
import { WorkPackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { DeleteWorkPackageModalComponent } from '../delete-workpackage-modal/delete-workpackage.component';
import { MatDialog } from '@angular/material';
import { OwnersModalComponent } from '../owners-modal/owners-modal.component';

@Component({
  selector: 'app-workpackage-details',
  templateUrl: './workpackage-details.component.html',
  styleUrls: ['./workpackage-details.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService]
})
export class WorkpackageDetailsComponent implements OnInit, OnDestroy {

  workpackage: WorkPackageDetail;
  subscriptions: Subscription[] = [];
  workpackageId: string;
  ownerId: string;
  owner: OwnersEntityOrApproversEntity;
  selectedOwner: boolean;
  selectedBaseline: boolean;
  showOrHideRightPane = false;
  selectedRightTab: number;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store<WorkPackageState>,
    private workPackageDetailService: WorkPackageDetailService
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const workpackageId = params['workpackageId'];
      this.workpackageId = workpackageId;
      this.store.dispatch(new LoadWorkPackage(workpackageId));
    }));
    this.subscriptions.push(this.store.pipe(select(getSelectedWorkPackage)).subscribe(workpackage => {
      this.workpackage = workpackage;
      if(workpackage) {
        this.workPackageDetailService.workPackageDetailForm.patchValue({
          name: workpackage.name,
          description: workpackage.description
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get workPackageDetailForm(): FormGroup {
    return this.workPackageDetailService.workPackageDetailForm;
  }

  openRightTab(index: number) {
    this.selectedRightTab = index;
    if(this.selectedRightTab === index) {
      this.showOrHideRightPane = false;
    }
  }

  onHideRightPane() {
    this.showOrHideRightPane = true;
  }

  onSelectOwner(row) {
    this.ownerId = row.id;
    this.selectedOwner = true;
  }

  onSaveWorkpackage() {
    this.store.dispatch(new UpdateWorkPackageEntity({
      entityId: this.workpackageId,
      workPackage: { data: {
        id: this.workpackageId,
        name: this.workPackageDetailForm.value.name,
        description: this.workPackageDetailForm.value.description
      }}
    }))
    this.selectedOwner = false;
    this.selectedBaseline = false;
  }

  onCancel() {
    this.selectedOwner = false;
    this.selectedBaseline = false;
  }

  onDeleteWorkpackage() {
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.mode === 'delete') {
        this.store.dispatch(new DeleteWorkPackageEntity(this.workpackageId));
      }
    });
  }

  onAddOwner() {
    const dialogRef = this.dialog.open(OwnersModalComponent, {
      disableClose: false, 
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if(data && data.owner) {
        this.store.dispatch(new AddOwner({
          workPackageId: this.workpackageId,
          ownerId: data.owner.id, 
          owners: data.owner
        }))
      }
    });
  }

  onDeleteOwner() {
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.mode === 'delete') {
        this.store.dispatch(new DeleteOwner({workPackageId: this.workpackageId, ownerId: this.ownerId}))
        this.selectedOwner = false;
      }
    });
  }

  onAddBaseline() { }

  onDeleteBaseline() { }

  onSelectBaseline(row) {
    this.selectedBaseline = true;
  }
}