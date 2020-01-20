import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { RolesEntity } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-my-user-form',
  templateUrl: 'my-user-form.component.html',
  styleUrls: ['my-user-form.component.scss']
})
export class MyUserFormComponent {
  @Input() teams: TeamEntity[];
  @Input() roles: RolesEntity[];
  @Input() userStatus: string;

  @Input() set team(team: any) {
    this.teams = team;
  }
  @Input() set role(role: any) {
    this.roles = role;
  }

  @Input() group: FormGroup;
  @Input() disableEmailInput: boolean = true;
  @Input() modalMode: boolean = false;
  @Input() isEditable: boolean = false;
  @Input() myUserPage: boolean = false;

  constructor(public dialog: MatDialog) {}

  @Output() saveUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() changePassword = new EventEmitter<void>();
  @Output() deleteUser = new EventEmitter<void>();

  onSave(): void {
    this.saveUser.emit();
  }

  onEdit(): void {
    this.editUser.emit();
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }

  onChangePassword(): void {
    this.changePassword.emit();
  }

  compareFn(option: TeamEntity | RolesEntity, option2: TeamEntity | RolesEntity): boolean {
    return option && option2 ? option.id === option2.id : option === option2;
  }

  onDelete(): void {
    this.deleteUser.emit();
  }
}
