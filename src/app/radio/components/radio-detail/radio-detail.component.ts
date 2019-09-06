import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from '@app/core/constants';
import { User } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-radio-detail',
  templateUrl: './radio-detail.component.html',
  styleUrls: ['./radio-detail.component.scss']
})

export class RadioDetailComponent {
  
  users: User[];
  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() statusClosed = false;

  @Input()
  set data(data: any[]) {
    this.users = data;
  }

  categories = Constants.RADIO_CATEGORIES;
  status = Constants.RADIO_STATUS;

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