import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

const layers = ['system', 'data set', 'dimension', 'reporting concept'];

@Component({
  selector: 'smi-scopes-and-layouts-detail',
  templateUrl: './scopes-and-layouts-detail.component.html',
  styleUrls: ['./scopes-and-layouts-detail.component.scss']
})
export class ScopesAndLayoutsDetailComponent {
  public layerFilter: string[] = layers;

  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() layoutDetails = false;

  @Output() delete = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() open = new EventEmitter<void>();

  onEdit(): void {
    this.isEditable = true;
  }

  onSave(): void {
    this.isEditable = false;
    this.save.emit();
  }

  onCancel(): void {
    this.isEditable = false;
  }
}
