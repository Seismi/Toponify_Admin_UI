import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatTabGroup } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent {
  @Input() workPackageIsEditable = false;
  @Input() workpackages: WorkPackageEntity[];
  @Input() selectedLeftTab: number;
  @Input() checked: boolean;
  @Input() viewLevel: number;
  @Input() canSelectWorkpackages: boolean;
  @Input() tabIndex: number;

  @ViewChild('mainTabGroup') mainTabGroup: MatTabGroup; 

  realignTabUnderline(): void { 
    this.mainTabGroup.realignInkBar(); 
  }

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
  onSetWorkPackageEditMode(workpackage: WorkPackageEntity) {
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
    this.realignTabUnderline();
  }

}
