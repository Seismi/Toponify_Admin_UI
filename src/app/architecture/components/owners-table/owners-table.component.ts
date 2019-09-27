import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';

@Component({
  selector: 'smi-owners-table-in-architecture',
  templateUrl: './owners-table.component.html',
  styleUrls: ['./owners-table.component.scss']
})
export class OwnersTableComponent {
  @Input() selectedRowIndex: string | null = null;
  @Input() isEditable = false;
  @Input() selectedOwner = false;

  @Input()
  set data(data: OwnersEntityOrTeamEntityOrApproversEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<OwnersEntityOrTeamEntityOrApproversEntity>(data);
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<OwnersEntityOrTeamEntityOrApproversEntity>;

  @Output() selectOwner = new EventEmitter<string>();

  @Output() addOwner = new EventEmitter<void>();

  @Output() deleteOwner = new EventEmitter<void>();

  onAdd(): void {
    this.addOwner.emit();
  }

  onSelect(ownerId: string): void {
    this.selectOwner.emit(ownerId);
  }

  onDelete(): void {
    this.deleteOwner.emit();
  }
}
