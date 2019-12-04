import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-layout-actions',
  templateUrl: './layout-actions.component.html',
  styleUrls: ['./layout-actions.component.scss']
})
export class LayoutActionsComponent implements OnInit {
  @Input() showOrHideGrid: string;

  constructor() {}

  @Output()
  showGrid = new EventEmitter();

  @Output()
  zoomMap = new EventEmitter();

  ngOnInit() {
    this.showOrHideGrid = 'border_inner';
  }

  onShow() {
    this.showGrid.emit();
  }

  onZoom() {
    this.zoomMap.emit();
  }
}
