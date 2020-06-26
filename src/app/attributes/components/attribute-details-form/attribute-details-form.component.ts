import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Tag } from '@app/architecture/store/models/node.model';
import { AttributeDetail } from '../../store/models/attributes.model';

@Component({
  selector: 'smi-attribute-details-form',
  templateUrl: './attribute-details-form.component.html',
  styleUrls: ['./attribute-details-form.component.scss']
})
export class AttributeDetailsFormComponent {
  public categories: string[] = ['attribute', 'rule'];
  public group: FormGroup;
  private values;

  @Input() workPackageIsEditable: boolean;
  @Input() availableTags: Tag[];
  @Input() tags: Tag[];
  @Input() relatedAttribute: AttributeDetail[];

  @Input('group') set setGroup(group) {
    this.group = group;
    this.values = group.value;
  }

  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() addTag = new EventEmitter<string>();
  @Output() removeTag = new EventEmitter<Tag>();
  @Output() updateAvailableTags = new EventEmitter<void>();
  @Output() addRelatedAttribute = new EventEmitter<void>();
  @Output() deleteRelatedAttribute = new EventEmitter<string>();

  onCancel(): void {
    this.group.reset(this.values);
  }
}
