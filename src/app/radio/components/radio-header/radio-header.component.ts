import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'smi-radio-header',
  templateUrl: './radio-header.component.html',
  styleUrls: ['./radio-header.component.scss']
})
export class RadioHeaderComponent { 

  public status = ["new", "open"]

  @Output() filter = new EventEmitter<void>();

  onFilter() {
    this.filter.emit();
  }

}