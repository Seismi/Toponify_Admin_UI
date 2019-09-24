import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-object-details-form',
  templateUrl: './object-details-form.component.html',
  styleUrls: ['./object-details-form.component.scss']
})
export class ObjectDetailsFormComponent {
  @Input() owners: OwnersEntityOrTeamEntityOrApproversEntity[];
  @Input() descendants: DescendantsEntity[];
  @Input() group: FormGroup;
  @Input() clickedOnLink = false;
  @Input() isEditable = false;
  @Input() workPackageIsEditable = false;
  @Input() selectedOwner: boolean;
  @Input() selectedOwnerIndex: string | null;

  constructor() {}

  @Output() saveAttribute = new EventEmitter<void>();

  @Output() deleteAttribute = new EventEmitter<void>();

  @Output() editDetails = new EventEmitter<void>();

  @Output() cancel = new EventEmitter<void>();

  @Output() addOwner = new EventEmitter<void>();

  @Output() selectOwner = new EventEmitter<string>();

  @Output() deleteOwner = new EventEmitter<void>();

  @Output() addDescendant = new EventEmitter<void>();

  @Output() deleteDescendant = new EventEmitter<string>();

  onEdit(): void {
    this.editDetails.emit();
  }

  onSave(): void {
    this.saveAttribute.emit();
    this.isEditable = false;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onDelete(): void {
    this.deleteAttribute.emit();
  }

  onAddOwner(): void {
    this.addOwner.emit();
  }

  onSelectOwner(ownerId: string) {
    this.selectOwner.emit(ownerId);
  }

  onDeleteOwner(): void {
    this.deleteOwner.emit();
  }

  onAddDescendant() {
    this.addDescendant.emit();
  }

  onDeleteDescendant(id: string) {
    this.deleteDescendant.emit(id);
  }

}
