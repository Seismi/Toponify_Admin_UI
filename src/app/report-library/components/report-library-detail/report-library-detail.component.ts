import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity,
  Dimension,
  OwnersEntity
} from '@app/report-library/store/models/report.model';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-report-library-detail',
  templateUrl: 'report-library-detail.component.html',
  styleUrls: ['report-library-detail.component.scss']
})
export class ReportLibraryDetailComponent {
  @Input() isEditable: boolean;
  @Input() group: FormGroup;
  @Input() dataSets: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];
  @Input() system: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity;
  @Input() owners: OwnersEntity[];
  @Input() dimensions: Dimension[];
  @Input() reportingConcepts: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];
  @Input() modalMode = false;
  @Input() workPackageIsEditable: boolean;
  @Input() selectedOwner: boolean;
  @Input() selectedOwnerIndex: any;

  @Output() saveReport = new EventEmitter<void>();
  @Output() editReport = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() deleteReport = new EventEmitter<string>();
  @Output() addOwner = new EventEmitter<void>();
  @Output() selectOwner = new EventEmitter<OwnersEntityOrTeamEntityOrApproversEntity>();
  @Output() deleteOwner = new EventEmitter<void>();
  @Output() editSourceSystem = new EventEmitter<void>();
  @Output() addDataSets = new EventEmitter<void>();
  @Output() removeDataSet = new EventEmitter<string>();
  @Output() dimensionEdit = new EventEmitter<Dimension>();

  onSave() {
    this.saveReport.emit();
  }

  onEdit() {
    this.editReport.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onDelete() {
    this.deleteReport.emit();
  }

  onAddOwner() {
    this.addOwner.emit();
  }

  onSelectOwner(owner: OwnersEntityOrTeamEntityOrApproversEntity) {
    this.selectOwner.emit(owner);
  }

  onDeleteOwner() {
    this.deleteOwner.emit();
  }

  onSourceEdit() {
    this.editSourceSystem.emit();
  }

  onDatasetAdd() {
    this.addDataSets.emit();
  }

  onRemoveDataSet(id: string) {
    this.removeDataSet.emit(id);
  }

  onDimensionEdit(dimension: Dimension) {
    this.dimensionEdit.emit(dimension);
  }
}
