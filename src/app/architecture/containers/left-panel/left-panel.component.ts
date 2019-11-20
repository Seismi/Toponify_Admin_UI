import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent {
  @Input() workPackageIsEditable: boolean = false;
  @Input() workpackages: WorkPackageEntity[];
  @Input() selectedLeftTab: number;
  @Input() checked: boolean;
  @Input() viewLevel: number;
  @Input() canSelectWorkpackages: boolean;
  @Input() tabIndex: number;
  @Input() layoutSettingsTab: boolean;

  @ViewChild('mainTabGroup') mainTabGroup: MatTabGroup;

  realignTabUnderline(): void {
    this.mainTabGroup.realignInkBar();
  }

  constructor() {}

  @Output() displayOptionsChangedEvent = new EventEmitter<{ event: MatCheckboxChange; option: string }>();

  @Output() selectWorkPackage = new EventEmitter<{id: string, newState: boolean}>();

  @Output() selectColour = new EventEmitter<{ colour: string; id: string }>();

  @Output()
  setWorkpackageEditMode = new EventEmitter<object>();

  @Output() hideLeftPane = new EventEmitter<void>();

  @Output()
  tabClick = new EventEmitter<number>();

  @Output() addLayout = new EventEmitter<void>();

  displayOptionsChanged({ event, option }: { event: MatCheckboxChange; option: string }): void {
    this.displayOptionsChangedEvent.emit({ event, option });
  }

  // FIXME: set proper type of workpackage
  onSetWorkPackageEditMode(workpackage: WorkPackageEntity): void {
    this.setWorkpackageEditMode.emit(workpackage);
  }

  onSelectWorkPackage(selection: {id: string, newState: boolean}): void {
    this.selectWorkPackage.emit(selection);
  }

  onSelectColour(event: { colour: string; id: string }) {
    this.selectColour.emit(event);
  }

  onTabClick(event: MatTabChangeEvent): void {
    this.tabClick.emit(event.index);
    this.realignTabUnderline();
  }

  onHideLeftPane(): void {
    this.hideLeftPane.emit();
  }

  onAddLayout(): void {
    this.addLayout.emit();
  }

}
