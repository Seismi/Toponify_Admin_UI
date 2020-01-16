import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { ScopesAndLayoutsDetailService } from '@app/scopes-and-layouts/components/scopes-and-layouts-detail/services/scopes-and-layouts-detail.service';
import { ScopesAndLayoutsValidatorService } from '@app/scopes-and-layouts/components/scopes-and-layouts-detail/services/scopes-and-layouts-detail-validator.service';

@Component({
  selector: 'smi-scope-and-layout-modal',
  templateUrl: './scope-and-layout-modal.component.html',
  styleUrls: ['./scope-and-layout-modal.component.scss'],
  providers: [ScopesAndLayoutsDetailService, ScopesAndLayoutsValidatorService]
})
export class ScopeAndLayoutModalComponent implements OnInit {
  public title: string;
  public isEditable: boolean = true;
  public modalMode: boolean = true;

  constructor(
    private scopesAndLayoutsDetailService: ScopesAndLayoutsDetailService,
    public dialogRef: MatDialogRef<ScopeAndLayoutModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
  }

  ngOnInit(): void {}

  get scopesAndLayoutsDetailForm(): FormGroup {
    return this.scopesAndLayoutsDetailService.scopesAndLayoutsDetailForm;
  }

  onSave(): void {
    if (!this.scopesAndLayoutsDetailService.isValid) {
      return;
    }

    this.dialogRef.close({ scopeAndLayout: this.scopesAndLayoutsDetailForm.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
