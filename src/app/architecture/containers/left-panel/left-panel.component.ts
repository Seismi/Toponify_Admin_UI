import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { FormGroup } from '@angular/forms';
import { Level } from '@app/architecture/services/diagram-level.service';

@Component({
  selector: 'smi-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent {
  @Input() workPackageIsEditable: boolean;
  @Input() workpackages: WorkPackageEntity[];
  @Input() selectedLeftTab: number;
  @Input() checked: boolean;
  @Input() viewLevel: Level;
  @Input() canSelectWorkpackages: boolean;
  @Input() layout: LayoutDetails;
  @Input() group: FormGroup;
  @Input() currentFilterLevel: string;

  @Output() setWorkpackageEditMode = new EventEmitter<object>();
  @Output() tabClick = new EventEmitter<number>();
  @Output() addLayout = new EventEmitter<void>();
  @Output() filterRadioSeverity = new EventEmitter<void>();
  @Output() collapseAllNodes = new EventEmitter<void>();
  @Output() summariseAllNodes = new EventEmitter<void>();
  @Output() expandAll = new EventEmitter<void>();
  @Output() addInterface = new EventEmitter<string>();
  @Output() addLinkWithTransformation = new EventEmitter<void>();

  @Output() displayOptionsChangedEvent = new EventEmitter<{ event: MatCheckboxChange; option: string }>();
  @Output() selectWorkPackage = new EventEmitter<{ id: string; newState: boolean }>();
  @Output() selectColour = new EventEmitter<{ colour: string; id: string }>();

  displayOptionsChanged({ event, option }: { event: MatCheckboxChange; option: string }): void {
    this.displayOptionsChangedEvent.emit({ event, option });
  }

  onSelectWorkPackage(selection: { id: string; newState: boolean }): void {
    this.selectWorkPackage.emit(selection);
  }

  onSelectColour(event: { colour: string; id: string }) {
    this.selectColour.emit(event);
  }

  get mapView(): boolean {
    return [Level.systemMap, Level.dataSetMap].includes(this.currentFilterLevel as Level);
  }

}
