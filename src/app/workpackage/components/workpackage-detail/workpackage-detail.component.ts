import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-workpackage-detail',
  templateUrl: './workpackage-detail.component.html',
  styleUrls: ['./workpackage-detail.component.scss']
})
export class WorkPackageDetailComponent  {

  @Input() group: FormGroup;
  @Input() isEditable = false;

  @Output()
  deleteWorkpackage = new EventEmitter();

  @Output()
  saveWorkpackage = new EventEmitter();

  onSave() {
    this.isEditable = false;
    this.saveWorkpackage.emit();
  }

  onEdit() {
    this.isEditable = true;
  }
  
  onCancel() {
    this.isEditable = false;
  }

  onDelete() {
    this.deleteWorkpackage.emit();
  }
  
}