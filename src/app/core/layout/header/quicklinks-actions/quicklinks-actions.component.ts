import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-quicklinks-actions',
  templateUrl: './quicklinks-actions.component.html',
  styleUrls: ['./quicklinks-actions.component.scss']
})
export class QuicklinksActionsComponent implements OnInit {

  @Input() gojsView = false;
  @Input() allowEditLayouts: string;
  @Input() allowEditWorkPackages: string;
  @Input() workpackages: any;
  @Input() scopes: any;
  @Input() layouts: any;

  ngOnInit() {
    this.allowEditLayouts = 'edit';
    this.allowEditWorkPackages = 'edit';
  }

  @Output()
  editWorkPackage = new EventEmitter();

  @Output()
  editLayout = new EventEmitter();

  @Output()
  selectWorkPackage = new EventEmitter();

  @Output()
  selectScope = new EventEmitter();

  @Output()
  selectLayout = new EventEmitter();

  
  allowEditWorkPackage() {
    this.editWorkPackage.emit();
  }

  allowEditLayout() {
    this.editLayout.emit();
  }

  onSelectWorkPackage(id) {
    this.selectWorkPackage.emit(id);
  }

  onSelectScope(id) {
    this.selectScope.emit(id);
  }

  onSelectLayout(id) {
    this.selectLayout.emit(id);
  }

}