import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-wp-baseline-dropdown',
  templateUrl: './wp-baseline-dropdown.component.html',
  styleUrls: ['./wp-baseline-dropdown.component.scss']
})
export class WpBaselineDropdownComponent {
  baselines: WorkPackageEntity[];
  baseline = new FormControl();
  @Input() selectedBaseline = [];

  @Input()
  set data(data: any[]) {
    this.baselines = data;
  }

  constructor() {}

  onSelect(event, baseline) {
    if (event.source.selected) {
      this.selectedBaseline.push(baseline);
    }
    if (!event.source.selected) {
      const index = this.selectedBaseline.indexOf(baseline);
      if (index > -1) {
        this.selectedBaseline.splice(index, 1);
      }
    }
  }
}
