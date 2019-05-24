import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-quicklinks-actions',
  templateUrl: './quicklinks-actions.component.html',
  styleUrls: ['./quicklinks-actions.component.scss']
})
export class QuicklinksActionsComponent implements OnInit {

  @Input()
  set data(data: WorkPackageEntity[]) {
    this.workpackage = data;
  }

  @Input() gojsView = false;
  @Input() allowEditLayouts: string;
  @Input() allowEditWorkPackages: string;
  workpackage: any[];

  ngOnInit() {
    this.allowEditLayouts = 'edit';
    this.allowEditWorkPackages = 'edit';
  }

  @Output()
  editWorkPackage = new EventEmitter();

  @Output()
  editLayout = new EventEmitter();

  allowEditWorkPackage() {
    this.editWorkPackage.emit();
  }

  allowEditLayout() {
    this.editLayout.emit();
  }

}