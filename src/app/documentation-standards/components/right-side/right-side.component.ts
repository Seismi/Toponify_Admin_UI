import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-document-standards-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.scss']
})
export class DocumentStandardsRightSideComponent {
  @Input() title: string;

  @Output() add = new EventEmitter<void>();

  onAdd() {
    this.add.emit();
  }
}