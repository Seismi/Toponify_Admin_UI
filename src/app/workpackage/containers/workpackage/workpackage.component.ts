import * as fromWorkPackagesEntities from '../../store/selectors/workpackage.selector';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoadWorkPackage, LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import { WorkpackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { WorkpackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkpackageDetailService, WorkpackageValidatorService]
})
export class WorkPackageComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  workpackageEntities$: Observable<WorkPackageEntity[]>;
  selectedWorkPackage$: Subscription;
  selectedWorkPackage: WorkPackageEntity;
  workpackageSelected: boolean;
  workpackageId: string;
  workpackage: WorkPackageEntity[];

  constructor(private store: Store<WorkPackageState>,
              private workpackageDetailService: WorkpackageDetailService,
              private router: Router,
              public dialog: MatDialog) {}


  ngOnInit() {
    this.store.dispatch(new LoadWorkPackages({}));
    this.workpackageEntities$ = this.store.pipe(select(fromWorkPackagesEntities.getWorkPackageEntities));
    this.subscriptions.push(this.store.pipe(select(fromWorkPackagesEntities.getSelectedWorkPackage))
      .subscribe(workpackage => {
        // TODO: enable when fixed api. Currently it returns list instead of details
        // this.workpackageId = workpackage.id;
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  get workpackageDetailsForm(): FormGroup {
    return this.workpackageDetailService.workpackageDetailsForm;
  }


  onSelectWorkpackage(row: any) {

    this.router.navigate(['work-packages', row.id]);

    // this.workpackageDetailService.workpackageDetailsForm.patchValue({
    //   name: row.name,
    //   description: row.description,
    //   owners: row.owners,
    //   approvers: row.approvers
    // })

    // this.store.dispatch(new LoadWorkPackage('c288392e-6cf5-11e9-a923-1681be663d3e'));
    // this.selectedWorkPackage$ = this.store.pipe(select(fromWorkPackagesEntities.getWorkPackageById(this.workpackageId))).subscribe((data) => {
    //   this.selectedWorkPackage = {...data[0]}
    // })
  }


  // Add Work Package
  onAddWorkpackage() {
    // const dialogRef = this.dialog.open(WorkPackageModalComponent, {
    //   disableClose: false,
    //   width: '500px'
    // });

    // dialogRef.afterClosed().subscribe((data) => {
    //   if (data && data.workpackage) {
    //     this.store.dispatch(new AddWorkPackageEntity({ data: data.workpackage }))
    //   }
    // });
  }


  // Save Work Package
  onSaveWorkpackage() {}

  // Delete Work Package
  onDeleteWorkpackage() {
    // const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
    //   disableClose: false,
    //   width: 'auto',
    //   data: {
    //     mode: 'delete'
    //   }
    // });

    // dialogRef.afterClosed().subscribe((data) => {
    //   if (data.mode === 'delete') {
    //     this.store.dispatch(new DeleteWorkPackageEntity(this.workpackageId));
    //   }
    // });
  }


}
