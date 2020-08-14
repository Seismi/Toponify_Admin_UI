import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSlideToggleChange, MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';
import { WorkPackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { WorkPackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import {
  LoadWorkPackages,
  WorkPackageActionTypes,
  UpdateWorkPackageEntity,
  AddWorkPackageEntity,
  LoadWorkPackagesActive
} from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageDetail, WorkPackageEntity, WorkPackageEntitiesHttpParams, WorkPackagesActive } from '@app/workpackage/store/models/workpackage.models';
import { select, Store } from '@ngrx/store';
import { Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import * as fromWorkPackagesEntities from '../../store/selectors/workpackage.selector';
import { WorkPackageModalComponent } from '../workpackage-modal/workpackage.component';
import { Actions, ofType } from '@ngrx/effects';
import { Roles } from '@app/core/directives/by-role.directive';
import { LoadUsers } from '@app/settings/store/actions/user.actions';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { getWorkPackagesPage, workpackageLoading } from '../../store/selectors/workpackage.selector';

enum WorkPackageView {
  Table,
  Diagram
}

@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkPackageComponent implements OnInit, OnDestroy {
  public WorkPackageView = WorkPackageView;
  public selectedView: WorkPackageView = WorkPackageView.Table;
  public Roles = Roles;
  public workpackageEntities$: Observable<WorkPackageEntity[]>;
  public workpackageActive$: Observable<WorkPackagesActive[]>;
  public selectedRowIndex: string | number;
  public workpackage: WorkPackageDetail;
  public checked: boolean;
  private workPackageParams: WorkPackageEntitiesHttpParams = {
    textFilter: '',
    page: 0,
    size: 10,
    includeArchived: false
  }
  search$ = new Subject<string>();
  page$: Observable<any>;
  loading$: Subscription;
  isLoading: boolean;
  selectedTab: number;

  constructor(
    private actions: Actions,
    private store: Store<WorkPackageState>,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.dispatch(new LoadUsers({}));
    this.store.dispatch(new LoadWorkPackages(this.workPackageParams));
    this.workpackageEntities$ = this.store.pipe(select(fromWorkPackagesEntities.getAllWorkPackages));
    this.loading$ = this.store.pipe(select(workpackageLoading)).subscribe((loading) => this.isLoading = loading);

    this.store.dispatch(new LoadWorkPackagesActive());
    this.workpackageActive$ = this.store.pipe(select(fromWorkPackagesEntities.getWorkPackagesActive));

    this.search$
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(textFilter => {
      this.workPackageParams = {
        textFilter: textFilter,
        page: 0,
        size: this.workPackageParams.size,
        includeArchived: this.workPackageParams.includeArchived,
        ...(this.workPackageParams.sortBy && { sortBy: this.workPackageParams.sortBy }),
        ...(this.workPackageParams.sortOrder && { sortOrder: this.workPackageParams.sortOrder })

      }
      this.store.dispatch(new LoadWorkPackages(this.workPackageParams));
    });

    this.page$ = this.store.pipe(
      select(getWorkPackagesPage)
    )

    this.store
      .pipe(select(fromWorkPackagesEntities.getSelectedWorkPackage))
      .subscribe((workpackage: WorkPackageDetail) => {
        if (workpackage) {
          this.workpackage = workpackage;
          this.selectedRowIndex = workpackage.id;
        }
      });

    this.actions.pipe(ofType(WorkPackageActionTypes.AddObjectiveSuccess)).subscribe((action: any) => {
      if (action) {
        if (this.selectedRowIndex === action.payload.id) {
          this.selectedRowIndex = null;
        } else {
          this.selectedRowIndex = this.workpackage.id;
        }
      }
    });

    this.actions.pipe(ofType(WorkPackageActionTypes.ArchiveWorkPackage)).subscribe((action: any) => {
      if (action) {
        this.store.dispatch(
          new UpdateWorkPackageEntity({
            entityId: this.workpackage.id,
            workPackage: {
              data: {
                id: action.payload.workPackageId,
                archived: action.payload.archived
              }
            }
          })
        );

        this.actions.pipe(ofType(WorkPackageActionTypes.UpdateWorkPackageSuccess)).subscribe(_ => {
          this.getArchivedWorkPackages(this.checked);
        });
      }
    });

    this.actions
      .pipe(
        ofType(
          WorkPackageActionTypes.AddWorkPackageSuccess,
          WorkPackageActionTypes.DeleteWorkPackageSuccess
        )
      )
      .subscribe((action: any) => {
        if (action.payload.id) {
          this.selectedRowIndex = action.payload.id;
          this.onSelectWorkpackage(action.payload);
        }

        this.workPackageParams = {
          textFilter: this.workPackageParams.textFilter,
          page: 0,
          size: this.workPackageParams.size,
          includeArchived: this.workPackageParams.includeArchived
        };
        this.store.dispatch(new LoadWorkPackages(this.workPackageParams));
    });
  }

  ngOnDestroy(): void {
    this.loading$.unsubscribe();
  }

  onSelectWorkpackage(row: WorkPackageDetail): void {
    if (!row) {
      this.router.navigate(['work-packages'], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['work-packages', row.id], { queryParamsHandling: 'preserve' });
    }
  }

  onSearch(textFilter: string): void {
    this.search$.next(textFilter);
  }

  onPageChange(page){
    this.workPackageParams= {
      textFilter: this.workPackageParams.textFilter,
      page: page.pageIndex,
      size: page.pageSize,
      includeArchived: this.workPackageParams.includeArchived,
      ...(this.workPackageParams.sortBy && { sortBy: this.workPackageParams.sortBy }),
      ...(this.workPackageParams.sortOrder && { sortOrder: this.workPackageParams.sortOrder })
    } 
    this.store.dispatch(new LoadWorkPackages(this.workPackageParams))
  }

  onAddWorkPackage(): void {
    const dialogRef = this.dialog.open(WorkPackageModalComponent, {
      disableClose: false,
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if ((data && data.workpackage) || data && data.baseline) {
        this.store.dispatch(
          new AddWorkPackageEntity({
            data: {
              ...data.workpackage,
              baseline: data.baseline ? data.baseline : [],
              owners: data.workpackage.owners ? data.workpackage.owners : []
            }
          })
        );
      }
    });
  }

  showArchivedWorkPackages($event: MatSlideToggleChange): void {
    this.checked = $event.checked;
    this.getArchivedWorkPackages($event.checked);
  }

  getArchivedWorkPackages(checked: boolean): void {
    this.workPackageParams = {
      textFilter: this.workPackageParams.textFilter,
      page: this.workPackageParams.page,
      size: this.workPackageParams.size,
      includeArchived: checked ? true : false
    };
    this.store.dispatch(new LoadWorkPackages(this.workPackageParams));
  }

  refreshSearch(textFilter: string): void {
    this.workPackageParams = {
      textFilter: textFilter,
      page: 0,
      size: this.workPackageParams.size,
      includeArchived: this.workPackageParams.includeArchived,
      ...(this.workPackageParams.sortBy && { sortBy: this.workPackageParams.sortBy }),
      ...(this.workPackageParams.sortOrder && { sortOrder: this.workPackageParams.sortOrder })
    };
    this.store.dispatch(new LoadWorkPackages(this.workPackageParams));
  }

  handleTableSortChange(sort: { sortOrder: string; sortBy: string }) {
    this.workPackageParams = {
      textFilter: this.workPackageParams.textFilter,
      page: this.workPackageParams.page,
      size: this.workPackageParams.size,
      ...(sort.sortOrder && { sortBy: sort.sortBy, sortOrder: sort.sortOrder })
    };
    this.store.dispatch(new LoadWorkPackages(this.workPackageParams));
  }

  onSelectedTabChange(event: WorkPackageView): void {
    this.selectedView = event;
  }
}
