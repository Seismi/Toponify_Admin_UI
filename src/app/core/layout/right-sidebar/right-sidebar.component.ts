import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'smi-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSideBarComponent {
  @Input() workPackagePage: boolean = false;
  @Input() attributesPage: boolean = false;
  @Input() reportLibraryPage: boolean = false;
  @Input() architecturePage: boolean = false;
  @Input() architectureRadioTab: boolean = false;
  @Input() architectureDetailsTab: boolean = false;
  @Input() radioPage: boolean = false;


  @Output() rightTab = new EventEmitter<number>();

  openRightTab(index: number) {
    this.rightTab.emit(index);
  }
  
}