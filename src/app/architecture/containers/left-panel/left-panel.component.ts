import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'smi-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent {
  @Input() workPackageIsEditable = false;
  @Input() workpackages: any;
  @Input() selectedLeftTab: number;
  @Input() checked: boolean;
  @Input() viewLevel: number;
  @Input() canSelectWorkpackages: boolean;
  @Input() tabIndex: number;

  constructor() {}

  @Output() displayOptionsChangedEvent = new EventEmitter<{ event: MatCheckboxChange; option: string }>();

  @Output() selectWorkPackage = new EventEmitter<string>();

  @Output() selectColour = new EventEmitter<{ colour: string; id: string }>();

  @Output()
  setWorkpackageEditMode = new EventEmitter<object>();

  @Output()
  tabClick = new EventEmitter<number>();

  displayOptionsChanged({ event, option }: { event: MatCheckboxChange; option: string }) {
    this.displayOptionsChangedEvent.emit({ event, option });
  }

  // FIXME: set proper type of workpackage
  onSetWorkPackageEditMode(workpackage: any) {
    this.setWorkpackageEditMode.emit(workpackage);
  }

  onSelectWorkPackage(id: string) {
    this.selectWorkPackage.emit(id);
  }

  onSelectColour(event: { colour: string; id: string }) {
    this.selectColour.emit(event);
  }

  onTabClick(event) {
    this.tabClick.emit(event.index);
  }

}
