import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

const booleanTypes: string[] = ['true', 'false'];

@Component({
  selector: 'smi-properties-form',
  templateUrl: './properties-form.component.html',
  styleUrls: ['./properties-form.component.scss']
})
export class PropertiesFormComponent {
  @Input() group: FormGroup;
  @Input() type: string;
  public booleanTypes = booleanTypes;
}