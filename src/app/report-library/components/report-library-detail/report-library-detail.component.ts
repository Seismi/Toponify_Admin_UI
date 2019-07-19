import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-report-library-detail',
  templateUrl: 'report-library-detail.component.html',
  styleUrls: ['report-library-detail.component.scss']
})
export class ReportLibraryDetailComponent {

  @Input() isEditable = false;
  @Input() group: FormGroup;
  @Input() dataSets: any;
  @Input() owners: any;
  @Input() dimensions: any;
  @Input() reportingConcepts: any;

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