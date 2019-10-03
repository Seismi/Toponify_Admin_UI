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
  @Input() statusDraft: boolean;
  @Input() workpackageActionSubmit: boolean;
  @Input() workpackageActionApprove: boolean;
  @Input() workpackageActionReject: boolean;
  @Input() workpackageActionMerge: boolean;
  @Input() workpackageActionReset: boolean;
  @Input() workpackageActionSupersede: boolean;

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
  editWorkPackage = new EventEmitter();

  @Output()
  addBaseline = new EventEmitter();

  @Output()
  deleteBaseline = new EventEmitter();

  @Output()
  selectBaseline = new EventEmitter();

  @Output()
  submit = new EventEmitter<string>();

  @Output()
  approve = new EventEmitter<string>();

  @Output()
  reject = new EventEmitter<string>();

  @Output()
  merge = new EventEmitter<string>();

  @Output()
  reset = new EventEmitter<string>();

  @Output()
  supersede = new EventEmitter<string>();


  onSave() {
    this.saveWorkpackage.emit();
  }

  onEdit() {
    this.editWorkPackage.emit();
  }
  
  onCancel() {
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

  submitWorkpackage() {
    this.submit.emit();
  }

  approveWorkpackage() {
    this.approve.emit();
  }

  rejectWorkpackage() {
    this.reject.emit();
  }

  mergeWorkpackage() {
    this.merge.emit();
  }

  resetWorkpackage() {
    this.reset.emit();
  }

  supersedeWorkpackage() {
    this.supersede.emit();
  }
}