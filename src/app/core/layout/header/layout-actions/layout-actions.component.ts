import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-layout-actions',
  templateUrl: './layout-actions.component.html',
  styleUrls: ['./layout-actions.component.scss']
})
export class LayoutActionsComponent implements OnInit {

  @Input() showOrHideGrid: string;

  constructor() {}

  ngOnInit() {
    this.showOrHideGrid = 'border_inner';
  }

  @Output()
  showGrid = new EventEmitter();

  @Output()
  zoomMap = new EventEmitter();

  onShow(){
    this.showGrid.emit();
  }

  onZoom(){
    this.zoomMap.emit();
  }
}
