import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tag, TagApplicableTo, TagColour, TagIcon } from '@app/architecture/store/models/node.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectChange } from '@angular/material';

@Component({
  selector: 'smi-tag-detail',
  templateUrl: 'tag-detail-modal.component.html',
  styleUrls: ['tag-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagDetailModalComponent {
  public tagForm: FormGroup;
  public tagIcons: string[] = [];
  public applicableTo: string[] = [];
  public selectedApplicableTo: string[];
  public selectedIcon: string;
  public tagColour = TagColour;
  public tagApplicableTo = TagApplicableTo;
  public selectedColour: string;
  public currentComponentType: TagApplicableTo;

  get isEverywhereSelected(): boolean {
    return this.selectedApplicableTo.includes(TagApplicableTo.everywhere);
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TagDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tag: Tag;
      currentComponentType: TagApplicableTo;
    }
  ) {
    this.tagIcons = Object.values(TagIcon);
    this.applicableTo = Object.values(TagApplicableTo);
    this.currentComponentType = data.currentComponentType;
    if (data.tag) {
      this.selectedIcon = data.tag.iconName ? data.tag.iconName : 'none';
      this.selectedApplicableTo = data.tag.applicableTo;
      this.selectedColour = data.tag.backgroundColour;
      this.tagForm = this.fb.group({
        name: [data.tag.name, Validators.required],
        textColour: [data.tag.textColour],
        backgroundColour: [data.tag.backgroundColour],
        applicableTo: [data.tag.applicableTo],
        iconName: [this.selectedIcon]
      });
    } else {
      this.selectedIcon = 'none';
      this.selectedApplicableTo = [TagApplicableTo.everywhere];
      this.tagForm = this.fb.group({
        name: ['', Validators.required],
        textColour: [TagColour.black],
        backgroundColour: [TagColour.white],
        applicableTo: [[TagApplicableTo.everywhere]],
        iconName: ['none']
      });
    }

    if (this.selectedApplicableTo.includes(TagApplicableTo.everywhere)) {
      this.tagForm.controls['applicableTo'].setValue(this.applicableTo);
    }
  }

  onConfirm() {
    const tag: Tag = { ...this.data.tag, ...this.tagForm.value };
    if (tag.applicableTo.includes(TagApplicableTo.everywhere)) {
      tag.applicableTo = [TagApplicableTo.everywhere];
    }
    ([TagColour.white, TagColour.yellow].includes(tag.backgroundColour)) 
      ?  tag.textColour = TagColour.black
      :  tag.textColour = TagColour.white
    this.dialogRef.close({
      tag
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  selectedComponent(selection: MatSelectChange) {
    if (selection.value.includes(TagApplicableTo.everywhere)) {
      this.tagForm.controls['applicableTo'].setValue(this.applicableTo);
    }
  }
}
