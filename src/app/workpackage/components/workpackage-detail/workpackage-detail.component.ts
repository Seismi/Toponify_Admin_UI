import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-workpackage-detail',
  templateUrl: './workpackage-detail.component.html',
  styleUrls: ['./workpackage-detail.component.scss']
})
export class WorkPackageDetailComponent  {

  disableStatusInput = true;

  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() owners: any;
  @Input() baseline: any;
  @Input() baselineTableData: any;
  @Input() ownersTableData: any;
  @Input() approversTableData: any;
  @Input() selectedBaselines = [];
  @Input() selectedOwners = [];
  @Input() selectedOwner: boolean;
  @Input() selectedBaseline: boolean;

  @Output()
  deleteWorkpackage = new EventEmitter();

  @Output()
  saveWorkpackage = new EventEmitter();

  @Output()
  deleteOwner = new EventEmitter();

  @Output()
  selectOwner = new EventEmitter();

  @Output()
  addOwner = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Output()
  addBaseline = new EventEmitter();

  @Output()
  deleteBaseline = new EventEmitter();

  @Output()
  selectBaseline = new EventEmitter();

  onSave() {
    this.isEditable = false;
    this.saveWorkpackage.emit();
  }

  onEdit() {
    this.isEditable = true;
  }
  
  onCancel() {
    this.isEditable = false;
    this.cancel.emit();
  }

  onDelete() {
    this.deleteWorkpackage.emit();
  }

  onDeleteOwner() {
    this.deleteOwner.emit();
  }

  onSelectOwner(row) {
    this.selectOwner.emit(row);
  }

  onAddOwner() {
    this.addOwner.emit();
  }

  onAddBaseline() {
    this.addBaseline.emit();
  }

  onDeleteBaseline() {
    this.deleteBaseline.emit();
  }

  onSelectBaseline(row) {
    this.selectBaseline.emit(row);
  }
  
}