import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-zoom-slider-list',
  templateUrl: './zoom-slider-list.component.html',
  styleUrls: ['./zoom-slider-list.component.scss']
})
export class ZoomSliderListComponent implements OnInit {
  @Input() viewLevel;
  @Output() viewLevelSelected = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onViewLevelSelect(level: any) {
    this.viewLevelSelected.emit(level);
  }
}
