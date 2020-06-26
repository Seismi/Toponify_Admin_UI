import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';
import { Tag, TagApplicableTo, NodeDetail, layers, nodeCategories } from '@app/architecture/store/models/node.model';
import { Node } from 'gojs';

const systemCategories = [
  nodeCategories.transactional,
  nodeCategories.analytical,
  nodeCategories.reporting,
  nodeCategories.masterData,
  nodeCategories.file,
  nodeCategories.transformation
];
const dataNodeCategories = [
  nodeCategories.dataStructure,
  nodeCategories.dataSet,
  nodeCategories.masterDataSet,
  nodeCategories.transformation
];
const dimensionCategories = [
  nodeCategories.dimension,
  nodeCategories.transformation
];
const reportingCategories = [
  nodeCategories.list,
  nodeCategories.structure,
  nodeCategories.key,
  nodeCategories.transformation
];

@Component({
  selector: 'smi-object-details-form',
  templateUrl: './object-details-form.component.html',
  styleUrls: ['./object-details-form.component.scss']
})
export class ObjectDetailsFormComponent {
  public group: FormGroup;
  private values;
  @Input() nodeCategory: string;
  @Input() owners: OwnersEntityOrTeamEntityOrApproversEntity[];
  @Input('group') set setGroup(group) {
    this.group = group;
    this.values = group.value;
  }

  @Input() sourceObject: any;
  @Input() targetObject: any;
  @Input() workPackageIsEditable = false;
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

  getCategories(): string[] {
    switch (this.part.data.layer as layers) {
      case layers.system:
        return this.part instanceof Node ? systemCategories : [nodeCategories.masterData, nodeCategories.data];
      case layers.data:
        return this.part instanceof Node ? dataNodeCategories : [nodeCategories.masterData, nodeCategories.data];
      case layers.dimension:
        return this.part instanceof Node ? dimensionCategories : [nodeCategories.masterData];
      case layers.reportingConcept:
        return this.part instanceof Node ? reportingCategories : [nodeCategories.masterData];
    }
  }

  nodeIsEditable(): boolean {
    return (!this.workPackageIsEditable || this.nodeCategory === nodeCategories.copy) ? true : false;
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

  get isLink(): boolean {
    return (this.part.data.layer === layers.reportingConcept)
      ? false : this.clickedOnLink || this.nodeCategory === nodeCategories.transformation ? true : false;
  }

  getDisable(category?: nodeCategories): boolean {
    return this.part.data.layer === layers.data
      && [nodeCategories.dataStructure, nodeCategories.transformation].includes(category || this.part.data.category) ? true : false;
  }

  disableIfShared(): boolean {
    return this.part.data.isShared ? true : false;
  }

}
