import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NodeDetail, layers } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-group-info-table',
  templateUrl: './group-info-table.component.html',
  styleUrls: ['./group-info-table.component.scss']
})
export class GroupInfoTableComponent {
  @Input() layer: layers;
  @Input() groupInfo: NodeDetail;
  @Input() workPackageIsEditable: boolean;
  @Output() editGroup = new EventEmitter<void>();
  @Output() deleteNodeGroup = new EventEmitter<void>();

  getDisable(): boolean {
    return !this.workPackageIsEditable || this.layer === layers.data ? true : false;
  }
}
