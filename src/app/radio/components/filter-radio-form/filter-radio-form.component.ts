import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from '@app/settings/store/models/user.model';
import { Constants } from '@app/core/constants';
import { Node } from '@app/nodes/store/models/node.model';

@Component({
  selector: 'smi-filter-radio-form',
  templateUrl: './filter-radio-form.component.html',
  styleUrls: ['./filter-radio-form.component.scss']
})

export class FilterRadioFormComponent {

  @Input() users: User[];
  @Input() nodes: Node[];
  @Input() group: FormGroup;

  public status: string[] = Constants.RADIO_STATUS;
  public types: string[] = Constants.RADIO_CATEGORIES;

}