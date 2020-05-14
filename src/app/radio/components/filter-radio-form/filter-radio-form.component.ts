import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from '@app/settings/store/models/user.model';
import { Constants } from '@app/core/constants';
import { Node } from '@app/architecture/store/models/node.model';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/format-datepicker';

@Component({
  selector: 'smi-filter-radio-form',
  templateUrl: './filter-radio-form.component.html',
  styleUrls: ['./filter-radio-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class FilterRadioFormComponent {
  @Input() users: User[];
  @Input() nodes: Node[];
  @Input() group: FormGroup;

  public status: string[] = Constants.RADIO_STATUS;
  public types: string[] = Constants.RADIO_CATEGORIES;

  assignedToComparison(option: any, value: any): boolean {
    return option && value ? option.id === value.id : false;
  }

  relatesToComparison(option: any, value: any): boolean {
    return option && value ? option.id === value.id : false;
  }
}
