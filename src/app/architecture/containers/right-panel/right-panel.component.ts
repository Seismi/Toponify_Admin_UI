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
  @Input() attributes: any;
  @Input() radio: any;
  @Input() properties: any;
  @Input() workpackages: any;

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
  addRadio = new EventEmitter();

  @Output()
  addAttribute = new EventEmitter();

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

  onAddRadio() {
    this.addRadio.emit();
  }

  onAddAttribute() {
    this.addAttribute.emit();
  }

}
