import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { ArchitecturePaletteComponent } from '../../components/architecture-palette/architecture-palette.component';

@Component({
  selector: 'smi-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent {
  @Input() workPackageIsEditable = false;
  @Input() data: any;
  @Input() selectedLeftTab: number;

  constructor() {}

  @Output()
  displayOptionsChangedEvent = new EventEmitter();

  @Output()
  selectWorkPackage = new EventEmitter();

  @Output()
  selectColor = new EventEmitter<object>();

  @Output()
  setWorkpackageEditMode = new EventEmitter<object>();

  @Output()
  hideLeftPane = new EventEmitter();

  @ViewChild(ArchitecturePaletteComponent)
  private paletteComponent: ArchitecturePaletteComponent;

  displayOptionsChanged({ event, option }: { event: any; option: string }) {
    this.displayOptionsChangedEvent.emit({ event, option });
    this.paletteComponent.updateDisplayOptions(event, option);
  }

  // FIXME: set proper type of workpackage
  onSetWorkPackageEditMode(workpackage: any) {
    this.setWorkpackageEditMode.emit(workpackage);
  }

  onSelectWorkPackage(id) {
    this.selectWorkPackage.emit(id);
  }

  onSelectColor(event) {
    this.selectColor.emit(event);
  }

  onHidePane() {
    this.hideLeftPane.emit();
  }
}
