import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  TeamEntityOrOwnersEntityOrApproversEntity,
  WorkPackageDetail,
  WorkPackageEntity
} from '@app/workpackage/store/models/workpackage.models';
import { TeamEntity } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-workpackage-detail',
  templateUrl: './workpackage-detail.component.html',
  styleUrls: ['./workpackage-detail.component.scss']
})
export class WorkPackageDetailComponent {
  public disableStatusInput = true;

  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() owners: TeamEntity[];
  @Input() baseline: WorkPackageEntity[];
  @Input() baselineTableData: WorkPackageDetail;
  @Input() ownersTableData: WorkPackageDetail;
  @Input() approversTableData: WorkPackageDetail;
  @Input() selectedBaselines = [];
  @Input() selectedOwners = [];
  @Input() statusDraft: boolean;
  @Input() workpackageActionSubmit: boolean;
  @Input() workpackageActionApprove: boolean;
  @Input() workpackageActionReject: boolean;
  @Input() workpackageActionMerge: boolean;
  @Input() workpackageActionReset: boolean;
  @Input() workpackageActionSupersede: boolean;
  @Input() workpackageColour: string;
  @Input() workPackageStatus: string;

  @Output()
  deleteWorkpackage = new EventEmitter<void>();

  @Output()
  saveWorkpackage = new EventEmitter<void>();

  @Output()
  deleteOwner = new EventEmitter<TeamEntityOrOwnersEntityOrApproversEntity>();

  @Output()
  addOwner = new EventEmitter<void>();

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  editWorkPackage = new EventEmitter<void>();

  @Output()
  submit = new EventEmitter<void>();

  @Output()
  approve = new EventEmitter<void>();

  @Output()
  reject = new EventEmitter<void>();

  @Output()
  merge = new EventEmitter<void>();

  @Output()
  reset = new EventEmitter<void>();

  @Output()
  supersede = new EventEmitter<void>();

  @Output()
  selectColour = new EventEmitter<string>();

  @Output()
  openWorkPackage = new EventEmitter<void>();

  onSave(): void {
    this.saveWorkpackage.emit();
  }

  onEdit(): void {
    this.editWorkPackage.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onDelete(): void {
    this.deleteWorkpackage.emit();
  }

  onDeleteOwner(owner: TeamEntityOrOwnersEntityOrApproversEntity): void {
    this.deleteOwner.emit(owner);
  }

  onAddOwner(): void {
    this.addOwner.emit();
  }

  submitWorkpackage(): void {
    this.submit.emit();
  }

  approveWorkpackage(): void {
    this.approve.emit();
  }

  rejectWorkpackage(): void {
    this.reject.emit();
  }

  mergeWorkpackage(): void {
    this.merge.emit();
  }

  resetWorkpackage(): void {
    this.reset.emit();
  }

  supersedeWorkpackage(): void {
    this.supersede.emit();
  }

  onSelectColour(colour: string): void {
    this.selectColour.emit(colour);
  }

  onOpen(): void {
    this.openWorkPackage.emit();
  }

  getWorkPackageStatus(): boolean {
    if (!['merged', 'superseded'].includes(this.workPackageStatus)) {
      return true;
    }
  }
}
