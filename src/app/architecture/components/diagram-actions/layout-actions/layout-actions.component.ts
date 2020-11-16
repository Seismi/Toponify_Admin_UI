import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
import { Level } from '@app/architecture/services/diagram-level.service';
import { Store } from '@ngrx/store';
import { State as ArchitectureState } from '@app/architecture/store/reducers/architecture.reducer';
import { UndoLayoutChange } from '@app/architecture/store/actions/node.actions';
import {DiagramViewChangesService} from '@app/architecture/services/diagram-view-changes.service';

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
  @Input() scope: ScopeDetails;
  @Input() filterLevel: string;
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

  constructor(
    public diagramViewChangesService: DiagramViewChangesService,
    private store: Store<ArchitectureState>
  ) { }

  get sourceOrTargetView(): boolean {
    return this.filterLevel === Level.sources || this.filterLevel === Level.targets;
  }

  undo(): void {
    this.store.dispatch(new UndoLayoutChange());
  }
}
