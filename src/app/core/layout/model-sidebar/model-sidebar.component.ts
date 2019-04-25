import { Component, OnInit, Input, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { DraggerPosition } from './dragger/dragger.component';

@Component({
  selector: 'app-model-sidebar',
  templateUrl: './model-sidebar.component.html',
  styleUrls: ['./model-sidebar.component.scss']
})
export class ModelSidebarComponent implements OnInit, OnDestroy {
  @Input() minWidth  = 300;
  @Input() maxWidth  = 400;
  @Input() isLast: boolean;

  resizing = false;

  get draggerPosition(): DraggerPosition {
    return this.isLast ? DraggerPosition.right : DraggerPosition.left;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    this.setElementWidth(this.minWidth);
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  handleMouseDown() {
    this.resizing = true;
  }

  handleMouseMove(event: any) {
    if (!this.resizing) {
      return;
    }
    const newWidth = this.scaleDependOnPosition(event.clientX);
    // tslint:disable-next-line:no-unused-expression
    this.isResizable(newWidth) && this.setElementWidth(newWidth);

  }

  handleMouseUp() {
    this.resizing = false;
  }

  private scaleDependOnPosition(clientX: number) {
    const additional = 0;
    if (this.isLast) {
      const bodyWidth = document.body.getBoundingClientRect().width;
      return Number((bodyWidth - clientX).toFixed(0)) + additional;
    }
    return clientX + additional;
  }

  private isResizable(newWidth: number) {
    return newWidth < this.maxWidth && newWidth > this.minWidth;
  }

  private setElementWidth(width: number) {
    this.renderer.setElementStyle(
      this.elementRef.nativeElement,
      'width',
      `${width}px`
    );
  }
}
