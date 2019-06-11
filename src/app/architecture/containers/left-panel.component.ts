import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { ArchitecturePaletteComponent } from '../components/architecture-palette/architecture-palette.component';

@Component({
  selector: 'smi-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent {

  @Input() workPackageIsEditable = false;

  constructor() { }

  @Output()
  displayOptionsChangedEvent = new EventEmitter();

  @ViewChild(ArchitecturePaletteComponent)
  private paletteComponent: ArchitecturePaletteComponent;

  displayOptionsChanged({event, option}: {event: any, option: string}) {
    this.displayOptionsChangedEvent.emit({event, option});
    this.paletteComponent.updateDisplayOptions(event, option);
  }
}
