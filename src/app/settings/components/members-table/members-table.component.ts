import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TeamDetails } from '@app/settings/store/models/team.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'smi-members-table',
  templateUrl: 'members-table.component.html',
  styleUrls: ['members-table.component.scss']
})
export class MembersTableComponent {

  @Input()
  set members(data: any[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<TeamDetails>;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'delete'];

  @Output()
  deleteMember = new EventEmitter();

  @Output()
  addMember = new EventEmitter();

  onDelete(id) {
    this.deleteMember.emit(id);
  }

  onAdd() {
    this.addMember.emit();
  }
}