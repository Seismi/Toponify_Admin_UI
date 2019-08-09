import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { WorkpackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { WorkpackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import * as fromWorkPackagesEntities from '../../store/selectors/workpackage.selector';
import { WorkPackageTreeModalComponent } from '../workpackage-tree-modal/workpackage-tree-modal.component';
import {WorkPackageDiagramService} from '@app/workpackage/services/workpackage-diagram.service';
import { State as SearchState } from '@app/core/store/reducers/search.reducer';
import { Search } from '@app/core/store/actions/search.actions';
import { getSearchResults } from '@app/core/store/selectors/search.selectors';
import { SearchEntity } from '@app/core/store/models/search.models';


@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkpackageDetailService, WorkpackageValidatorService]
})
export class WorkPackageComponent implements OnInit, OnDestroy {

  search$: Observable<SearchEntity[]>;
  subscriptions: Subscription[] = [];
  workpackageEntities$: Observable<WorkPackageEntity[]>;
  workpackagesSubscription: Subscription;
  selectedWorkPackage$: Subscription;
  selectedWorkPackage: WorkPackageEntity;
  workpackageSelected: boolean;
  workpackageId: string;
  workpackages: WorkPackageEntity[];

  constructor(
    private searchStore: Store<SearchState>,
    private store: Store<WorkPackageState>,
    private router: Router,
    public dialog: MatDialog) {}


  ngOnInit() {
    this.store.dispatch(new LoadWorkPackages({}));
    this.workpackageEntities$ = this.store.pipe(select(fromWorkPackagesEntities.getWorkPackageEntities));
    this.workpackagesSubscription = this.workpackageEntities$.subscribe(workpackages => (this.workpackages = workpackages));
    this.subscriptions.push(this.store.pipe(select(fromWorkPackagesEntities.getSelectedWorkPackage))
      .subscribe(workpackage => {
        // TODO: enable when api fixed. Currently returns list instead of details
        // this.workpackageId = workpackage.id;
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSelectWorkpackage(row: any) {
    this.router.navigate(['work-packages', row.id]);
  }

  onOpenWorkPackageTree() {
    this.dialog.open(WorkPackageTreeModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        workpackages: this.workpackages
      }
    });
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
