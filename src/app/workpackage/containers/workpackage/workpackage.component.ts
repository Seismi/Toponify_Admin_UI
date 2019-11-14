import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { WorkPackageTreeModalComponent } from '../workpackage-tree-modal/workpackage-tree-modal.component';


@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkPackageComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  workpackageEntities$: Observable<WorkPackageEntity[]>;
  workpackagesSubscription: Subscription;
  selectedWorkPackage$: Subscription;
  selectedWorkPackage: WorkPackageEntity;
  workpackageSelected: boolean;
  workpackageId: string;
  selectedOwners = [];
  selectedBaseline = [];
  workpackages: WorkPackageEntity[];

  constructor(
    private store: Store<WorkPackageState>,
    private router: Router,
    public dialog: MatDialog) {}


  ngOnInit() {
    this.store.dispatch(new LoadWorkPackages({}));
    this.workpackageEntities$ = this.store.pipe(select(fromWorkPackagesEntities.getWorkPackageEntities));
    this.workpackagesSubscription = this.workpackageEntities$.subscribe(workpackages => (this.workpackages = workpackages));
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
    this.router.navigate(['work-packages', row.id], {queryParamsHandling: 'preserve' });
  }


  onAddWorkPackage() {
    this.dialog.open(WorkPackageModalComponent, {
      disableClose: false,
      width: '500px'
    })
  }

  onOpenWorkPackageTree() {
    this.dialog.open(WorkPackageTreeModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        workpackages: this.workpackages
      }
    });
  }
}
