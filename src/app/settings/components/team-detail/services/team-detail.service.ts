import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamValidatorService } from './team-detail-validator.service';

@Injectable()
export class TeamDetailService {
  public teamDetailForm: FormGroup;

  constructor(private fb: FormBuilder, private teamValidatorService: TeamValidatorService) {
    this.teamDetailForm = this.fb.group({
      name: [null, Validators.required],
      designAuthority: [null],
      description: [null],
      type: ['team']
    });
  }

  get isValid(): boolean {
    if (!this.teamDetailForm.valid) {
      this.teamValidatorService.validateAllFormFields(this.teamDetailForm);
      return false;
    }
    return true;
  }
}
