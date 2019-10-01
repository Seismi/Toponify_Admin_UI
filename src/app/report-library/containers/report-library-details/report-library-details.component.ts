import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { State as ReportState } from '../../store/reducers/report.reducer';
import { select, Store } from '@ngrx/store';
import { LoadReport } from '@app/report-library/store/actions/report.actions';
import { getReportSelected } from '@app/report-library/store/selecrtors/report.selectors';
import { ReportLibraryDetailService } from '@app/report-library/components/report-library-detail/services/report-library.service';
import { FormGroup } from '@angular/forms';
import { Report } from '@app/report-library/store/models/report.model';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';

@Component({
  selector: 'smi-report-library--details-component',
  templateUrl: 'report-library-details.component.html',
  styleUrls: ['report-library-details.component.scss'],
  providers: [ReportLibraryDetailService]
})
export class ReportLibraryDetailsComponent implements OnInit, OnDestroy {
  public report: Report;
  public selectedRightTab: number;
  public showOrHideRightPane = false;

  private subscriptions: Subscription[] = [];
  private reportId: string;

  constructor(
    private workPackageStore: Store<WorkPackageState>,
    private route: ActivatedRoute,
    private store: Store<ReportState>,
    private reportLibraryDetailService: ReportLibraryDetailService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.reportId = params['reportId'];
        this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
          const workPackageIds = workpackages.map(item => item.id);
          this.setWorkPackage(workPackageIds);
        });
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getReportSelected)).subscribe(report => {
        this.report = report;
        if (report) {
          this.reportLibraryDetailService.reportDetailForm.patchValue({
            name: report.name,
            description: report.description
          });
        }
      })
    );
  }

  setWorkPackage(workpackageIds: string[] = []) {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.store.dispatch(new LoadReport({ id: this.reportId, queryParams: queryParams }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get reportDetailForm(): FormGroup {
    return this.reportLibraryDetailService.reportDetailForm;
  }

  openRightTab(index: number) {
    this.selectedRightTab = index;
    if (this.selectedRightTab === index) {
      this.showOrHideRightPane = false;
    }
  }

  onHideRightPane() {
    this.showOrHideRightPane = true;
  }
}
