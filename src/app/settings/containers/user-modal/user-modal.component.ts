import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MyUserFormService } from '../../components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '../../components/my-user-form/services/my-user-form-validator.service';
import { User } from '@app/settings/store/models/user.model'

@Component({
  selector: 'smi-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  providers: [MyUserFormService, MyUserFormValidatorService]
})

export class UserModalComponent implements OnInit {

  showButtons = false;
  isActive = true;
  disableEmailInput = false;
  public mode: string;
  public isEditMode: boolean;
  user: User;

  get myUserForm(): FormGroup {
    return this.myUserFormService.myUserForm;
  }

  constructor(private myUserFormService: MyUserFormService,
              public dialogRef: MatDialogRef<UserModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data : any) {
                this.mode = data.mode;
                this.user = data.user;
                (this.mode === 'edit')
                  ? this.isEditMode = true
                  : this.isEditMode = false;
              }
  
  ngOnInit() {
    if(this.isEditMode){
      this.disableEmailInput = true;
      this.myUserFormService.myUserForm.patchValue({
        id: this.user.id,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        password: this.user,
        phone: this.user.phone,
        team: this.user.team,
        roles: this.user.roles,
        userStatus: this.user.userStatus
      });
    }
  }

  onSubmit(data: any) {
    if (!this.myUserFormService.isValid) {
      return;
    }
    this.dialogRef.close({ user: this.myUserForm.value, mode: this.mode });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

}