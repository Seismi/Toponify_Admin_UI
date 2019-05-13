import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-new-workpackage-form',
  templateUrl: './new-workpackage-form.component.html',
  styleUrls: ['./new-workpackage-form.component.scss']
})
export class NewWorkpackageFormComponent  {

    @Input() group: FormGroup;

    public workpackageStatus = ['approved', 'draft'];

}