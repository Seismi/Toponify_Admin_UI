import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange, MatTabChangeEvent } from '@angular/material';
import { ArchitectureView } from '@app/architecture/components/switch-view-tabs/architecture-view.model';

@Component({
  selector: 'smi-switch-view-tabs',
  templateUrl: './switch-view-tabs.component.html',
  styleUrls: ['./switch-view-tabs.component.scss']
})
export class SwitchViewTabsComponent {
  @Input() selectedView: ArchitectureView;

  constructor() {}

  @Output() viewChange = new EventEmitter<ArchitectureView>();

  onTabClick(event: MatTabChangeEvent) {
    this.viewChange.emit(event.index);
  }

}
