import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';
import { Tag, TagApplicableTo, NodeDetail } from '@app/architecture/store/models/node.model';
import { AttributeEntity } from '@app/attributes/store/models/attributes.model';
import { Node } from 'gojs';


const systemCategories = ['transactional', 'analytical', 'reporting', 'master data', 'file', 'transformation'];
const dataNodeCategories = ['data structure', 'data set', 'master data set', 'transformation'];
const dimensionCategories = ['dimension', 'transformation'];
const reportingCategories = ['list', 'structure', 'key', 'transformation'];

@Component({
  selector: 'smi-object-details-form',
  templateUrl: './object-details-form.component.html',
  styleUrls: ['./object-details-form.component.scss']
})
export class ObjectDetailsFormComponent {
  public group: FormGroup;
  private values;
  @Input() node: NodeDetail;
  @Input() nodeCategory: string;
  @Input() owners: OwnersEntityOrTeamEntityOrApproversEntity[];
  @Input('group') set setGroup(group) {
    this.group = group;
    this.values = group.value;
  }

  @Input() sourceObject: any;
  @Input() targetObject: any;

  @Input() workPackageIsEditable = false;
  @Input() attributesPage = false;
  @Input() relatedAttributes: AttributeEntity[];
  @Input() selectedRelatedIndex: string | null;
  @Input() selectAttribute: boolean;
  @Input() part: go.Part;
  @Input() availableTags: Tag[];
  @Input() tags: Tag[];
  @Input() componentLayer: TagApplicableTo;
  @Input() groupInfo: NodeDetail;
  @Input() clickedOnLink: boolean;

  constructor() {}

  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() addOwner = new EventEmitter<void>();
  @Output() deleteOwner = new EventEmitter<string>();
  @Output() editGroup = new EventEmitter<void>();
  @Output() deleteNodeGroup = new EventEmitter<void>();

  @Output() selectRelatedAttribute = new EventEmitter<string>();
  @Output() addRelatedAttribute = new EventEmitter<void>();
  @Output() deleteRelatedAttribute = new EventEmitter<void>();

  @Output() updateAvailableTags = new EventEmitter<void>();

  @Output() addTag = new EventEmitter<string>();
  @Output() createTag = new EventEmitter<Tag>();
  @Output() removeTag = new EventEmitter<Tag>();
  @Output() updateTag = new EventEmitter<Tag>();
  @Output() seeUsage = new EventEmitter<void>();
  @Output() seeDependencies = new EventEmitter<void>();
  @Output() viewStructure = new EventEmitter<void>();
  @Output() editSourceOrTarget = new EventEmitter<string>();
  @Output() switchSourceAndTarget = new EventEmitter<void>();

  onSave(): void {
    this.save.emit();
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

  onDeleteOwner(id: string): void {
    this.deleteOwner.emit(id);
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
    if (this.attributesPage) {
      return ['attribute', 'rule'];
    }
    switch (this.part.data.layer) {
      case 'system':
        return this.part instanceof Node ? systemCategories : ['master data', 'data'];
      case 'data':
        return this.part instanceof Node ? dataNodeCategories : ['master data', 'data'];
      case 'dimension':
        return this.part instanceof Node ? dimensionCategories : ['master data'];
      case 'reporting concept':
        return this.part instanceof Node ? reportingCategories : ['master data'];
    }
  }

  nodeIsEditable(): boolean {
    if (!this.workPackageIsEditable || this.nodeCategory === 'copy') {
      return true;
    }
    return false;
  }

  onUpdateAvailableTags() {
    this.updateAvailableTags.emit();
  }

  onAddTag(tag: string) {
    this.addTag.emit(tag);
  }

  onCreateTag(tag: Tag) {
    this.createTag.emit(tag);
  }

  onRemoveTag(tag: Tag): void {
    this.removeTag.emit(tag);
  }

  onUpdateTag(tag: Tag) {
    this.updateTag.emit(tag);
  }

  onSeeDependencies() {
    this.seeDependencies.emit();
  }

  onSeeUsage() {
    this.seeUsage.emit();
  }

  get isNode(): boolean {
    return this.part && this.part.data && !this.part.data.hasOwnProperty('sourceId');
  }

  isLink(): boolean {
    if (this.part.data.layer === 'reporting concept') {
      return false;
    } else if (this.clickedOnLink || this.nodeCategory === 'transformation') {
      return true;
    } else {
      return false;
    }
  }
}
