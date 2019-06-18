import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TeamDetails } from '@app/settings/store/models/team.model';

@Component({
    selector: 'smi-members-table',
    templateUrl: 'members-table.component.html',
    styleUrls: ['members-table.component.scss']
})
export class MembersTableComponent {

    members: TeamDetails[];

    @Input()
    set data(data: TeamDetails[]) {
      this.members = data;
    }

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