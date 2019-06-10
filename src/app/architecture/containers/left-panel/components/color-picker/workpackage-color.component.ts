import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

@Component({
  selector: 'smi-workpackage-color',
  templateUrl: './workpackage-color.component.html',
  styleUrls: ['./workpackage-color.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkPackageColorComponent {

  selectedColor: string;

  constructor(private diagramChangesService: DiagramChangesService) {}

  @Output()
  selectColor = new EventEmitter();

  onSelect(color) {
    this.selectColor.emit(color);
    this.selectedColor = color;
  }
}