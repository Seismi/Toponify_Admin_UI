import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Roles } from '@app/core/directives/by-role.directive';

@Component({
  selector: 'smi-team-detail',
  templateUrl: 'team-detail.component.html',
  styleUrls: ['team-detail.component.scss']
})
export class TeamDetailComponent {
  public Roles = Roles;
  @Input() group: FormGroup;
  @Input() modalMode = false;
  @Input() isEditable = false;
  @Input() disabled: boolean;

  @Output() editTeam = new EventEmitter<void>();
  @Output() disableTeam = new EventEmitter<void>();
  @Output() saveTeam = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
}
