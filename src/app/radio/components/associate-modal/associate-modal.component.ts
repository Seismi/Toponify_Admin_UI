import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import {currentArchitecturePackageId, WorkPackageEntity} from '@app/workpackage/store/models/workpackage.models';
import { Observable, Subscription } from 'rxjs';
import { LoadingStatus, Node } from '@app/architecture/store/models/node.model';
import { select, Store } from '@ngrx/store';
import { getLoadingNodesStatus, getNodeEntities } from '@app/architecture/store/selectors/node.selector';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { LoadNodes } from '@app/architecture/store/actions/node.actions';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getAllWorkPackages, workpackageLoading } from '@app/workpackage/store/selectors/workpackage.selector';

@Component({
  selector: 'smi-delete-property-modal',
  templateUrl: './associate-modal.component.html',
  styleUrls: ['./associate-modal.component.scss']
})
export class AssociateModalComponent implements OnInit, OnDestroy {
  public title: string;
  public workpackages$: Observable<WorkPackageEntity[]>;
  public nodes: Node[];
  public selectedWorkpackageId = currentArchitecturePackageId;
  public formControl = new FormControl();
  public loadingStatus = LoadingStatus;
  public filteredOptions$: Observable<Node[]>;
  private subscriptions: Subscription[] = [];
  public workpackageLoading: boolean;

  constructor(
    private workPackageStore: Store<WorkPackageState>,
    private store: Store<NodeState>,
    public dialogRef: MatDialogRef<AssociateModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; workpackages$: Observable<WorkPackageEntity[]> }
  ) {
    this.title = data.title;
  }

  get isLoading$(): Observable<LoadingStatus> {
    return this.store.select(getLoadingNodesStatus);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.workPackageStore.pipe(select(workpackageLoading)).subscribe(loading => (this.workpackageLoading = loading))
    );

    this.workpackages$ = this.workPackageStore.pipe(
      select(getAllWorkPackages),
      map(data => data.filter(entity => entity.status !== 'merged' && entity.status !== 'superseded'))
    );

    this.subscriptions.push(
      this.store.pipe(select(getNodeEntities)).subscribe(nodes => (this.nodes = nodes))
    );

    this.filteredOptions$ = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.nodes.slice())
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSelectWorkPackage($event: MatSelectChange): void {
    this.selectedWorkpackageId = $event.value;
    this.getNodesWithWorkPackageQuery($event.value);
  }

  getNodesWithWorkPackageQuery(workPackageId: string): void {
    const queryParams = {
      workPackageQuery: [workPackageId]
    };
    this.store.dispatch(new LoadNodes(queryParams));
  }

  onConfirm(): void {
    this.dialogRef.close({
      nodeId: this.formControl.value.id,
      workpackageId: this.selectedWorkpackageId
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  displayFn(component: Node): string {
    return component && component.name ? component.name : '';
  }

  private _filter(name: string): Node[] {
    const filterValue = name.toLowerCase();
    return this.nodes.filter(node => node.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
