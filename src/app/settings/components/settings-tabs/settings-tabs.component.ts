import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Roles } from '@app/core/directives/by-role.directive';

@Component({
  selector: 'smi-settings-tabs',
  templateUrl: './settings-tabs.component.html',
  styleUrls: ['./settings-tabs.component.scss']
})
export class SettingsTabsComponent {
  @Input() selectedTabIndex: number;

  public Roles = Roles;

  constructor() {}

  @Output() tabClick = new EventEmitter<MatTabChangeEvent>();

  onTabClick(event: MatTabChangeEvent): void {
    this.tabClick.emit(event);
  }
}
