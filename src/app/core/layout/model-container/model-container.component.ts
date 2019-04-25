import { Component, OnInit, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'app-model-container',
  templateUrl: './model-container.component.html',
  styleUrls: ['./model-container.component.scss']
})
export class ModelContainerComponent implements OnInit {
  @Input() topPadding = 0;

  constructor(public elementRef: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    if (this.topPadding !== 0) {
      this.renderer.setElementStyle(
        this.elementRef.nativeElement,
        'padding-top',
        `${this.topPadding}px`
      );
    }
  }
}
