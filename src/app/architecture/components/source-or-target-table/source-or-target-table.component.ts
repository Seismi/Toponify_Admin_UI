import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'smi-source-or-target-table',
  templateUrl: './source-or-target-table.component.html',
  styleUrls: ['./source-or-target-table.component.scss']
})
export class SourceOrTargetTableComponent {
  @Input() sourceObject: { id: string, name: string };
  @Input() targetObject: { id: string, name: string };
  @Input() workPackageIsEditable: boolean;
  @Output() edit = new EventEmitter<string>();
  @Output() switchSourceAndTarget = new EventEmitter<void>();
}
