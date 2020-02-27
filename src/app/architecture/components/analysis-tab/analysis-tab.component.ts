import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { FormGroup } from '@angular/forms';
import { Level } from '@app/architecture/services/diagram-level.service';

const SeverityFilter = [
  {
    level: 1,
    text: 'Show All RADIO'
  },
  {
    level: 2,
    text: 'Show all RADIO except lowest'
  },
  {
    level: 3,
    text: 'Show RADIO with severity medium and above'
  },
  {
    level: 4,
    text: 'Show RADIO with high and highest severity'
  },
  {
    level: 5,
    text: 'Only show highest severity RADIO'
  }
];

@Component({
  selector: 'smi-analysis-tab',
  templateUrl: './analysis-tab.component.html',
  styleUrls: ['./analysis-tab.component.scss']
})
export class AnalysisTabComponent implements OnChanges {
  public defaultLayout: string = '00000000-0000-0000-0000-000000000000';

  @Input() viewLevel: Level;
  @Input() checked: boolean;
  @Input() layout: LayoutDetails;
  @Input() group: FormGroup;

  public severityFilter = SeverityFilter;

  @Output() displayOptionsChanged = new EventEmitter<{
    event: MatCheckboxChange;
    option: string;
  }>();
  @Output() filterRadioSeverity = new EventEmitter<void>();
  @Output() collapseAllNodes = new EventEmitter<void>();
  @Output() summariseAllNodes = new EventEmitter<void>();
  @Output() expandAll = new EventEmitter<void>();
  @Output() addLayout = new EventEmitter<void>();

  @ViewChild('Description') Description;
  @ViewChild('Tags') Tags;
  @ViewChild('Owners') Owners;

  // When changed to reporting concepts level, hide description, tags and owners by default
  ngOnChanges(changes: SimpleChanges) {
    if (changes.viewLevel && changes.viewLevel.currentValue !== changes.viewLevel.previousValue) {
      if (this.viewLevel === Level.reportingConcept) {
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

  ngOnInit(): void {
    this.group.disable();
  }

  checkboxClicked(event: MatCheckboxChange, option: string): void {
    this.displayOptionsChanged.emit({ event: event, option: option });
  }

}
