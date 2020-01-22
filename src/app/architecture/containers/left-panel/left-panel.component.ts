import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { FormGroup } from '@angular/forms';
import { Level } from '@app/architecture/services/diagram-level.service';
import { ArchitectureDiagramComponent } from '@app/architecture/components/architecture-diagram/architecture-diagram.component';

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
  @Input() viewLevel: Level;
  @Input() canSelectWorkpackages: boolean;
  @Input() tabIndex: number;
  @Input() layoutSettingsTab: boolean;
  @Input() layout: LayoutDetails;
  @Input() group: FormGroup;
  @Input() allowEditLayouts: string;

  @ViewChild('mainTabGroup') mainTabGroup: MatTabGroup;

  constructor() {}

  @Output() displayOptionsChangedEvent = new EventEmitter<{ event: MatCheckboxChange; option: string }>();

  @Output() selectWorkPackage = new EventEmitter<{ id: string; newState: boolean }>();

  @Output() selectColour = new EventEmitter<{ colour: string; id: string }>();

  @Output()
  setWorkpackageEditMode = new EventEmitter<object>();

  @Output() hideLeftPane = new EventEmitter<void>();

  @Output()
  tabClick = new EventEmitter<number>();

  @Output() addLayout = new EventEmitter<void>();

  @Output() filterRadioSeverity = new EventEmitter<void>();

  @Output() collapseAllNodes = new EventEmitter<void>();

  @Output() summariseAllNodes = new EventEmitter<void>();

  @Output() editLayout = new EventEmitter<void>();

  @Output() expandAll = new EventEmitter<void>();

  @Output() downloadImage = new EventEmitter<void>();

  onDownloadImage(): void {
    this.downloadImage.emit();
  }

  realignTabUnderline(): void {
    this.mainTabGroup.realignInkBar();
  }

  displayOptionsChanged({ event, option }: { event: MatCheckboxChange; option: string }): void {
    this.displayOptionsChangedEvent.emit({ event, option });
  }

  // FIXME: set proper type of workpackage
  onSetWorkPackageEditMode(workpackage: WorkPackageEntity): void {
    this.setWorkpackageEditMode.emit(workpackage);
  }

  onSelectWorkPackage(selection: { id: string; newState: boolean }): void {
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

  onFilterRadioSeverity(): void {
    this.filterRadioSeverity.emit();
  }

  onCollapseAllNodes(): void {
    this.collapseAllNodes.emit();
  }

  onSummariseAllNodes(): void {
    this.summariseAllNodes.emit();
  }

  onEditLayout(): void {
    this.editLayout.emit();
  }

  onExpandAll(): void {
    this.expandAll.emit();
  }
}
