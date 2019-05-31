import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackage-dropdown',
  templateUrl: './workpackage-dropdown.component.html',
  styleUrls: ['./workpackage-dropdown.component.scss']
})
export class WorkPackageDropdownComponent {

  workpackage: any[];

  @Input()
  set data(data: WorkPackageEntity[]) {
    this.workpackage = data;
  }

  @Output()
  selectWorkpackage = new EventEmitter();

  onSelect(id, event) {
    if(event.isUserInput) {
      if(event.source.selected) {
        this.selectWorkpackage.emit(id)
      }
    }
  }

}