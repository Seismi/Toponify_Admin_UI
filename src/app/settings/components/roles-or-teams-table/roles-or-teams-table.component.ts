import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TeamEntity, RolesEntity } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-roles-or-teams-table',
  templateUrl: 'roles-or-teams-table.component.html',
  styleUrls: ['roles-or-teams-table.component.scss']
})
export class RolesOrTeamsTableComponent {
  @Input() title: string;
  @Input() myUserPage: boolean;
  @Input()
  set data(data: TeamEntity[] | RolesEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<TeamEntity | RolesEntity>(data);
  }

  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  public dataSource: MatTableDataSource<any>;
  public displayedColumns: string[] = ['name', 'actions'];
}
