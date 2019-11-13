import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';
import { TeamEntityOrOwnersEntityOrApproversEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-owners-table',
  templateUrl: './owners-table.component.html',
  styleUrls: ['./owners-table.component.scss']
})
export class OwnersTableComponent {

  @Input() isEditable: boolean = false;

  @Input()
  set data(data: WorkPackageDetail[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<WorkPackageDetail>(data);
    }
  }

  public displayedColumns: string[] = ['name', 'delete'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output() addOwner = new EventEmitter<void>();
  @Output() deleteOwner = new EventEmitter<TeamEntityOrOwnersEntityOrApproversEntity>();

  onAdd(): void {
    this.addOwner.emit();
  }

  onDelete(owner: TeamEntityOrOwnersEntityOrApproversEntity): void {
    this.deleteOwner.emit(owner);
  }

}