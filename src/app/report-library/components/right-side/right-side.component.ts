import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-report-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.scss']
})
export class ReportRightSideComponent {
  @Output() addRadio = new EventEmitter<void>();

  onAdd() {
    this.addRadio.emit();
  }
}
