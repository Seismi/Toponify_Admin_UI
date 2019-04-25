import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { VersionFormService } from './services/version-form.service';
import { VersionValidatorService } from './services/version-form-validator.service';
import { CopyVersion } from '@app/version/store/models/version.model';

@Component({
  selector: 'app-versions-modal',
  templateUrl: './versions-modal.component.html',
  styleUrls: ['./versions-modal.component.scss'],
  providers: [VersionFormService, VersionValidatorService]
})

export class VersionsModalComponent implements OnInit, OnDestroy {

  public isEditMode: boolean;
  public mode: string;
  version: CopyVersion;

  get versionForm(): FormGroup {
    return this.versionFormService.versionForm;
  }

  constructor(
    private versionFormService: VersionFormService,
    public dialogRef: MatDialogRef<VersionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    this.version = data.version;
    (this.mode === 'edit' || this.mode === 'copy')
      ? this.isEditMode = true
      : this.isEditMode = false;
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.versionFormService.versionForm.patchValue({
        name: this.version.name,
        description: this.version.description,
        status: this.version.status,
        id: (this.mode === 'edit') ? this.version.id : null,
        isCopy: (this.mode === 'copy') ? true : false,
        copyFromId: (this.mode === 'copy') ? this.version.copyFromId  : null,
      });
    }
  }

  ngOnDestroy() {
  }

  onSubmit(data: any) {
    if (!this.versionFormService.isValid) {
      return;
    }
    this.dialogRef.close({ version: this.versionForm.value, mode: this.mode});
  }

  onCancelClick() {
    this.dialogRef.close();
  }


}
