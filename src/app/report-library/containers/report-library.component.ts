import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as ReportState} from '../store/reducers/report.reducer';
import { LoadReports } from '../store/actions/report.actions';
import { Observable } from 'rxjs';
import { ReportLibrary } from '../store/models/report.model';
import { getReportEntities } from '../store/selecrtors/report.selectors';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState} from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages, SetWorkpackageSelected } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities, getSelectedWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { Router } from '@angular/router';
import { SearchEntity } from '@app/core/store/models/search.models';
import { State as SearchState } from '@app/core/store/reducers/search.reducer';
import { Search } from '@app/core/store/actions/search.actions';
import { getSearchResults } from '@app/core/store/selectors/search.selectors';

@Component({
  selector: 'smi-report-library-component',
  templateUrl: 'report-library.component.html',
  styleUrls: ['report-library.component.scss']
})

export class ReportLibraryComponent implements OnInit {

  search$: Observable<SearchEntity[]>;
  reportEntities$: Observable<ReportLibrary[]>;
  workpackage$: Observable<WorkPackageEntity[]>;
  selectedLeftTab: number;
  showOrHidePane = false;
  hideTab = true;

  constructor(
    private searchStore: Store<SearchState>,
    private store: Store<ReportState>,
    private workPackageStore: Store<WorkPackageState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.workPackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
    this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
      const workPackageIds = workpackages.map(item => item.id);
      const selected = workpackages.map(item => item.selected);
      if(!selected.length) {
        this.router.navigate(['report-library']);
      }
      this.setWorkPackage(workPackageIds);
    })
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
    this.workPackageStore.dispatch(new SetWorkpackageSelected({workpackageId: id}));
  }

  onSearch(query: string) {
    this.search(query);
  }

  search(text: string) {
    const queryParams = {
      text: text
    };
    this.searchStore.dispatch(new Search(queryParams));
    this.search$ = this.searchStore.pipe(select(getSearchResults));
  }
  
}