import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { ArchitectureView } from '@app/architecture/components/switch-view-tabs/architecture-view.model';
import { Level } from '@app/architecture/services/diagram-level.service';

@Component({
  selector: 'smi-switch-view-tabs',
  templateUrl: './switch-view-tabs.component.html',
  styleUrls: ['./switch-view-tabs.component.scss']
})
export class SwitchViewTabsComponent {
  @Input() selectedView: ArchitectureView;
  @Input() viewLevel: Level;

  constructor() {}

  @ViewChild('architectureTableTabs') architectureTableTabs: MatTabGroup;

  @Output() viewChange = new EventEmitter<ArchitectureView>();

  onTabClick(event: MatTabChangeEvent): void {
    this.viewChange.emit(event.index);
  }

  getLinkLabel(): string {
    if (this.viewLevel === Level.system || this.viewLevel === Level.data) {
      return 'Interfaces';
    } else {
      return 'Links';
    }
  }
}
