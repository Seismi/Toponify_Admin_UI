import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'smi-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSideBarComponent {
  @Input() objectSelected: boolean;
  @Input() multipleSelected: boolean;
  @Input() filterLevel: string;
  @Input() clickedOnLink: boolean;

  @Output() rightTab = new EventEmitter<number>();

  openRightTab(index: number): void {
    this.rightTab.emit(index);
  }
}
