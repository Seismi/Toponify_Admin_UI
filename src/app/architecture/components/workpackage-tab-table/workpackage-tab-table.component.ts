import { Component, EventEmitter, Input, Output, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { workpackageLoading } from '@app/workpackage/store/selectors/workpackage.selector';

@Component({
  selector: 'smi-workpackage-tab-table',
  templateUrl: './workpackage-tab-table.component.html',
  styleUrls: ['./workpackage-tab-table.component.scss']
})
export class WorkPackageTabTableComponent implements OnInit, OnDestroy {
  private filterValue: string;
  public isLoading: boolean;
  public subscription: Subscription;
  @Input()
  set data(data: WorkPackageEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageEntity>(
        data.filter(entity => entity.status !== 'merged' && entity.status !== 'superseded')
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  @Input() canSelectWorkpackage: boolean;

  constructor(private store: Store<WorkPackageState>) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: MatTableDataSource<WorkPackageEntity>;
  public displayedColumns: string[] = ['workpackage'];

  @Output() selectWorkPackage = new EventEmitter<{ id: string; newState: boolean }>();

  @Output() selectColour = new EventEmitter<{ colour: string; id: string }>();

  @Output() setWorkpackageEditMode = new EventEmitter();

  ngOnInit(): void {
    this.subscription = this.store.pipe(select(workpackageLoading)).subscribe(loading => (this.isLoading = loading));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelect(id: string, newState: boolean, ev, workpackage: any): void {
    ev.preventDefault();
    if (workpackage.isSelectable) {
      this.selectWorkPackage.emit({ id, newState });
    }
  }

  canSelect(workpackage: any): boolean {
    return this.canSelectWorkpackage && !!workpackage.isSelectable;
  }

  canEdit(workpackage: any): boolean {
    return this.canSelectWorkpackage && !!workpackage.isSelectable && !!workpackage.isEditable;
  }

  // FIXME: set proper type of workpackage
  onSetWorkpackageEditMode(workpackage: any) {
    this.setWorkpackageEditMode.emit(workpackage);
  }

  onSelectColour(colour: string, id: string) {
    this.selectColour.emit({ colour, id });
  }

  onSearch(filterValue: string): void {
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
