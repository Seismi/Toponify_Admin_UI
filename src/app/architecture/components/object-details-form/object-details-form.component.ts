import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-object-details-form',
  templateUrl: './object-details-form.component.html',
  styleUrls: ['./object-details-form.component.scss']
})

export class ObjectDetailsFormComponent {

  @Input() group: FormGroup;
  @Input() clickedOnLink = false;
  @Input() nodeSelected = true;
  @Input() isEditable = false;
  @Input() workPackageIsEditable = false;

  constructor() { }

  @Output()
  saveAttribute = new EventEmitter();

  @Output()
  deleteAttribute = new EventEmitter();

  @Output()
  editDetails = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  onEdit(){
    this.editDetails.emit();
  }

  onSave(){
    this.saveAttribute.emit();
    this.isEditable = false;
  }

  onCancel(){
    this.cancel.emit();
  }

  onDelete(){
    this.deleteAttribute.emit();
  }

}
