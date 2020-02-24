import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity,
  Dimension,
  OwnersEntity
} from '@app/report-library/store/models/report.model';
import { OwnersEntityOrTeamEntityOrApproversEntity, Tag } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-report-library-detail',
  templateUrl: 'report-library-detail.component.html',
  styleUrls: ['report-library-detail.component.scss']
})
export class ReportLibraryDetailComponent {
  public group: FormGroup;
  private values;
  @Input('group') set setGroup(group) {
    this.group = group;
    this.values = group.value;
  }

  @Input() isEditable: boolean;
  @Input() dataSets: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];
  @Input() system: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity;
  @Input() owners: OwnersEntity[];
  @Input() dimensions: Dimension[];
  @Input() reportingConcepts: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];
  @Input() modalMode = false;
  @Input() workPackageIsEditable: boolean;
  @Input() selectedOwner: boolean;
  @Input() selectedOwnerIndex: any;
  @Input() tags: Tag[];
  @Input() availableTags: Tag[];

  @Output() saveReport = new EventEmitter<void>();
  @Output() deleteReport = new EventEmitter<string>();
  @Output() addOwner = new EventEmitter<void>();
  @Output() selectOwner = new EventEmitter<OwnersEntityOrTeamEntityOrApproversEntity>();
  @Output() deleteOwner = new EventEmitter<void>();
  @Output() editSourceSystem = new EventEmitter<void>();
  @Output() addDataSets = new EventEmitter<void>();
  @Output() removeDataSet = new EventEmitter<string>();
  @Output() dimensionEdit = new EventEmitter<Dimension>();
  @Output() addTag = new EventEmitter<string>();
  @Output() removeTag = new EventEmitter<Tag>();
  @Output() updateAvailableTags = new EventEmitter<void>();

  onSave(): void {
    this.saveReport.emit();
  }

  onCancel(): void {
    this.group.reset(this.values);
  }

  onDelete(): void {
    this.deleteReport.emit();
  }

  onAddOwner(): void {
    this.addOwner.emit();
  }

  onSelectOwner(owner: OwnersEntityOrTeamEntityOrApproversEntity): void {
    this.selectOwner.emit(owner);
  }

  onDeleteOwner(): void {
    this.deleteOwner.emit();
  }

  onSourceEdit(): void {
    this.editSourceSystem.emit();
  }

  onDatasetAdd(): void {
    this.addDataSets.emit();
  }

  onRemoveDataSet(id: string): void {
    this.removeDataSet.emit(id);
  }

  onDimensionEdit(dimension: Dimension): void {
    this.dimensionEdit.emit(dimension);
  }
}
