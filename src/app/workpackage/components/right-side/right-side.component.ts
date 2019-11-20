import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-workpackage-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.scss']
})
export class WorkPackageRightSideComponent { 
  @Output() addWorkPackage = new EventEmitter<void>();

  onAdd(): void {
    this.addWorkPackage.emit();
  }
}