import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { WorkPackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { WorkPackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageDetail, WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import * as fromWorkPackagesEntities from '../../store/selectors/workpackage.selector';
import { WorkPackageModalComponent } from '../workpackage-modal/workpackage.component';

@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkPackageComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public workpackageEntities$: Observable<WorkPackageEntity[]>;
  public workpackageId: string;
  public selectedOwners = [];
  public workpackages: WorkPackageEntity[];
  public workPackageSelected: boolean;

  constructor(private store: Store<WorkPackageState>, private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.store.dispatch(new LoadWorkPackages({}));
    this.workpackageEntities$ = this.store.pipe(select(fromWorkPackagesEntities.getWorkPackageEntities));
    this.subscriptions.push(this.workpackageEntities$.subscribe(workpackages => (this.workpackages = workpackages)));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSelectWorkpackage(row: WorkPackageDetail): void {
    if (!row) {
      this.router.navigate(['work-packages'], { queryParamsHandling: 'preserve' });
      this.workPackageSelected = false;
    } else {
      this.router.navigate(['work-packages', row.id], { queryParamsHandling: 'preserve' });
      this.workPackageSelected = true;
    }
  }

  onAddWorkPackage(): void {
    this.dialog.open(WorkPackageModalComponent, {
      disableClose: false,
      width: '500px'
    });
  }
}
