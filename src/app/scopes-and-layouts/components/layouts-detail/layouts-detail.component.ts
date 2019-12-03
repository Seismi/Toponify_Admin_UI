import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() ownersList: any;
  @Input() viewersList: any;

  @Output()
  deleteLayout = new EventEmitter();

  @Output()
  saveLayout = new EventEmitter();

  onEdit() {
    this.isEditable = true;
  }

  onSave() {
    this.isEditable = false;
    this.saveLayout.emit();
  }

  onCancel() {
    this.isEditable = false;
  }

  onDelete() {
    this.deleteLayout.emit();
  }
}
