import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-report-owners-table',
  templateUrl: 'owners-table.component.html',
  styleUrls: ['owners-table.component.scss']
})
export class ReportOwnersTableComponent {
  @Input() selectedOwnerIndex: any;
  @Input() isEditable: boolean;
  @Input() selectedOwner: boolean;

  @Input()
  set data(data: OwnersEntityOrTeamEntityOrApproversEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<OwnersEntityOrTeamEntityOrApproversEntity>(data);
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<OwnersEntityOrTeamEntityOrApproversEntity>;

  @Output() selectOwner = new EventEmitter<OwnersEntityOrTeamEntityOrApproversEntity>();

  @Output() addOwner = new EventEmitter<void>();

  @Output() deleteOwner = new EventEmitter<void>();

  onAdd(): void {
    this.addOwner.emit();
  }

  onSelect(owner: OwnersEntityOrTeamEntityOrApproversEntity): void {
    this.selectOwner.emit(owner);
  }

  onDelete(): void {
    this.deleteOwner.emit();
  }
}
