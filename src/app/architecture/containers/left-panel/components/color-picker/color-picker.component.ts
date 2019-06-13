import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

@Component({
  selector: 'smi-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkPackageColorComponent {

  selectedColor: string;

  constructor(private diagramChangesService: DiagramChangesService) {}

  @Output()
  selectColor = new EventEmitter();

  onSelect(color) {
    this.selectedColor = color;
    this.selectColor.emit(color);
  }
}