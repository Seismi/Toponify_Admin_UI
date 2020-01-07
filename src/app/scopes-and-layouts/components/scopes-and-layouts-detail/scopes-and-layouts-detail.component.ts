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
  @Input() isEditable: boolean = false;
  @Input() modalMode: boolean = false;
  @Input() layoutDetails: boolean = false;

  @Output() delete = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

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

  onDelete(): void {
    this.delete.emit();
  }
}