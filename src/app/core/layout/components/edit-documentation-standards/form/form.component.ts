import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

const booleanTypes: string[] = ['true', 'false'];

@Component({
  selector: 'smi-edit-documentation-standards-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class EditDocumentationStandardsFormComponent {
  @Input() group: FormGroup;
  @Input() type: string;
  public booleanTypes = booleanTypes;
}