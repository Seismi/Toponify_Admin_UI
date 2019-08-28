import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'smi-analysis-tab',
  templateUrl: './analysis-tab.component.html',
  styleUrls: ['./analysis-tab.component.scss']
})
export class AnalysisTabComponent {

  @Input() checked: boolean;

  @Output()
  displayOptionsChanged = new EventEmitter();

  @Input()
  viewLevel: number;

  constructor() { }

  checkboxClicked(event: any, option: string): void {
    this.displayOptionsChanged.emit({event: event, option: option});
  }
}
