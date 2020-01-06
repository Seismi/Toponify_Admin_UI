import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'smi-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent {
  @Input() status: string;

  @Output() filter = new EventEmitter<void>();
  @Output() resetFilter = new EventEmitter<void>();

  onFilter(): void {
    this.filter.emit();
  }

  onReset(): void {
    this.resetFilter.emit();
  }
}
