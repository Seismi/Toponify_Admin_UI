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
  public max = 5;
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
    this.zoomLevelSelected.emit(this.zoomLevel - 1);
  }

  zoomIn() {
    this.zoomLevelSelected.emit(this.zoomLevel + 1);
  }
}
