import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-radio-detail',
  templateUrl: './radio-detail.component.html',
  styleUrls: ['./radio-detail.component.scss']
})

export class RadioDetailComponent {

  @Input() group: FormGroup;
  @Input() addComment = true;
  @Input() isEditable = false;
  @Input() disableButton = true;

  constructor() {}

  @Output()
  archiveComment = new EventEmitter();

  @Output()
  saveComment = new EventEmitter();

  onArchive() {
    this.archiveComment.emit();
  }

  onSave() {
    this.saveComment.emit();
  }

  onEdit() {
    this.isEditable = true;
  }

  onCancel() {
    this.isEditable = false;
  }

}