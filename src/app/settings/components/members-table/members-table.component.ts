import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TeamDetails } from '@app/settings/store/models/team.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Roles } from '@app/core/directives/by-role.directive';

@Component({
  selector: 'smi-members-table',
  templateUrl: 'members-table.component.html',
  styleUrls: ['members-table.component.scss']
})
export class MembersTableComponent {
  public Roles = Roles;
  @Input()
  set members(data: TeamDetails[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<TeamDetails>(data);
      this.dataSource.paginator = this.paginator;
    }
  }
  @Input() disabled: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<TeamDetails>;
  public displayedColumns: string[] = ['firstName', 'lastName', 'email', 'delete'];

  @Output() deleteMember = new EventEmitter<TeamDetails>();
  @Output() addMember = new EventEmitter<void>();

  onDelete(member: TeamDetails): void {
    this.deleteMember.emit(member);
  }

  onAdd(): void {
    this.addMember.emit();
  }
}
