import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackage-tab-table',
  templateUrl: './workpackage-tab-table.component.html',
  styleUrls: ['./workpackage-tab-table.component.scss']
})
export class WorkPackageTabTableComponent {
  @Input()
  set data(data: WorkPackageEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageEntity>(
        data.filter(entity => entity.status !== 'merged' && entity.status !== 'superseded')
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  @Input() canSelectWorkpackage: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: MatTableDataSource<WorkPackageEntity>;
  public displayedColumns: string[] = ['show', 'name', 'c', 'e', 'd'];

  @Output() selectWorkPackage = new EventEmitter<{ id: string; newState: boolean }>();

  @Output() selectColour = new EventEmitter<{ colour: string; id: string }>();

  @Output() setWorkpackageEditMode = new EventEmitter();

  onSelect(id: string, newState: boolean, ev): void {
    ev.preventDefault();
    this.selectWorkPackage.emit({ id, newState });
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
}
