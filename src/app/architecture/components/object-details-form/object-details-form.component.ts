import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';
import { DescendantsEntity, NodeDetail } from '@app/architecture/store/models/node.model';
import { AttributeEntity } from '@app/attributes/store/models/attributes.model';

const systemCategories = ['transactional', 'analytical', 'reporting', 'master data', 'file'];
const dataSetCategories = ['physical', 'virtual', 'master data'];
const dimensionCategories = ['dimension'];
const reportingCategories = ['list', 'structure', 'key'];

@Component({
  selector: 'smi-object-details-form',
  templateUrl: './object-details-form.component.html',
  styleUrls: ['./object-details-form.component.scss']
})
export class ObjectDetailsFormComponent {
  public group: FormGroup;
  private values;
  @Input() owners: OwnersEntityOrTeamEntityOrApproversEntity[];
  @Input() descendants: DescendantsEntity[];
  @Input('group') set setGroup(group) {
    console.log('set group');
    this.group = group;
    this.values = group.value;
  }

  @Input() clickedOnLink = false;
  @Input() isEditable = false;
  @Input() workPackageIsEditable = false;
  @Input() attributesPage = false;
  @Input() relatedAttributes: AttributeEntity[];
  @Input() selectedRelatedIndex: string | null;
  @Input() selectAttribute: boolean;
  @Input() viewLevel: number;
  @Input() selectedNode: NodeDetail;

  constructor() {}

  @Output() saveAttribute = new EventEmitter<void>();

  @Output() delete = new EventEmitter<void>();

  @Output() editDetails = new EventEmitter<void>();

  @Output() cancel = new EventEmitter<void>();

  @Output() addOwner = new EventEmitter<void>();

  @Output() deleteOwner = new EventEmitter<OwnersEntityOrTeamEntityOrApproversEntity>();

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
    this.group.reset(this.values);
  }

  onDelete(): void {
    this.delete.emit();
  }

  onAddOwner(): void {
    this.addOwner.emit();
  }

  onDeleteOwner(owner: OwnersEntityOrTeamEntityOrApproversEntity): void {
    this.deleteOwner.emit(owner);
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

  getCategories(): string[] {
    switch (this.selectedNode.layer) {
      case 'system':
        return systemCategories;
      case 'data set':
        return dataSetCategories;
      case 'dimension':
        return dimensionCategories;
      case 'reporting concept':
        return reportingCategories;
    }
  }
}
