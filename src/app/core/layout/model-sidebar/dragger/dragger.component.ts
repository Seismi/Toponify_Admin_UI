import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

export enum DraggerPosition {
  left,
  right
}

@Component({
  selector: 'app-sidebar-dragger',
  templateUrl: './dragger.component.html',
  styleUrls: ['./dragger.component.scss']
})
export class DraggerComponent implements OnInit, OnChanges {
  @Input() position: DraggerPosition = DraggerPosition.left;
  @Input() active: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.position === DraggerPosition.left) {
      this.renderer.addClass(this.elementRef.nativeElement, 'left');
    }

    if (this.position === DraggerPosition.right) {
      this.renderer.addClass(this.elementRef.nativeElement, 'right');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.active.currentValue) {
      this.renderer.addClass(this.elementRef.nativeElement, 'active');
    }
  }
}
