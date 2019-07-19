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
  @Input() selectedOwners = [];
  @Input() selectedViewers = [];

  layerFilter = ['system', 'data set', 'dimension', 'reporting concept'];

  @Output()
  deleteScope = new EventEmitter();

  @Output()
  saveScope = new EventEmitter();

  onEdit() {
    this.isEditable = true;
  }

  onSave() {
    this.isEditable = false;
    this.saveScope.emit();
  }
  
  onCancel() {
    this.isEditable = false;
  }

  onDelete() {
    this.deleteScope.emit();
  }
  
}