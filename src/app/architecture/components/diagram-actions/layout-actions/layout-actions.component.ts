import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
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
  @Input() selectedLayout: ScopeDetails;
  @Input() layouts: ScopeDetails[];
  @Input() dependenciesView: boolean;
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() showGrid = new EventEmitter<void>();
  @Output() zoomToFit = new EventEmitter<void>();
  @Output() downloadImage = new EventEmitter<void>();
  @Output() editLayout = new EventEmitter<void>();
  @Output() saveLayout = new EventEmitter<void>();
  @Output() saveAsLayout = new EventEmitter<void>();
  @Output() layoutSettings = new EventEmitter<void>();
  @Output() selectLayout = new EventEmitter<string>();
  @Output() addLayout = new EventEmitter<void>();

  constructor(private diagramChangesService: DiagramChangesService) { }
}
