import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScopeEntity, ScopeDetails } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-quicklinks-actions',
  templateUrl: './quicklinks-actions.component.html',
  styleUrls: ['./quicklinks-actions.component.scss']
})
export class QuicklinksActionsComponent {
  @Input() gojsView = false;
  @Input() scopes: any;
  @Input() layouts: any;
  @Input() selectedScope: ScopeEntity;
  @Input() selectedLayout: ScopeDetails;

  @Output() selectScope = new EventEmitter<string>();

  @Output()
  selectLayout = new EventEmitter();

  @Output()
  addLayout = new EventEmitter<void>();

  onSelectScope(id) {
    this.selectScope.emit(id);
  }

  onSelectLayout(id) {
    this.selectLayout.emit(id);
  }

  onAddLayout(): void {
    this.addLayout.emit();
  }
}
