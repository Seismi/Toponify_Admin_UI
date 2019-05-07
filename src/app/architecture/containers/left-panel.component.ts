import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { ArchitecturePaletteComponent } from '../components/architecture-palette/architecture-palette.component';

@Component({
  selector: 'smi-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent {

  @Input() showTable = false;
  @Input() showPalette = true;
  @Input() allowMove: boolean;

  constructor() { }

  @Output()
  addAttribute = new EventEmitter();

  @Output()
  addRule = new EventEmitter();

  @Output()
  displayOptionsChangedEvent = new EventEmitter();

  onAddAttribute() {
    this.addAttribute.emit();
  }

  onAddRule() {
    this.addRule.emit();
  }

  @ViewChild(ArchitecturePaletteComponent)
  private paletteComponent: ArchitecturePaletteComponent;

  displayOptionsChanged({event, option}: {event: any, option: string}) {
    this.displayOptionsChangedEvent.emit({event, option});
    this.paletteComponent.updateDisplayOptions(event, option);
  }
}
