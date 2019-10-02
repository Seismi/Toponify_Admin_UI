import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constants } from '../../constants';

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
  @Input() radioPage = false;

  architectureTabs = Constants.ARCHITECTURE_TABS;
  reportLibraryTabs = Constants.REPORT_LIBRARY_TABS;
  attributesTabs = Constants.ATTRIBUTE_TABS;
  workPackageTabs = Constants.WORKPACKAGE_TABS;
  radioTabs = Constants.RADIO_TABS;

  @Output() rightTab = new EventEmitter<number>();

  openRightTab(index: number) {
    this.rightTab.emit(index);
  }
}
