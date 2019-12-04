import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
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
export class WorkPackageComponent implements OnInit, OnDestroy, AfterViewInit {
  public subscriptions: Subscription[] = [];
  public workpackageEntities$: Observable<WorkPackageEntity[]>;
  public selectedWorkPackage$: Subscription;
  public selectedWorkPackage: WorkPackageEntity;
  public workpackageSelected: boolean;
  public workpackageId: string;
  public selectedOwners = [];
  public selectedBaseline = [];
  public workpackages: WorkPackageEntity[];
  public workPackageSelected: boolean;

  constructor(private store: Store<WorkPackageState>, private router: Router, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.router.events.subscribe((event: NavigationEnd) => {
      if (event instanceof NavigationEnd) {
        event.url.length > 16 ? (this.workPackageSelected = true) : (this.workPackageSelected = false);
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new LoadWorkPackages({}));
    this.workpackageEntities$ = this.store.pipe(select(fromWorkPackagesEntities.getWorkPackageEntities));
    this.subscriptions.push(this.workpackageEntities$.subscribe(workpackages => (this.workpackages = workpackages)));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSelectWorkpackage(row: WorkPackageDetail): void {
    this.router.navigate(['work-packages', row.id], { queryParamsHandling: 'preserve' });
  }

  onAddWorkPackage(): void {
    this.dialog.open(WorkPackageModalComponent, {
      disableClose: false,
      width: '500px'
    });
  }
}
