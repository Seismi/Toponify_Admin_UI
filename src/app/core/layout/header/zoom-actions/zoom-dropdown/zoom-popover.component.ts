import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-zoom-popover',
  templateUrl: './zoom-popover.component.html',
  styleUrls: ['./zoom-popover.component.scss']
})
export class ZoomPopoverComponent implements OnInit {
  @Input() zoomLevel: number;
  @Input() viewLevel: number;

  @Output() viewLevelSelected = new EventEmitter();
  @Output() zoomLevelSelected = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onViewLevelSelect(level: any) {
    this.viewLevelSelected.emit(level);
  }

  onZoomLevelSelect(level: any) {
    this.zoomLevelSelected.emit(level);
  }
}
