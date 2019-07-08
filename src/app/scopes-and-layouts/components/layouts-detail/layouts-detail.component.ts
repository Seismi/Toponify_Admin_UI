import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-layouts-detail',
  templateUrl: './layouts-detail.component.html',
  styleUrls: ['./layouts-detail.component.scss']
})
export class LayoutsDetailComponent {

  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() data: any;
  @Input() selectedOwners = [];
  @Input() selectedViewers = [];

  onEdit() {
    this.isEditable = true;
  }

  onSave() {
    this.isEditable = false;
  }
  
  onCancel() {
    this.isEditable = false;
  }

  onDelete() {}

}