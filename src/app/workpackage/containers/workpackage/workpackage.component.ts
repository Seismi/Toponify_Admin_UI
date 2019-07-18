import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { WorkPackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { WorkPackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import * as fromWorkPackagesEntities from '../../store/selectors/workpackage.selector';
import { WorkPackageModalComponent } from '../workpackage-modal/workpackage.component';

@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService]
})
export class WorkPackageComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  workpackageEntities$: Observable<WorkPackageEntity[]>;
  selectedWorkPackage$: Subscription;
  selectedWorkPackage: WorkPackageEntity;
  workpackageSelected: boolean;
  workpackageId: string;
  workpackage: WorkPackageEntity[];
  selectedOwners = [];
  selectedBaseline = [];

  constructor(
    private store: Store<WorkPackageState>,
    private router: Router,
    public dialog: MatDialog) {}


  ngOnInit() {
    this.store.dispatch(new LoadWorkPackages({}));
    this.workpackageEntities$ = this.store.pipe(select(fromWorkPackagesEntities.getWorkPackageEntities));
    this.subscriptions.push(this.store.pipe(select(fromWorkPackagesEntities.getSelectedWorkPackage))
      .subscribe(workpackage => {
        // TODO: enable when api fixed. Currently returns list instead of details
        // this.workpackageId = workpackage.id;
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSelectWorkpackage(row: any) {
    this.router.navigate(['work-packages', row.id]);
  }

  onAddWorkPackage() {
    this.dialog.open(WorkPackageModalComponent, {
      disableClose: false,
      width: '500px'
    });
  }
}
