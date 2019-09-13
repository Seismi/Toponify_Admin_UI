import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-owners-table-in-architecture',
  templateUrl: './owners-table.component.html',
  styleUrls: ['./owners-table.component.scss']
})
export class OwnersTableComponent {

  @Input() selectedRowIndex: any = -1;
  @Input() isEditable = false;
  @Input() selectedOwner: boolean = false;

  @Input()
  set data(data: any[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
    }
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<NodeDetail>;

  @Output()
  selectOwner = new EventEmitter();

  @Output()
  addOwner = new EventEmitter();

  @Output()
  deleteOwner = new EventEmitter();

  onAdd() {
    this.addOwner.emit();
  }

  onSelect(ownerId: string) {
    this.selectOwner.emit(ownerId);
  }

  onDelete() {
    this.deleteOwner.emit();
  }

}