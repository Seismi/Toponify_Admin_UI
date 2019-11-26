import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'smi-radio-header',
  templateUrl: './radio-header.component.html',
  styleUrls: ['./radio-header.component.scss']
})
export class RadioHeaderComponent { 

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