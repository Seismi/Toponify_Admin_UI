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
  @Input() workPackageIsEditable = false;
  @Input() selectedRightTab: number;
  @Input() attributes: any;
  @Input() relatedRadios: any;
  @Input() properties: any;
  @Input() workpackages: any;
  @Input() objectSelected = false;
  @Input() radio: any;

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
  addRelatedRadio = new EventEmitter();

  @Output()
  addAttribute = new EventEmitter();

  @Output()
  hideRightPane = new EventEmitter();

  @Output()
  addRadio = new EventEmitter();


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

  onAddRelatedRadio() {
    this.addRelatedRadio.emit();
  }

  onAddAttribute() {
    this.addAttribute.emit();
  }

  onAddRadio() {
    this.addRadio.emit();
  }

}
