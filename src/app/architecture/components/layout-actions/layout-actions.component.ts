import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-layout-actions',
  templateUrl: './layout-actions.component.html',
  styleUrls: ['./layout-actions.component.scss']
})
export class LayoutActionsComponent {
  @Input() grid: boolean;
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() showGrid = new EventEmitter<void>();
  @Output() zoomToFit = new EventEmitter<void>();
  @Output() downloadImage = new EventEmitter<void>();
}
