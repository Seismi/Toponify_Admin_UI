import { Component, OnInit, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'app-toolbar-column',
  templateUrl: './toolbar-column.component.html',
  styleUrls: ['./toolbar-column.component.scss']
})
export class ToolbarColumnComponent implements OnInit {
  @Input() isLast: boolean;
  @Input() fillFreeSpace: boolean;
  constructor(public elementRef: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    if (this.isLast) {
      this.renderer.setElementClass(
        this.elementRef.nativeElement,
        'isLast',
        true
      );
    }

    if (this.fillFreeSpace) {
      this.renderer.setElementClass(
        this.elementRef.nativeElement,
        'fillFreeSpace',
        true
      );
    }
  }
}
