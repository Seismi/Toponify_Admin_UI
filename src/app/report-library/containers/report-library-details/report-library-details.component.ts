import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { State as ReportState } from '../../store/reducers/report.reducer';
import { Store, select } from '@ngrx/store';
import { LoadReport } from '@app/report-library/store/actions/report.actions';
import { getReportSelected } from '@app/report-library/store/selecrtors/report.selectors';
import { ReportLibraryDetailService } from '@app/report-library/components/report-library-detail/services/report-library.service';
import { ReportLibraryValidatorService } from '@app/report-library/components/report-library-detail/services/report-library-validator.service';
import { FormGroup } from '@angular/forms';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-library--details-component',
  templateUrl: 'report-library-details.component.html',
  styleUrls: ['report-library-details.component.scss'],
  providers: [ReportLibraryDetailService, ReportLibraryValidatorService]
})

export class ReportLibraryDetailsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  report: Report;
  reportSelected: boolean;
  selectedRightTab: number;
  showOrHideRightPane = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<ReportState>,
    private reportLibraryDetailService: ReportLibraryDetailService
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const id = params['reportId'];
      this.store.dispatch(new LoadReport(id));
    }));

    this.subscriptions.push(this.store.pipe(select(getReportSelected)).subscribe(report => {
      this.report = report;
      if(report) {
        this.reportLibraryDetailService.reportDetailForm.patchValue({
          name: report.name,
          description: report.description
        });
      }
    }));
    
    this.reportSelected = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get reportDetailForm(): FormGroup {
    return this.reportLibraryDetailService.reportDetailForm;
  }

  openRightTab(i) {
    this.selectedRightTab = i;
    if(this.selectedRightTab === i) {
      this.showOrHideRightPane = true;
    }
  }

  onHideRightPane() {
    this.showOrHideRightPane = false;
  }
}