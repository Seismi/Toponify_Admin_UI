import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import { AttributeEntity } from '@app/attributes/store/models/attributes.model';

@Component({
  selector: 'smi-object-details-form',
  templateUrl: './object-details-form.component.html',
  styleUrls: ['./object-details-form.component.scss']
})
export class ObjectDetailsFormComponent {
  @Input() owners: OwnersEntityOrTeamEntityOrApproversEntity[];
  @Input() descendants: DescendantsEntity[];
  @Input() group: FormGroup;
  @Input() clickedOnLink: boolean = false;
  @Input() isEditable: boolean = false;
  @Input() workPackageIsEditable: boolean = false;
  @Input() selectedOwner: boolean;
  @Input() selectedOwnerIndex: string | null;
  @Input() attributesPage: boolean = false;
  @Input() relatedAttributes: AttributeEntity[];
  @Input() selectedRelatedIndex: string | null;
  @Input() selectAttribute: boolean;

  constructor() {}

  @Output() saveAttribute = new EventEmitter<void>();

  @Output() deleteAttribute = new EventEmitter<void>();

  @Output() editDetails = new EventEmitter<void>();

  @Output() cancel = new EventEmitter<void>();

  @Output() addOwner = new EventEmitter<void>();

  @Output() selectOwner = new EventEmitter<string>();

  @Output() deleteOwner = new EventEmitter<void>();

  @Output() addDescendant = new EventEmitter<void>();

  @Output() deleteDescendant = new EventEmitter<DescendantsEntity>();

  @Output() selectRelatedAttribute = new EventEmitter<string>();

  @Output() addRelatedAttribute = new EventEmitter<void>();

  @Output() deleteRelatedAttribute = new EventEmitter<void>();

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

  onSelectOwner(ownerId: string): void {
    this.selectOwner.emit(ownerId);
  }

  onDeleteOwner(): void {
    this.deleteOwner.emit();
  }

  onAddDescendant(): void {
    this.addDescendant.emit();
  }

  onDeleteDescendant(descendant: DescendantsEntity): void {
    this.deleteDescendant.emit(descendant);
  }

  onSelectRelatedAttribute(relatedAttributeId: string): void {
    this.selectRelatedAttribute.emit(relatedAttributeId);
  }

  onAddRelatedAttribute(): void {
    this.addRelatedAttribute.emit();
  }

  onDeleteRelatedAttribute(): void {
    this.deleteRelatedAttribute.emit();
  }

}
