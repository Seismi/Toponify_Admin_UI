import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/format-datepicker';

const booleanTypes: string[] = ['true', 'false'];

@Component({
  selector: 'smi-edit-documentation-standards-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class EditDocumentationStandardsFormComponent {
  @Input() group: FormGroup;
  @Input() type: string;
  public booleanTypes = booleanTypes;
}
