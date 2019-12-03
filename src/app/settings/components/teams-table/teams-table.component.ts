import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { TeamEntity } from '@app/settings/store/models/team.model';

@Component({
  selector: 'smi-teams-table',
  templateUrl: 'teams-table.component.html',
  styleUrls: ['teams-table.component.scss']
})
export class TeamsTableComponent {
  @Input()
  set data(data: any[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<TeamEntity>;

  displayedColumns: string[] = ['name'];
  selectedRowIndex = -1;

  @Output()
  selectTeam = new EventEmitter();

  @Output()
  newTeam = new EventEmitter();

  onSelectRow(row) {
    this.selectedRowIndex = row.id;
    this.selectTeam.emit(row);
  }

  onAdd() {
    this.newTeam.emit();
  }
}
