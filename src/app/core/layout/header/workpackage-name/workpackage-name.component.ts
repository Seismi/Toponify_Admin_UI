import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackage-name',
  templateUrl: './workpackage-name.component.html',
  styleUrls: ['./workpackage-name.component.scss']
})
export class WorkPackageNameComponent implements OnInit {
  @Input() workPackageName: string;
  @Input() workPackageIsEditable: boolean;
  @Input() selectedWorkPackageEntities: WorkPackageEntity[];

  constructor() {}

  ngOnInit() {}

  @Output() exitWorkPackageEditMode = new EventEmitter<WorkPackageEntity[]>();

  onExitWorkPackageEditMode(): void {
    this.exitWorkPackageEditMode.emit(this.selectedWorkPackageEntities);
  }
}
