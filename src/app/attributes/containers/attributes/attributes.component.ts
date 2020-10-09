import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AttributeEntity } from '../../store/models/attributes.model';
import { State as AttributeState } from '../../store/reducers/attributes.reducer';
import { select, Store } from '@ngrx/store';
import { LoadAttributes, AddAttribute } from '../../store/actions/attributes.actions';
import * as fromAttributeEntities from '../../store/selectors/attributes.selector';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import {
  LoadWorkPackages,
  SetSelectedWorkPackages,
  SetWorkpackageEditMode,
  GetWorkpackageAvailability
} from '@app/workpackage/store/actions/workpackage.actions';
import {
  getSelectedWorkpackages,
  getWorkPackageEntities,
  getEditWorkpackages,
  getSelectedWorkpackageIds
} from '@app/workpackage/store/selectors/workpackage.selector';
import { Params, Router } from '@angular/router';
import { getWorkPackagesQueryParams, getScopeQueryParams } from '@app/core/store/selectors/route.selectors';
import { RouterStateUrl } from '@app/core/store';
import { RouterReducerState } from '@ngrx/router-store';
import { take, distinctUntilChanged } from 'rxjs/operators';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { MatDialog } from '@angular/material';
import { AttributeModalComponent } from '@app/attributes/containers/attribute-modal/attribute-modal.component';
import { defaultScopeId, ScopeEntity } from '@app/scope/store/models/scope.model';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { LoadScopes, LoadScope } from '@app/scope/store/actions/scope.actions';
import { getScopeEntities, getScopeSelected } from '@app/scope/store/selectors/scope.selector';
import isEqual from 'lodash.isequal';
import { getAttributesLoading } from '../../store/selectors/attributes.selector';

@Component({
  selector: 'smi-attributes',
  templateUrl: 'attributes.component.html',
  styleUrls: ['attributes.component.scss']
})
export class AttributesComponent implements OnInit, OnDestroy {
  public scopes$: Observable<ScopeEntity[]>;
  public selectedScope$: Observable<ScopeEntity>;
  public attribute: AttributeEntity[];
  public workpackage$: Observable<WorkPackageEntity[]>;
  public selectedLeftTab: number | string;
  public showOrHidePane: boolean;
  public subscriptions: Subscription[] = [];
  public workpackageId: string;
  public canSelectWorkpackage = true;
  public workPackageIsEditable: boolean;
  public scopeId = defaultScopeId;
  public selectedWorkPackageEntities: WorkPackageEntity[];

  constructor(
    private scopeStore: Store<ScopeState>,
    private store: Store<AttributeState>,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    private workPackageStore: Store<WorkPackageState>,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Attributes And Rules
    this.subscriptions.push(
      this.store.pipe(select(fromAttributeEntities.getAttributeEntities)).subscribe(data => {
        return (this.attribute = data);
      })
    );

    // Scope
    this.scopeStore.dispatch(new LoadScopes({}));
    this.scopes$ = this.scopeStore.pipe(select(getScopeEntities));
    this.selectedScope$ = this.scopeStore.pipe(select(getScopeSelected));
    this.subscriptions.push(
      this.scopeStore.pipe(select(getScopeSelected)).subscribe(scope => {
        if (scope) {
          this.scopeId = scope.id;
          this.store.dispatch(new UpdateQueryParams({ scope: scope.id }));
        }
      })
    );
    this.subscriptions.push(
      this.routerStore
        .select(getScopeQueryParams)
        .pipe(take(1))
        .subscribe(scope => {
          if (scope) {
            this.scopeStore.dispatch(new LoadScope(scope));
          } else {
            this.scopeStore.dispatch(new LoadScope(defaultScopeId));
          }
        })
    );


    // Work Packages
    this.workPackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));

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
      this.workPackageStore
        .pipe(
          select(getSelectedWorkpackages),
          distinctUntilChanged(isEqual)
        )
        .subscribe(workpackages => {
          if (workpackages) {
            this.selectedWorkPackageEntities = workpackages;
            const workPackageIds = workpackages.map(item => item.id);
            this.getAttributesWithQueryParams(workPackageIds);
          }
      })
    );

    this.subscriptions.push(
      this.workPackageStore.pipe(select(getEditWorkpackages)).subscribe(workpackages => {
        if (workpackages) {
          const edit = workpackages.map(item => item.edit);
          !edit.length ? (this.workPackageIsEditable = true) : (this.workPackageIsEditable = false);
        }
      })
    );

    this.subscriptions.push(
      this.workPackageStore
        .pipe(
          select(getSelectedWorkpackageIds),
          distinctUntilChanged(isEqual)
        )
        .subscribe(selectedWorkpackageIds => {
          this.workPackageStore.dispatch(
            new GetWorkpackageAvailability({
              workPackageQuery: selectedWorkpackageIds
            })
          );
        })
    );
  }

  getAttributesWithQueryParams(workPackageIds: string[]): void {
    const queryParams = {
      workPackageQuery: workPackageIds,
      scopeQuery: this.scopeId
    };
    this.store.dispatch(new LoadAttributes(queryParams));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get isLoading$(): Observable<boolean> {
    return this.store.select(getAttributesLoading);
  }

  get categoryTableData(): AttributeEntity[] {
    return this.attribute;
  }

  onSelectAttribute(entry: AttributeEntity): void {
    this.router.navigate(['/attributes-and-rules', entry.id], { queryParamsHandling: 'preserve' });
  }

  onSelectWorkPackage(selection: { id: string; newState: boolean }): void {
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
          this.store.dispatch(new SetWorkpackageEditMode({ id: this.workpackageId, newState: false }));
        }
        this.routerStore.dispatch(new UpdateQueryParams(params));
      });
  }

  onSelectEditWorkpackage(workpackage: any): void {
    this.workpackageId = workpackage.id;
    this.routerStore.dispatch(new UpdateQueryParams({ workpackages: workpackage.id }));
    this.workPackageStore.dispatch(new SetWorkpackageEditMode({ id: workpackage.id, newState: !workpackage.edit }));
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AttributeModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.attribute) {
        this.store.dispatch(
          new AddAttribute({
            workPackageId: this.workpackageId,
            entity: { data: { ...data.attribute } }
          })
        );
      }
    });
  }

  onSelectScope(scopeId: string): void {
    this.scopeStore.dispatch(new LoadScope(scopeId));
    this.getAttributesWithScopeQuery(scopeId);
  }

  getAttributesWithScopeQuery(scopeId: string): void {
    const queryParams = {
      scopeQuery: scopeId
    };
    this.store.dispatch(new LoadAttributes(queryParams));
  }

  onExitWorkPackageEditMode(): void {
    this.store.dispatch(new SetWorkpackageEditMode({ id: this.workpackageId, newState: false }));
  }
}
