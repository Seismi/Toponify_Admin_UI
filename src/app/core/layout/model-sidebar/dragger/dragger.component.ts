import {
  Component,
  OnInit,
  Renderer,
  ElementRef,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';

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

  constructor(private elementRef: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    if (this.position === DraggerPosition.left) {
      this.renderer.setElementClass(
        this.elementRef.nativeElement,
        'left',
        true
      );
    }

    if (this.position === DraggerPosition.right) {
      this.renderer.setElementClass(
        this.elementRef.nativeElement,
        'right',
        true
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.renderer.setElementClass(this.elementRef.nativeElement, 'active', changes.active.currentValue);
    // tslint:disable-next-line:no-unused-expression
    changes.active.currentValue;
  }
}
