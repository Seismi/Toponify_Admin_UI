import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

@Component({
  selector: 'smi-layout-actions',
  templateUrl: './layout-actions.component.html',
  styleUrls: ['./layout-actions.component.scss']
})
export class LayoutActionsComponent {
  @Input() grid: boolean;
  @Input() allowMove: boolean;
  @Input() allowSave = false;
  @Input() allowSaveAs = false;
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() showGrid = new EventEmitter<void>();
  @Output() zoomToFit = new EventEmitter<void>();
  @Output() downloadImage = new EventEmitter<void>();
  @Output() editLayout = new EventEmitter<void>();
  @Output() saveLayout = new EventEmitter<void>();
  @Output() saveAsLayout = new EventEmitter<void>();
  @Input() dependenciesView: boolean;

  constructor(private diagramChangesService: DiagramChangesService) { }
}
