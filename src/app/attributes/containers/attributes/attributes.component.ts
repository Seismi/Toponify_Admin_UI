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
  SetWorkpackageEditMode
} from '@app/workpackage/store/actions/workpackage.actions';
import { getSelectedWorkpackages, getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';
import { Params, Router } from '@angular/router';
import { getWorkPackagesQueryParams } from '@app/core/store/selectors/route.selectors';
import { RouterStateUrl } from '@app/core/store';
import { RouterReducerState } from '@ngrx/router-store';
import { take } from 'rxjs/operators';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { MatDialog } from '@angular/material';
import { AttributeModalComponent } from '@app/attributes/containers/attribute-modal/attribute-modal.component';

@Component({
  selector: 'smi-attributes',
  templateUrl: 'attributes.component.html',
  styleUrls: ['attributes.component.scss']
})
export class AttributesComponent implements OnInit, OnDestroy {
  public attributes: Subscription;
  public attribute: AttributeEntity[];
  public workpackage$: Observable<WorkPackageEntity[]>;
  public hideTab: boolean = true;
  public selectedLeftTab: number;
  public showOrHidePane: boolean;
  public subscriptions: Subscription[] = [];
  public workpackageId: string;
  public canSelectWorkpackage: boolean = true;
  public workPackageIsEditable: boolean;

  constructor(
    private store: Store<AttributeState>,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    private workPackageStore: Store<WorkPackageState>,
    private router: Router,
    private dialog: MatDialog
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
        const edit = workpackages.map(item => item.edit);
        edit[0] === true ? (this.workPackageIsEditable = true) : (this.workPackageIsEditable = false);
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

  setWorkPackage(workpackageIds: string[] = []): void {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.store.dispatch(new LoadAttributes(queryParams));
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
          if (index !== -1) {
            urlWorkpackages.splice(index, 1);
          }
          params = { workpackages: [...urlWorkpackages] };
        }
        this.routerStore.dispatch(new UpdateQueryParams(params));
      });
  }

  openLeftTab(index: number): void {
    this.selectedLeftTab = index;
    if (this.selectedLeftTab === index) {
      this.showOrHidePane = true;
    }
  }

  hideLeftPane(): void {
    this.showOrHidePane = false;
  }
  onSelectEditWorkpackage(workpackage: any): void {
    this.workpackageId = workpackage.id;
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
}
