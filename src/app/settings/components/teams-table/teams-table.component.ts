import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSlideToggleChange } from '@angular/material';
import { TeamEntity } from '@app/settings/store/models/team.model';

@Component({
  selector: 'smi-teams-table',
  templateUrl: 'teams-table.component.html',
  styleUrls: ['teams-table.component.scss']
})
export class TeamsTableComponent {
  public selectedRowIndex: string | number = -1;
  private filterValue: string;

  @Input()
  set data(data: TeamEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<TeamEntity>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filter = this.filterValue;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<TeamEntity>;
  public displayedColumns: string[] = ['name'];

  @Output() selectTeam = new EventEmitter<TeamEntity>();
  @Output() addTeam = new EventEmitter<void>();
  @Output() showDisabledTeams = new EventEmitter<MatSlideToggleChange>();

  onSelectRow(team: TeamEntity): void {
    this.selectedRowIndex = team.id;
    this.selectTeam.emit(team);
  }

  onAdd(): void {
    this.addTeam.emit();
  }

  onSearch(filterValue: string): void {
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
