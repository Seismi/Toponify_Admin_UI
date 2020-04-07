import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScopeEntity, ScopeDetails } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-quicklinks-actions',
  templateUrl: './quicklinks-actions.component.html',
  styleUrls: ['./quicklinks-actions.component.scss']
})
export class QuicklinksActionsComponent {
  @Input() gojsView = false;
  @Input() scopes: ScopeDetails;
  @Input() selectedScope: ScopeEntity;

  @Output() selectScope = new EventEmitter<string>();

  @Output()
  selectLayout = new EventEmitter();

  onSelectScope(id) {
    this.selectScope.emit(id);
  }
}
