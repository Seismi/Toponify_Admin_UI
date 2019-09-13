import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-object-details-form',
  templateUrl: './object-details-form.component.html',
  styleUrls: ['./object-details-form.component.scss']
})

export class ObjectDetailsFormComponent {

  @Input() owners: NodeDetail;
  @Input() group: FormGroup;
  @Input() clickedOnLink = false;
  @Input() isEditable = false;
  @Input() workPackageIsEditable = false;
  @Input() selectedOwner: boolean;
  @Input() selectedOwnerIndex: any;

  constructor() { }

  @Output()
  saveAttribute = new EventEmitter();

  @Output()
  deleteAttribute = new EventEmitter();

  @Output()
  editDetails = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Output()
  addOwner = new EventEmitter();

  @Output()
  selectOwner = new EventEmitter();

  @Output()
  deleteOwner = new EventEmitter();


  onEdit(){
    this.editDetails.emit();
  }

  onSave(){
    this.saveAttribute.emit();
    this.isEditable = false;
  }

  onCancel(){
    this.cancel.emit();
  }

  onDelete(){
    this.deleteAttribute.emit();
  }

  onAddOwner() {
    this.addOwner.emit();
  }

  onSelectOwner(ownerId: string) {
    this.selectOwner.emit(ownerId);
  }

  onDeleteOwner() {
    this.deleteOwner.emit();
  }

}