import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'smi-report-owners-table',
  templateUrl: 'owners-table.component.html',
  styleUrls: ['owners-table.component.scss']
})
export class ReportOwnersTableComponent {
  @Input() data: any;
  @Input() workPackageIsEditable: boolean;
  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();
}
