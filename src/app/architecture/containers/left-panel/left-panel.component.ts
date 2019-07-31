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

  constructor() { }

  @Output()
  displayOptionsChangedEvent = new EventEmitter();

  @Output()
  selectWorkPackage = new EventEmitter();

  @Output()
  selectColor = new EventEmitter<object>();

  @ViewChild(ArchitecturePaletteComponent)
  private paletteComponent: ArchitecturePaletteComponent;

  // Update left pelette after showing EDIT tab
  onUpdatePalette() { }

  displayOptionsChanged({event, option}: {event: any, option: string}) {
    this.displayOptionsChangedEvent.emit({event, option});
    this.paletteComponent.updateDisplayOptions(event, option);
  }

  onSelectWorkPackage(id) {
    this.selectWorkPackage.emit(id);
  }

  onSelectColor(event) {
    this.selectColor.emit(event);
  }

  @Output()
  hideLeftPane = new EventEmitter();

  onHidePane() {
    this.hideLeftPane.emit();
  }

}
