import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

@Component({
  selector: 'smi-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkPackageColorComponent {

  @Input() workpackageColour;

  constructor(private diagramChangesService: DiagramChangesService) {}

  @Output()
  selectColour = new EventEmitter();

  get colours() {
    return [
      '#f44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFEB3B',
      '#FFC107',
      '#FF9800',
      '#FF5722',
      '#795548',
      '#9E9E9E',
      '#607D8B'
    ];
  }

  onSelect(colour) {
    this.workpackageColour = colour;
    this.selectColour.emit(colour);
  }
}
