import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as ReportState } from '../store/reducers/report.reducer';
import { LoadReports } from '../store/actions/report.actions';
import { Observable, Subscription } from 'rxjs';
import { ReportLibrary } from '../store/models/report.model';
import { getReportEntities } from '../store/selecrtors/report.selectors';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages, SetWorkpackageSelected } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities, getSelectedWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { Router } from '@angular/router';

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

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<ReportState>,
    private workPackageStore: Store<WorkPackageState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.workPackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
    this.subscriptions.push(
      this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
        const workPackageIds = workpackages.map(item => item.id);
        const selected = workpackages.map(item => item.selected);
        if (!selected.length) {
          this.router.navigate(['report-library']);
        }
        this.setWorkPackage(workPackageIds);
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
    this.router.navigate(['report-library', row.id]);
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

  onSelectWorkPackage(id: string) {
    this.workPackageStore.dispatch(new SetWorkpackageSelected({ workpackageId: id }));
  }
}
