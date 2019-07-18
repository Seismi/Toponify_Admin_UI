import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent {

  @Input() group: FormGroup;
  @Input() clickedOnLink = false;
  @Input() nodeSelected = true;
  @Input() isEditable = false;
  @Input() data: any;
  @Input() workPackageIsEditable = false;
  @Input() selectedRightTab: number;

  constructor() { }

  ngOnInit() {}

  @Output()
  saveAttribute = new EventEmitter();

  @Output()
  deleteAttribute = new EventEmitter();

  @Output()
  editDetails = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Output()
  hideRightPane = new EventEmitter();

  onSaveAttribute() {
    this.saveAttribute.emit();
  }

  onEditDetails() {
    this.editDetails.emit();
  }

  onDeleteAttribute() {
    this.deleteAttribute.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onHidePane() {
    this.hideRightPane.emit();
  }

}
