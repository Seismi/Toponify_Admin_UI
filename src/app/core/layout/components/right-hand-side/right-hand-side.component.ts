import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'smi-right-hand-side',
  templateUrl: './right-hand-side.component.html',
  styleUrls: ['./right-hand-side.component.scss']
})
export class RightHandSideComponent {
  @Input() disabled = false;
  @Input() title: string;
  @Input() canEdit = true;
  @Output() add = new EventEmitter<void>();

  onAdd(): void {
    this.add.emit();
  }
}
