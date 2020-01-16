import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'smi-settings-tabs',
  templateUrl: './settings-tabs.component.html',
  styleUrls: ['./settings-tabs.component.scss']
})
export class SettingsTabsComponent {
  @Input() selectedTabIndex: number;

  constructor() {}

  @Output() tabClick = new EventEmitter<MatTabChangeEvent>();

  onTabClick(event: MatTabChangeEvent): void {
    this.tabClick.emit(event);
  }
}
