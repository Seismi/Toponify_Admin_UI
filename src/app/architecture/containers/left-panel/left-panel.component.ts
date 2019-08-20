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
  @Input() viewLevel: number;

  constructor() { }

  @Output()
  displayOptionsChangedEvent = new EventEmitter();

  @Output()
  selectWorkPackage = new EventEmitter();

  @Output()
  selectColour = new EventEmitter<object>();

  @Output()
  hideLeftPane = new EventEmitter();

  @ViewChild(ArchitecturePaletteComponent)
  private paletteComponent: ArchitecturePaletteComponent;

  displayOptionsChanged({event, option}: {event: any, option: string}) {
    this.displayOptionsChangedEvent.emit({event, option});
    this.paletteComponent.updateDisplayOptions(event, option);
  }

  onSelectWorkPackage(id) {
    this.selectWorkPackage.emit(id);
  }

  onSelectColour(event) {
    this.selectColour.emit(event);
  }

  onHidePane() {
    this.hideLeftPane.emit();
  }

}
