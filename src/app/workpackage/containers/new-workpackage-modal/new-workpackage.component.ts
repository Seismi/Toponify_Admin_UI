import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewWorkpackageValidatorService } from '@app/workpackage/components/new-workpackage-form/services/new-workpackage-validator.service';
import { NewWorkpackageService } from '@app/workpackage/components/new-workpackage-form/services/new-workpackage.service';
import { FormGroup } from '@angular/forms';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackage-modal',
  templateUrl: './new-workpackage.component.html',
  styleUrls: ['./new-workpackage.component.scss'],
  providers: [NewWorkpackageValidatorService, NewWorkpackageService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class WorkPackageModalComponent implements OnInit {

  public workpackage: WorkPackageEntity;

  constructor(
    private newWorkpackageService: NewWorkpackageService,
    public dialogRef: MatDialogRef<WorkPackageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.workpackage = data.workpackage;
    }


  ngOnInit() { }


  get newWorkpackageForm(): FormGroup {
    return this.newWorkpackageService.newWorkpackageForm;
  }


  onSubmit(data: any) {
    if (!this.newWorkpackageService.isValid) {
      return;
    }
    this.dialogRef.close({ workpackage: this.newWorkpackageForm.value });
  }

  
  onCancelClick() {
    this.dialogRef.close();
  }

}
