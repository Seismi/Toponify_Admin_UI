import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() filterLevel: string;

  @Output() rightTab = new EventEmitter<number>();

  openRightTab(index: number) {
    this.rightTab.emit(index);
  }
}
