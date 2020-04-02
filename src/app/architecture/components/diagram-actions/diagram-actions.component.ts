import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-diagram-actions',
  templateUrl: './diagram-actions.component.html',
  styleUrls: ['./diagram-actions.component.scss']
})
export class DiagramActionsComponent {
  @Input() grid: boolean;
  @Input() allowMove: boolean;
  @Input() allowSave = false;
  @Input() allowSaveAs = false;
  @Input() dependenciesView: boolean;
  @Input() filterLevel: string;
  @Input() selectedLayout: ScopeDetails;
  @Input() layouts: ScopeDetails[];
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() showGrid = new EventEmitter<void>();
  @Output() zoomToFit = new EventEmitter<void>();
  @Output() downloadImage = new EventEmitter<void>();
  @Output() editLayout = new EventEmitter<void>();
  @Output() saveLayout = new EventEmitter<void>();
  @Output() saveAsLayout = new EventEmitter<void>();
  @Output() layoutSettings = new EventEmitter<void>();
  @Output() selectLayout = new EventEmitter<any>();
  @Output() exitDependenciesView = new EventEmitter<void>();
  @Output() exitUsageView = new EventEmitter<void>();
  @Output() addLayout = new EventEmitter<void>();
}
