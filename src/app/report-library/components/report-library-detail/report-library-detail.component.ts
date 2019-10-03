import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity,
  OwnersEntity
} from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-library-detail',
  templateUrl: 'report-library-detail.component.html',
  styleUrls: ['report-library-detail.component.scss']
})
export class ReportLibraryDetailComponent {
  @Input() isEditable = false;
  @Input() group: FormGroup;
  @Input() dataSets: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];
  @Input() owners: OwnersEntity[];
  @Input() dimensions: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];
  @Input() reportingConcepts: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];

  onSave() {
    this.isEditable = false;
  }

  onEdit() {
    this.isEditable = true;
  }

  onCancel() {
    this.isEditable = false;
  }

  onDelete() {}
}
