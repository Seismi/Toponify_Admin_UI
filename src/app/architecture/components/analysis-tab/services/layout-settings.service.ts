import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Injectable()
export class LayoutSettingsService {
  public layoutSettingsForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
}
