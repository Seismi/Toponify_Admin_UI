import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AttributeEntity } from '../../store/models/attributes.model';
import { State as AttributeState } from '../../store/reducers/attributes.reducer';
import { select, Store } from '@ngrx/store';
import { LoadAttributes } from '../../store/actions/attributes.actions';
import * as fromAttributeEntities from '../../store/selectors/attributes.selector';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages, SetSelectedWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { getSelectedWorkpackages, getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';
import { Params, Router } from '@angular/router';
import { getWorkPackagesQueryParams } from '@app/core/store/selectors/route.selectors';
import { RouterStateUrl } from '@app/core/store';
import { RouterReducerState } from '@ngrx/router-store';
import { take } from 'rxjs/operators';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';

@Component({
  selector: 'smi-attributes',
  templateUrl: 'attributes.component.html',
  styleUrls: ['attributes.component.scss']
})
export class AttributesComponent implements OnInit, OnDestroy {
  attributes: Subscription;
  attribute: AttributeEntity[];
  workpackage$: Observable<WorkPackageEntity[]>;
  hideTab = true;
  selectedLeftTab: number;
  showOrHidePane: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AttributeState>,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    private workPackageStore: Store<WorkPackageState>,
    private router: Router
  ) {}

  ngOnInit() {
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
    this.workPackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
    this.subscriptions.push(
      this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
        const workPackageIds = workpackages.map(item => item.id);
        const selected = workpackages.map(item => item.selected);
        if (!selected.length) {
          this.router.navigate(['/attributes-and-rules'], { queryParamsHandling: 'preserve' });
        }
        this.setWorkPackage(workPackageIds);
      })
    );

    this.attributes = this.store.pipe(select(fromAttributeEntities.getAttributeEntities)).subscribe(data => {
      this.attribute = data;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setWorkPackage(workpackageIds: string[] = []) {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.store.dispatch(new LoadAttributes(queryParams));
  }

  get categoryTableData() {
    return this.attribute;
  }

  onSelectAttribute(entry: AttributeEntity) {
    this.router.navigate(['/attributes-and-rules', entry.id], { queryParamsHandling: 'preserve' });
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
}
