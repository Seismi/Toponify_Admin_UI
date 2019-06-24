import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadWorkPackage } from '@app/workpackage/store/actions/workpackage.actions';
import { Store, select } from '@ngrx/store';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkPackage } from '@app/workpackage/store/selectors/workpackage.selector';
import { Subscription } from 'rxjs';
import { WorkpackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';
import { WorkpackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-workpackage-details',
  templateUrl: './workpackage-details.component.html',
  styleUrls: ['./workpackage-details.component.scss'],
  providers: [WorkpackageDetailService, WorkpackageValidatorService]
})
export class WorkpackageDetailsComponent implements OnInit, OnDestroy {

  @Output() selectWorkpackage = new EventEmitter();

  workpackage: WorkPackageDetail;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<WorkPackageState>,
    private workpackageDetailService: WorkpackageDetailService
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const workpackageId = params['workpackageId'];
      this.store.dispatch(new LoadWorkPackage(workpackageId));
    }));
    this.subscriptions.push(this.store.pipe(select(getSelectedWorkPackage)).subscribe(workpackage => {
      this.workpackage = workpackage;
      this.workpackageDetailService.workpackageDetailsForm.patchValue({
        name: workpackage.name,
        description: workpackage.description,
        owners: workpackage.owners,
        approvers: workpackage.approvers
      });
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get workpackageDetailsForm(): FormGroup {
    return this.workpackageDetailService.workpackageDetailsForm;
  }

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
