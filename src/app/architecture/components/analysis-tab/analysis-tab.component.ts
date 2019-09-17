import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'smi-analysis-tab',
  templateUrl: './analysis-tab.component.html',
  styleUrls: ['./analysis-tab.component.scss']
})
export class AnalysisTabComponent {
  @Input() checked: boolean;

  @Output() displayOptionsChanged = new EventEmitter<{
    event: MatCheckboxChange;
    option: string;
  }>();

  @Input() viewLevel: number;

  constructor() {}

  checkboxClicked(event: MatCheckboxChange, option: string): void {
    this.displayOptionsChanged.emit({ event: event, option: option });
  }
}
