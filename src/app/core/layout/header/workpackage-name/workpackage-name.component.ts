import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackage-name',
  templateUrl: './workpackage-name.component.html',
  styleUrls: ['./workpackage-name.component.scss']
})
export class WorkPackageNameComponent {
  @Input() selectedWorkPackageEntities: WorkPackageEntity[];
  @Input() workPackageIsEditable: boolean;

  @Output() exitWorkPackageEditMode = new EventEmitter<WorkPackageEntity[]>();

  showWorkPackages(): string {
    const workPackageNameArray = this.selectedWorkPackageEntities.map(workpackage => workpackage['name']);
    return workPackageNameArray.slice(0, 2).map(name => name).join(' & ');
  }

  getSelectedWorkPackages(): string {
    return this.selectedWorkPackageEntities.map(workpackage => workpackage.name).join("\n");
  }

}
