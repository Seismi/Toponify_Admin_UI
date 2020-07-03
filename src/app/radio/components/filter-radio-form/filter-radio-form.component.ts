import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from '@app/settings/store/models/user.model';
import { Constants } from '@app/core/constants';
import { Node, Tag } from '@app/architecture/store/models/node.model';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/format-datepicker';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

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
  @Input() workpackages: WorkPackageEntity[];
  @Input() tags: Tag[];
  @Input() group: FormGroup;

  public status: string[] = Constants.RADIO_STATUS;
  public types: string[] = Constants.RADIO_CATEGORIES;

  @ViewChild('searchComponents') searchComponents: ElementRef;
  @ViewChild('searchUsers') searchUsers: ElementRef;

  assignedToComparison(option: any, value: any): boolean {
    return option && value ? option.id === value.id : false;
  }

  relatesToComparison(option: any, value: any): boolean {
    return option && value ? option.id === value.id : false;
  }

  filterComponents(node: Node): boolean {
    const searchValue = this.searchComponents.nativeElement.value;
    return searchValue !== '' && node.name.toLowerCase().indexOf(searchValue.toLowerCase()) === -1;
  }

  filterUsers(user: User): string | boolean {
    const searchValue = this.searchUsers.nativeElement.value;
    return searchValue !== '' && user.firstName.toLowerCase().indexOf(searchValue.toLowerCase()) === -1;
  }
}
