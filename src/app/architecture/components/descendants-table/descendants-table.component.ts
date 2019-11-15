import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-descendants-table-in-architecture',
  templateUrl: './descendants-table.component.html',
  styleUrls: ['./descendants-table.component.scss']
})
export class DescendantsTableComponent {
  @Input() isEditable = false;

  @Input()
  set data(data: DescendantsEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<DescendantsEntity>(data);
  }

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<DescendantsEntity>;

  @Output() addDescendant = new EventEmitter<void>();

  @Output() deleteDescendant = new EventEmitter<DescendantsEntity>();

  onAdd(): void {
    this.addDescendant.emit();
  }

  onDelete(descendant: DescendantsEntity): void {
    this.deleteDescendant.emit(descendant);
  }
}
