import {Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'smi-analysis-tab',
  templateUrl: './analysis-tab.component.html',
  styleUrls: ['./analysis-tab.component.scss']
})
export class AnalysisTabComponent {

  @Input() checked: boolean;

  @Output()
  displayOptionsChanged = new EventEmitter();

  constructor() { }

  checkboxClicked(event: any, option: string): void {
    this.displayOptionsChanged.emit({event: event, option: option});
  }

}
