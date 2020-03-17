import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'smi-source-or-target-table',
  templateUrl: './source-or-target-table.component.html',
  styleUrls: ['./source-or-target-table.component.scss']
})
export class SourceOrTargetTableComponent {
  @Input() title: string;
  @Input() data: any;
  @Output() edit = new EventEmitter<void>();
  @Input() workPackageIsEditable: boolean;
}
