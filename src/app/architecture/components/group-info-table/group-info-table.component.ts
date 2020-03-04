import { Component, Output, EventEmitter, Input } from '@angular/core';
import { GroupInfo } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-group-info-table',
  templateUrl: './group-info-table.component.html',
  styleUrls: ['./group-info-table.component.scss']
})
export class GroupInfoTableComponent {
  @Input() groupInfo: GroupInfo;
  @Input() workPackageIsEditable: boolean;
  @Output() editGroup = new EventEmitter<void>();
}