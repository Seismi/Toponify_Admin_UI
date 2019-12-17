import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-team-detail',
  templateUrl: 'team-detail.component.html',
  styleUrls: ['team-detail.component.scss']
})
export class TeamDetailComponent {
  @Input() group: FormGroup;
  @Input() modalMode: boolean = false;
  @Input() isEditable: boolean = false;

  @Output() editTeam = new EventEmitter<void>();
  @Output() deleteTeam = new EventEmitter<void>();
  @Output() saveTeam = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  onEdit(): void {
    this.editTeam.emit();
  }

  onDelete(): void {
    this.deleteTeam.emit();
  }

  onSave(): void {
    this.saveTeam.emit();
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}