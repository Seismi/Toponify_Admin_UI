import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LayoutDetails } from '@app/layout/store/models/layout.model';

@Component({
  selector: 'smi-layout-settings-modal',
  templateUrl: './layout-settings-modal.component.html',
  styleUrls: ['./layout-settings-modal.component.scss']
})
export class LayoutSettingsModalComponent implements OnInit {
  public layoutSettingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LayoutSettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { layout: LayoutDetails }) {
      this.layoutSettingsForm = this.fb.group({
        components: new FormGroup({
          showTags: new FormControl(),
          showRADIO: new FormControl(),
          filterRADIOSeverity: new FormControl(),
          showDescription: new FormControl(),
          showOwners: new FormControl(),
          showNextLevel: new FormControl(),
          showAttributes: new FormControl(),
          showRules: new FormControl()
        }),
        links: new FormGroup({
          showDataLinks: new FormControl(),
          showMasterDataLinks: new FormControl(),
          showName: new FormControl(),
          showRADIO: new FormControl(),
          filterRADIOSeverity: new FormControl(),
          showAttributes: new FormControl(),
          showRules: new FormControl()
        })
      });
    }

  @Output() displayOptionsChanged = new EventEmitter<{ event: MatCheckboxChange; option: string; }>();

  ngOnInit(): void {
    this.layoutSettingsForm.patchValue({ ...this.data.layout.settings });
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
