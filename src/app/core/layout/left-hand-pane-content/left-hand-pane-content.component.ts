import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-left-hand-pane-content',
  templateUrl: './left-hand-pane-content.component.html',
  styleUrls: ['./left-hand-pane-content.component.scss']
})
export class LeftHandPaneContentComponent {
  @Output() close = new EventEmitter<void>();
}