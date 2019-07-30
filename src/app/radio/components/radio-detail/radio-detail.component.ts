import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-radio-detail',
  templateUrl: './radio-detail.component.html',
  styleUrls: ['./radio-detail.component.scss']
})

export class RadioDetailComponent {

  @Input() group: FormGroup;
  @Input() addRadio = true;
  @Input() isEditable = false;
  @Input() disableButton = true;
  @Input() modalMode = false;
  @Input() targetName = false;

  categories = ['risk', 'assumption', 'dependency', 'issue', 'opportunity'];
  status = ['open', 'closed'];

  constructor() {}

  @Output()
  archiveRadio = new EventEmitter();

  @Output()
  saveRadio = new EventEmitter();

  onArchive() {
    this.archiveRadio.emit();
  }

  onSave() {
    this.isEditable = false;
    this.saveRadio.emit();
  }

  onEdit() {
    this.isEditable = true;
  }

  onCancel() {
    this.isEditable = false;
  }

}