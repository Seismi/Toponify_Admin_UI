import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-toolbar-column',
  templateUrl: './toolbar-column.component.html',
  styleUrls: ['./toolbar-column.component.scss']
})
export class ToolbarColumnComponent implements OnInit {
  @Input() isLast: boolean;
  @Input() fillFreeSpace: boolean;
  constructor(public elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.isLast) {
      this.renderer.addClass(this.elementRef.nativeElement, 'isLast');
    }

    if (this.fillFreeSpace) {
      this.renderer.addClass(this.elementRef.nativeElement, 'fillFreeSpace');
    }
  }
}
