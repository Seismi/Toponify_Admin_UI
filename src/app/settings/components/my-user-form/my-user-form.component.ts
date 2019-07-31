import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ChangePasswordModalComponent } from '../../containers/change-password-modal/change-password.component';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { RolesEntity } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-my-user-form',
  templateUrl: 'my-user-form.component.html',
  styleUrls: ['my-user-form.component.scss']
})
export class MyUserFormComponent {

  teams: TeamEntity[];
  roles: RolesEntity[];

  @Input() set team(team: any) {this.teams = team};
  @Input() set role(role: any) {this.roles = role};
  @Input() group: FormGroup;
  @Input() showButtons = true;
  @Input() isActive = false;
  @Input() disableEmailInput = true;
  @Input() selectedTeams = [];
  @Input() selectedRoles = [];
  toggle = false;

  constructor(public dialog: MatDialog) { }

  onSave() {
    this.isActive = !this.isActive;
    this.toggle = !this.toggle;
  }

  onChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      width: '400px',
    });
  }

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
}