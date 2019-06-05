import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as ReportState} from '../store/reducers/report.reducer'
import { LoadReports } from '../store/actions/report.actions';
import { Observable } from 'rxjs';
import { ReportLibrary } from '../store/models/report.model';
import { getReportEntities } from '../store/selecrtors/report.selectors';

@Component({
  selector: 'smi-report-library-component',
  templateUrl: 'report-library.component.html',
  styleUrls: ['report-library.component.scss']
})

export class ReportLibraryComponent implements OnInit {

  reportSelected: boolean;
  reportEntities$: Observable<ReportLibrary[]>;

  constructor(
    private store: Store<ReportState>
  ) { }

  ngOnInit() { 
    this.store.dispatch(new LoadReports());
    this.reportEntities$ = this.store.pipe(select(getReportEntities));
  }

  onSelectReport(row) {
    debugger;
    this.reportSelected = true;
  }
  
}