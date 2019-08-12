import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSideBarComponent {

    tabs = ['Work Packages'];

    @Output()
    openTab = new EventEmitter();
    
    onOpen(i) {
      this.openTab.emit(i);
    }
}