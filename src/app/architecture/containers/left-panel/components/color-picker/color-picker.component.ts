import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

@Component({
  selector: 'smi-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkPackageColorComponent {

  @Input() workpackageColor;

  constructor(private diagramChangesService: DiagramChangesService) {}

  @Output()
  selectColor = new EventEmitter();

  onSelect(color) {
    this.workpackageColor = color;
    this.selectColor.emit(color);
  } 
}