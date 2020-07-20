import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { HomeTabs } from './home-tabs.model';

@Component({
  selector: 'smi-home-tabs',
  templateUrl: './home-tabs.component.html',
  styleUrls: ['./home-tabs.component.scss']
})
export class HomeTabsComponent {
  @Input() selectedTab: HomeTabs;
  @Input() favouritesLength: number;
  @Input() notificationsLength: number;
  @Input() radiosLength: number;
  @Input() workPackagesLength: number;

  constructor() { }

  @Output() homeTabChange = new EventEmitter<HomeTabs>();

  onTabClick(event: MatTabChangeEvent): void {
    this.homeTabChange.emit(event.index);
  }
}
