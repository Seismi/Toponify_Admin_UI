import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScopeEntity } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-quicklinks-actions',
  templateUrl: './quicklinks-actions.component.html',
  styleUrls: ['./quicklinks-actions.component.scss']
})
export class QuicklinksActionsComponent implements OnInit {
  @Input() gojsView = false;
  @Input() allowEditLayouts: string;
  @Input() scopes: any;
  @Input() layouts: any;
  @Input() selectedScope: ScopeEntity;

  @Output()
  editLayout = new EventEmitter();

  @Output() selectScope = new EventEmitter<string>();

  @Output()
  selectLayout = new EventEmitter();

  ngOnInit() {
    this.allowEditLayouts = 'edit';
  }

  allowEditLayout() {
    this.editLayout.emit();
  }

  onSelectScope(id) {
    this.selectScope.emit(id);
  }

  onSelectLayout(id) {
    this.selectLayout.emit(id);
  }
}
