import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TeamEntity } from '@app/settings/store/models/team.model';

@Component({
    selector: 'smi-teams-table',
    templateUrl: 'teams-table.component.html',
    styleUrls: ['teams-table.component.scss']
})
export class TeamsTableComponent {

    @Input()
    set data(data: TeamEntity[]) {
      this.dataSource = new MatTableDataSource<TeamEntity>(data);
    }
  
    ngOnInit() {}
  
    public dataSource: MatTableDataSource<TeamEntity>;
    displayedColumns: string[] = ['name'];
  
    selectedRowIndex: number = -1;

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