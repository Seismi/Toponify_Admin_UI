import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-scopes-detail',
  templateUrl: './scopes-detail.component.html',
  styleUrls: ['./scopes-detail.component.scss']
})
export class ScopesDetailComponent {

  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() data: any;
  @Input() selectedScopes = [];
  @Input() ownersList: any;
  @Input() viewersList: any;

  layerFilter = ['system', 'data sets', 'dimensions', 'reporting concepts'];

  @Output()
  deleteScope = new EventEmitter();

  onEdit() {
    this.isEditable = true;
  }

  onSave() {
    this.isEditable = false;
  }
  
  onCancel() {
    this.isEditable = false;
  }

  onDelete() {
    this.deleteScope.emit();
  }
  
}