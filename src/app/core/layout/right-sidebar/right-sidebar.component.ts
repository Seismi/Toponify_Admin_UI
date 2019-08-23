import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSideBarComponent {

  @Input() workPackagePage = false;
  @Input() attributesPage = false;
  @Input() reportLibraryPage = false;
  @Input() architecturePage = false;
  @Input() architectureRadioTab = false;
  @Input() architectureDetailsTab = false;

  architectureTabs = ['Details', 'Attributes', 'Properties', 'RADIO', 'Work Packages'];
  reportLibraryTabs = ['Details', 'Attributes', 'Properties', 'RADIO', 'Work Packages'];
  attributesTabs = ['Details', 'Properties', 'RADIO', 'Work Packages'];
  workPackageTabs = ['Details', 'Properties', 'Objectives', 'RADIO', 'Change Summary'];

  @Output()
  rightTab = new EventEmitter();

  openRightTab(index: number) {
    this.rightTab.emit(index);
  }

}