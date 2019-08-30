import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { RolesEntity, User } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-my-user-form',
  templateUrl: 'my-user-form.component.html',
  styleUrls: ['my-user-form.component.scss']
})
export class MyUserFormComponent {

  teams: TeamEntity[];
  roles: RolesEntity[];

  @Input() teamTableData: User;
  @Input() roleTableData: User;
  @Input() set team(team: any) {this.teams = team};
  @Input() set role(role: any) {this.roles = role};
  @Input() group: FormGroup;
  @Input() showButtons: boolean;
  @Input() isActive: boolean;
  @Input() editMode: boolean;
  @Input() addMode: boolean;
  @Input() disableEmailInput = true;
  @Input() selectedTeams = [];
  @Input() selectedRoles = [];

  constructor(public dialog: MatDialog) { }

  onSelectTeam(event, team) {
    if(event.source.selected) {
      this.selectedTeams.push(team)
    }
    if(!event.source.selected) {
      let index = this.selectedTeams.indexOf(team);
      if(index > -1) {
        this.selectedTeams.splice(index, 1);
      }
    }
  }

  onSelectRoles(event, role) {
    if(event.source.selected) {
      this.selectedRoles.push(role)
    }
    if(!event.source.selected) {
      let index = this.selectedRoles.indexOf(role);
      if(index > -1) {
        this.selectedRoles.splice(index, 1);
      }
    }
  }

  @Output()
  saveMyUser = new EventEmitter();

  @Output()
  editMyUser = new EventEmitter();

  @Output()
  changePassword = new EventEmitter();


  onSave() {
    this.saveMyUser.emit();
  }

  onEdit() {
    this.editMyUser.emit();
  }

  onChangePassword() {
    this.changePassword.emit();
  }
  
}