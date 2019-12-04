import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-model-container',
  templateUrl: './model-container.component.html',
  styleUrls: ['./model-container.component.scss']
})
export class ModelContainerComponent implements OnInit {
  @Input() topPadding = 0;

  constructor(public elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.topPadding !== 0) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'padding-top', `${this.topPadding}px`);
    }
  }
}
