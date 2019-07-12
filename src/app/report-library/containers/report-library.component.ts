import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as ReportState} from '../store/reducers/report.reducer'
import { LoadReports } from '../store/actions/report.actions';
import { Observable } from 'rxjs';
import { ReportLibrary } from '../store/models/report.model';
import { getReportEntities } from '../store/selecrtors/report.selectors';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState} from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';

@Component({
  selector: 'smi-report-library-component',
  templateUrl: 'report-library.component.html',
  styleUrls: ['report-library.component.scss']
})

export class ReportLibraryComponent implements OnInit {

  reportSelected: boolean;
  reportEntities$: Observable<ReportLibrary[]>;
  workpackage$: Observable<WorkPackageEntity[]>;

  constructor(
    private store: Store<ReportState>,
    private workPackageStore: Store<WorkPackageState>
  ) { }

  ngOnInit() {
    // Reports
    this.store.dispatch(new LoadReports());
    this.reportEntities$ = this.store.pipe(select(getReportEntities));

    // Work Packages
    this.workPackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
  }

  onSelectReport(row) {
    debugger;
    this.reportSelected = true;
  }
  
}