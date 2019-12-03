import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-radio-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.scss']
})
export class RadioRightSideComponent {
  @Output() addRadio = new EventEmitter<void>();

  onAdd() {
    this.addRadio.emit();
  }
}
