import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TeamDetails } from '@app/settings/store/models/team.model';

@Component({
    selector: 'smi-members-table',
    templateUrl: 'members-table.component.html',
    styleUrls: ['members-table.component.scss']
})
export class MembersTableComponent {

    @Input()
    set data(data: TeamDetails[]) {
      this.dataSource = new MatTableDataSource<TeamDetails>(data);
    }
  
    ngOnInit() {}
  
    public dataSource: MatTableDataSource<TeamDetails>;
    displayedColumns: string[] = ['firstName', 'lastName', 'email', 'delete'];


    @Output()
    selectMember = new EventEmitter();

    @Output()
    deleteMember = new EventEmitter();

    @Output()
    addMember = new EventEmitter();
  
    onSelectRow(member) {
      this.selectMember.emit(member);
    }

    onDelete(id) {
      this.deleteMember.emit(id);
    }

    onAdd() {
      this.addMember.emit();
    }
}