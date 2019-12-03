import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'smi-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkPackageColorComponent {
  @Input() workpackageColour: string;
  @Output() selectColour = new EventEmitter<string>();

  constructor() {}

  get colours(): string[] {
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

  onSelect(colour: string) {
    this.workpackageColour = colour;
    this.selectColour.emit(colour);
  }
}
