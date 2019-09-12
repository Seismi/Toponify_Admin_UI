import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UserDetails } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-my-team-table',
  templateUrl: './my-team-table.component.html',
  styleUrls: ['./my-team-table.component.scss']
})
export class MyTeamTableComponent {

  selectedRowIndex = -1;
  @Input() isEditable = false;
  @Input() selectedTeam = false;

  @Input()
  set data(data: any[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<any>(data);
    }
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<UserDetails>;

  @Output()
  addTeam = new EventEmitter();

  @Output()
  deleteTeam = new EventEmitter();

  @Output()
  selectTeam = new EventEmitter();

  onSelect(row) {
    this.selectTeam.emit(row);
  }

  onAdd() {
    this.addTeam.emit();
  }

  onDelete() {
    this.deleteTeam.emit();
  }
}