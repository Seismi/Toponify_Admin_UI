import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as ReportState} from '../store/reducers/report.reducer';
import { LoadReports } from '../store/actions/report.actions';
import { Observable } from 'rxjs';
import { ReportLibrary } from '../store/models/report.model';
import { getReportEntities } from '../store/selecrtors/report.selectors';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState} from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-report-library-component',
  templateUrl: 'report-library.component.html',
  styleUrls: ['report-library.component.scss']
})

export class ReportLibraryComponent implements OnInit {

  reportEntities$: Observable<ReportLibrary[]>;
  workpackage$: Observable<WorkPackageEntity[]>;

  constructor(
    private store: Store<ReportState>,
    private workPackageStore: Store<WorkPackageState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadReports());
    this.reportEntities$ = this.store.pipe(select(getReportEntities));

    this.workPackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
  }

  onSelectReport(row) {
    this.router.navigate(['report-library', row.id]);
  }
}