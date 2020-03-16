import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { DraggerPosition } from './dragger/dragger.component';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { Store } from '@ngrx/store';
import { getNodeLoadingStatus, getNodeLinkLoadingStatus } from '@app/architecture/store/selectors/node.selector';
import { LoadingStatus } from '@app/architecture/store/models/node.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-model-sidebar',
  templateUrl: './model-sidebar.component.html',
  styleUrls: ['./model-sidebar.component.scss']
})
export class ModelSidebarComponent implements OnInit, OnDestroy {
  @Input() minWidth = 300;
  @Input() maxWidth = 400;
  @Input() isLast: boolean;

  subscriptions: Subscription[] = [];

  loadingStatus: LoadingStatus = LoadingStatus.loaded;

  resizing = false;

  get draggerPosition(): DraggerPosition {
    return this.isLast ? DraggerPosition.right : DraggerPosition.left;
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private store: Store<NodeState>,
    private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.setElementWidth(this.minWidth);
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.subscriptions.push(
      this.store.select(getNodeLoadingStatus).subscribe(status => {
        this.loadingStatus = status;
        this.ref.detectChanges();
      })
    );
    this.subscriptions.push(
      this.store.select(getNodeLinkLoadingStatus).subscribe(status => {
        this.loadingStatus = status;
        this.ref.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
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
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${width}px`);
  }
}
