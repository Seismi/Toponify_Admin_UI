import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State as ReportState } from '../store/reducers/report.reducer';
import { AddReport, LoadReports } from '../store/actions/report.actions';
import { Observable, Subscription } from 'rxjs';
import { ReportLibrary } from '../store/models/report.model';
import { getReportEntities } from '../store/selecrtors/report.selectors';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import {
  LoadWorkPackages,
  SetSelectedWorkPackages,
  SetWorkpackageEditMode,
  SetWorkpackageSelected
} from '@app/workpackage/store/actions/workpackage.actions';
import {
  getEditWorkpackages,
  getSelectedWorkpackages,
  getWorkPackageEntities
} from '@app/workpackage/store/selectors/workpackage.selector';
import { Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ReportModalComponent } from './report-modal/report-modal.component';
import { SharedService } from '@app/services/shared-service';
import { getWorkPackagesQueryParams } from '@app/core/store/selectors/route.selectors';
import { take } from 'rxjs/operators';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { RouterStateUrl } from '@app/core/store';
import { RouterReducerState } from '@ngrx/router-store';

@Component({
  selector: 'smi-report-library-component',
  templateUrl: 'report-library.component.html',
  styleUrls: ['report-library.component.scss']
})
export class ReportLibraryComponent implements OnInit, OnDestroy {
  public reportEntities$: Observable<ReportLibrary[]>;
  public workpackage$: Observable<WorkPackageEntity[]>;
  public selectedLeftTab: number;
  public showOrHidePane = false;
  public hideTab = true;
  public canSelectWorkpackage: boolean = true;
  public workpackageId: string;
  public workPackageIsEditable: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    private sharedService: SharedService,
    private store: Store<ReportState>,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    private workPackageStore: Store<WorkPackageState>,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.workPackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
    this.subscriptions.push(
      this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
        const workPackageIds = workpackages.map(item => item.id);
        this.setWorkPackage(workPackageIds);
      })
    );

    this.subscriptions.push(
      this.routerStore.select(getWorkPackagesQueryParams).subscribe(workpackages => {
        if (typeof workpackages === 'string') {
          return this.workPackageStore.dispatch(new SetSelectedWorkPackages({ workPackages: [workpackages] }));
        }
        if (workpackages) {
          return this.workPackageStore.dispatch(new SetSelectedWorkPackages({ workPackages: workpackages }));
        }
        return this.workPackageStore.dispatch(new SetSelectedWorkPackages({ workPackages: [] }));
      })
    );

    this.subscriptions.push(
      this.workPackageStore.pipe(select(getEditWorkpackages)).subscribe(workpackages => {
        const edit = workpackages.map(item => item.edit);
        !edit.length ? (this.workPackageIsEditable = true) : (this.workPackageIsEditable = false);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setWorkPackage(workpackageIds: string[] = []) {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.store.dispatch(new LoadReports(queryParams));
    this.reportEntities$ = this.store.pipe(select(getReportEntities));
  }

  onSelectReport(row: ReportLibrary) {
    this.router.navigate(['report-library', row.id], {queryParamsHandling: 'preserve' });
  }

  openLeftTab(index: number) {
    this.selectedLeftTab = index;
    if (this.selectedLeftTab === index) {
      this.showOrHidePane = true;
    }
  }

  hideLeftPane() {
    this.showOrHidePane = false;
  }

  onSelectWorkPackage(selection: { id: string; newState: boolean }) {
    this.routerStore
      .select(getWorkPackagesQueryParams)
      .pipe(take(1))
      .subscribe(workpackages => {
        let urlWorkpackages: string[];
        let params: Params;
        if (typeof workpackages === 'string') {
          urlWorkpackages = [workpackages];
        } else {
          urlWorkpackages = workpackages ? [...workpackages] : [];
        }
        const index = urlWorkpackages.findIndex(id => id === selection.id);
        if (selection.newState) {
          if (index === -1) {
            params = { workpackages: [...urlWorkpackages, selection.id] };
          } else {
            params = { workpackages: [...urlWorkpackages] };
          }
        } else {
          if (index !== -1) {
            urlWorkpackages.splice(index, 1);
          }
          params = { workpackages: [...urlWorkpackages] };
        }
        this.routerStore.dispatch(new UpdateQueryParams(params));
      });
    this.workPackageStore.dispatch(new SetWorkpackageSelected({ workpackageId: selection.id }));
  }

  onSelectEditWorkpackage(workpackage: any) {
    this.workpackageId = workpackage.id;
    if (!workpackage.edit) {
      this.routerStore.dispatch(new UpdateQueryParams({ workpackages: this.workpackageId }));
    } else {
      this.routerStore.dispatch(new UpdateQueryParams({ workpackages: null }));
    }
    this.workPackageStore.dispatch(new SetWorkpackageEditMode({ id: workpackage.id }));
  }

  onAddReport() {
    const dialogRef = this.dialog.open(ReportModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.report) {
        this.store.dispatch(
          new AddReport({
            workPackageId: this.workpackageId,
            request: {
              data: { ...data.report }
            }
          })
        );
      }
    });
  }
}
