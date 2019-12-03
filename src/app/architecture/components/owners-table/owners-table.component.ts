import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';

@Component({
  selector: 'smi-owners-table-in-architecture',
  templateUrl: './owners-table.component.html',
  styleUrls: ['./owners-table.component.scss']
})
export class OwnersTableComponent {
  @Input() isEditable: boolean = false;

  @Input()
  set data(data: OwnersEntityOrTeamEntityOrApproversEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<OwnersEntityOrTeamEntityOrApproversEntity>(data);
  }

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<OwnersEntityOrTeamEntityOrApproversEntity>;

  @Output() addOwner = new EventEmitter<void>();

  @Output() deleteOwner = new EventEmitter<OwnersEntityOrTeamEntityOrApproversEntity>();

  onAdd(): void {
    this.addOwner.emit();
  }

  onDelete(owner: OwnersEntityOrTeamEntityOrApproversEntity): void {
    this.deleteOwner.emit(owner);
  }
}
