import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScopeEntity, ScopeDetails } from '@app/scope/store/models/scope.model';

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
  @Input() selectedLayout: ScopeDetails;

  @Output()
  editLayout = new EventEmitter();

  @Output() selectScope = new EventEmitter<string>();

  @Output()
  selectLayout = new EventEmitter();

  @Output()
  addLayout = new EventEmitter<void>();

  ngOnInit() {
    this.allowEditLayouts = 'brush';
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

  onAddLayout(): void {
    this.addLayout.emit();
  }
}
