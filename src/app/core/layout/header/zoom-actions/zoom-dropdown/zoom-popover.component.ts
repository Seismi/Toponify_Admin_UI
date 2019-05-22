import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-zoom-popover',
  templateUrl: './zoom-popover.component.html',
  styleUrls: ['./zoom-popover.component.scss']
})
export class ZoomPopoverComponent implements OnInit, AfterViewInit {
  @Input() zoomLevel: number;
  @Input() viewLevel: number;

  @Output() viewLevelSelected = new EventEmitter();
  @Output() zoomLevelSelected = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.zoomLevel = this.viewLevel;
  }

  onViewLevelSelect(level: any) {
    this.viewLevelSelected.emit(level);
    this.zoomLevel = level;
  }

  onZoomLevelSelect(level: any) {
    this.zoomLevelSelected.emit(level);
    this.viewLevel = level;
  }
}
