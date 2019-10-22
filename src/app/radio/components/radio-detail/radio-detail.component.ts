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
  
  public users: User[];
  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() statusClosed = false;

  @Input()
  set data(data: any[]) {
    this.users = data;
  }

  public categories = Constants.RADIO_CATEGORIES;
  public status = Constants.RADIO_STATUS;
  public refNumber = ['R-0001', 'R-0002', 'R-0003', 'R-0004'];

  compareUsers(u1: any, u2: any): boolean {
    return u1.name === u2.name && u1.id === u2.id;
  }

  @Output()
  archiveRadio = new EventEmitter<void>();

  @Output()
  saveRadio = new EventEmitter<void>();

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