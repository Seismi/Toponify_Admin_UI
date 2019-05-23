import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-zoom-slider',
  templateUrl: './zoom-slider.component.html',
  styleUrls: ['./zoom-slider.component.scss']
})
export class ZoomSliderComponent implements OnInit {
  public max = 4;
  public min = 1;

  @ViewChild('slider') slider;
  @Input() zoomLevel: number;
  @Output() zoomLevelSelected = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  change() {
    this.zoomLevelSelected.emit(this.slider.displayValue);
  }

  zoomOut() {
    if(this.zoomLevel > 1) {
      this.zoomLevelSelected.emit(this.zoomLevel - 1);
    }
  }

  zoomIn() {
    if(this.zoomLevel < 4) {
      this.zoomLevelSelected.emit(this.zoomLevel + 1);
    }
  }
}
