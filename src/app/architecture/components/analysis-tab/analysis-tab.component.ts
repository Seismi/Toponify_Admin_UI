import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'smi-analysis-tab',
  templateUrl: './analysis-tab.component.html',
  styleUrls: ['./analysis-tab.component.scss']
})
export class AnalysisTabComponent implements OnChanges {
  @Input() checked: boolean;

  @Output() displayOptionsChanged = new EventEmitter<{
    event: MatCheckboxChange;
    option: string;
  }>();

  @Input() viewLevel: number;

  @ViewChild('Description') Description;
  @ViewChild('Tags') Tags;
  @ViewChild('Owners') Owners;

  // When changed to reporting concepts level, hide description, tags and owners by default
  ngOnChanges(changes: SimpleChanges) {
    if (changes.viewLevel && changes.viewLevel.currentValue !== changes.viewLevel.previousValue) {
      if (this.viewLevel === 4) {
        const checkboxes = [this.Description, this.Tags, this.Owners];

        checkboxes.forEach(
          function(checkbox) {
            checkbox.checked = false;
            checkbox.change.emit({ checked: false, source: checkbox });
          }.bind(this)
        );
      }
    }
  }

  constructor() {}

  checkboxClicked(event: MatCheckboxChange, option: string): void {
    this.displayOptionsChanged.emit({ event: event, option: option });
  }
}
