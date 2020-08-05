import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { RolesEntity, UserDetails } from '@app/settings/store/models/user.model';
import { Roles } from '@app/core/directives/by-role.directive';

enum Frequency {
  None = 'None',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

enum Days {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}

enum UserStatus {
  active = 'active',
  disabled = 'disabled'
}

@Component({
  selector: 'smi-my-user-form',
  templateUrl: 'my-user-form.component.html',
  styleUrls: ['my-user-form.component.scss']
})
export class MyUserFormComponent {
  public Frequency = Frequency;
  public frequencies: string[] = [
    Frequency.None,
    Frequency.Daily,
    Frequency.Weekly,
    Frequency.Monthly
  ];
  public days: string[] = [
    Days.Sunday,
    Days.Monday,
    Days.Tuesday,
    Days.Wednesday,
    Days.Thursday,
    Days.Friday,
    Days.Saturday
  ];

  constructor(public dialog: MatDialog) {}

  @Input() userTeam: TeamEntity[];
  @Input() userRole: RolesEntity[];

  @Input() user: UserDetails;
  @Input() value: UserDetails;
  @Input() teams: TeamEntity[];
  @Input() roles: RolesEntity[];
  @Input() userStatus: string;
  @Input() administrators: string[];
  @Input() userRoles: string[];
  @Input() userTeams: TeamEntity[];
  @Input() loggedInUser: UserDetails;

  @Input() set team(team: any) {
    this.teams = team;
  }
  @Input() set role(role: any) {
    this.roles = role;
  }

  @Input() group: FormGroup;
  @Input() disableEmailInput = true;
  @Input() modalMode = false;
  @Input() isEditable = false;
  @Input() myUserPage = false;
  @Input() canEdit = true;

  @Output() saveUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() changePassword = new EventEmitter<void>();
  @Output() deleteUser = new EventEmitter<void>();
  @Output() addTeam = new EventEmitter<void>();
  @Output() addRole = new EventEmitter<void>();
  @Output() remove = new EventEmitter<{id: string, type: string}>();
  @Output() resetPassword = new EventEmitter<void>();

  onRemove(id: string, type: string): void {
    this.remove.emit({id, type});
  }

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

  disabledRole(role: RolesEntity): boolean {
    if (this.administrators && this.administrators.length === 1 && this.userRoles.includes(Roles.ADMIN)) {
      return role.name === Roles.ADMIN;
    }
  }

  getTooltip(role: RolesEntity): string {
    if (this.administrators && this.administrators.length === 1 && role.name === Roles.ADMIN && this.disabledRole(role)) {
      return 'This is the only administrator in the organisation. There must be at least one administrator.';
    } else {
      return;
    }
  }

  getStatus(): boolean {
    return this.user ? this.user.userStatus === UserStatus.active : true;
  }

  getResetButton(): boolean[] {
    return  !this.myUserPage &&
            !this.isEditable &&
            this.user && this.user.userStatus === UserStatus.active &&
            this.loggedInUser.roles.map(role => role.name.includes(Roles.ADMIN));
  }

}
