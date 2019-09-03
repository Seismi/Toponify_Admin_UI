import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-team-detail',
  templateUrl: 'team-detail.component.html',
  styleUrls: ['team-detail.component.scss']
})
export class TeamDetailComponent {

  @Input() group: FormGroup;
  @Input() teamModal = false;
  @Input() isEditable = false;

  @Output()
  editTeam = new EventEmitter();

  @Output()
  deleteTeam = new EventEmitter();

  @Output()
  saveTeam = new EventEmitter();

  @Output()
  cancelEdit = new EventEmitter();

  onEdit() {
    this.editTeam.emit();
  }

  onDelete() {
    this.deleteTeam.emit();
  }

  onSave() {
    this.saveTeam.emit();
  }

  onCancel() {
    this.cancelEdit.emit();
  }

}