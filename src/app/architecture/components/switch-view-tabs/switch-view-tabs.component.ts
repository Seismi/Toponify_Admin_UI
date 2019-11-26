import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { ArchitectureView } from '@app/architecture/components/switch-view-tabs/architecture-view.model';

@Component({
  selector: 'smi-switch-view-tabs',
  templateUrl: './switch-view-tabs.component.html',
  styleUrls: ['./switch-view-tabs.component.scss']
})
export class SwitchViewTabsComponent {
  @Input() selectedView: ArchitectureView;
  @Input() viewLevel: number;

  constructor() {}

  @ViewChild('architectureTableTabs') architectureTableTabs: MatTabGroup;

  @Output() viewChange = new EventEmitter<ArchitectureView>();

  onTabClick(event: MatTabChangeEvent): void {
    this.viewChange.emit(event.index);
  }

  getLabel(): string {
    switch (this.viewLevel) {
      case 1:
        return 'Systems';
      case 2:
        return 'Data sets';
      case 3:
        return 'Dimensions';
      case 4:
        return 'Reporting Concepts';
      default:
        return 'Systems';
    }
  }

  getLinkLabel(): string {
    if(this.viewLevel === 1 || this.viewLevel === 2) {
      return 'Interfaces'
    } else {
      return 'Links'
    }
  }
}
