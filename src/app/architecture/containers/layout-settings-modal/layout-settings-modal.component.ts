import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LayoutDetails } from '@app/layout/store/models/layout.model';

@Component({
  selector: 'smi-layout-settings-modal',
  templateUrl: './layout-settings-modal.component.html',
  styleUrls: ['./layout-settings-modal.component.scss']
})
export class LayoutSettingsModalComponent implements OnInit {
  public layoutSettingsForm: FormGroup;
  public layout: LayoutDetails;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LayoutSettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.layoutSettingsForm = this.fb.group({
        showDataLinks: [null],
        showMasterDataLinks: [null]
      });
      this.layout = data.layout;
    }

  @Output() displayOptionsChanged = new EventEmitter<{ event: MatCheckboxChange; option: string; }>();

  ngOnInit() {
    this.layoutSettingsForm.patchValue({
      showDataLinks: this.layout.settings.links.showDataLinks,
      showMasterDataLinks: this.layout.settings.links.showMasterDataLinks
    });
    console.log(this.layout.settings.links);
  }

  onSubmit(): void {
    this.dialogRef.close({ value: this.layoutSettingsForm.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  checkboxClicked(event: MatCheckboxChange, option: string): void {
    this.displayOptionsChanged.emit({ event: event, option: option });
  }

}
