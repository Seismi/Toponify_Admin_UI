import { Component, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

@Component({
  selector: 'smi-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkPackageColorComponent implements OnInit {

  selectedColor: string;

  constructor(private diagramChangesService: DiagramChangesService) {}

  colors = this.diagramChangesService.colors

  ngOnInit() {
    this.colors.forEach(function(item, index) {
      console.log(item, index)
    })
  }

  @Output()
  selectColor = new EventEmitter();

  onSelect(color) {
    this.selectedColor = color;
    this.selectColor.emit(color);
  }
}