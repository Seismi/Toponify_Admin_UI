import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-layout-actions',
  templateUrl: './layout-actions.component.html',
  styleUrls: ['./layout-actions.component.scss']
})
export class LayoutActionsComponent implements OnInit {

  @Input() showOrHide: string;
  @Input() navigate: string;

  constructor() {}

  ngOnInit() {
    this.showOrHide = 'border_inner';
    this.navigate = 'control_camera';
  }

  
  @Output()
  showGrid = new EventEmitter();

  @Output()
  navigateDiagram = new EventEmitter();

  @Output()
  zoomMap = new EventEmitter();


  onShow(){
    this.showGrid.emit();
  }

  onNavigate(){
    this.navigateDiagram.emit();
  }

  onZoom(){
    this.zoomMap.emit();
  }
  
}
