import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tag, TagColour, TagIcon } from '@app/architecture/store/models/node.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'smi-tag-detail',
  templateUrl: 'tag-detail-modal.component.html',
  styleUrls: ['tag-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagDetailModalComponent {
  public tagForm: FormGroup;
  public tagIcons: string[] = [];
  public selectedIcon: string;
  public tagColour = TagColour;
  public selectedColour: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TagDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tag: Tag;
    }
  ) {
    for (const i in TagIcon) {
      if (typeof i === 'string') {
        this.tagIcons.push(i.trim());
      }
    }
    if (data.tag) {
      this.selectedIcon = data.tag.iconName ? data.tag.iconName : 'none';
      this.tagForm = this.fb.group({
        name: [data.tag.name, Validators.required],
        backgroundColour: [data.tag.backgroundColour],
        applicableTo: [data.tag.applicableTo],
        iconName: [this.selectedIcon]
      });
    } else {
      this.tagForm = this.fb.group({
        name: ['name', Validators.required],
        backgroundColour: [TagColour.white],
        applicableTo: [[]],
        iconName: ['none']
      });
    }
  }

  onConfirm() {
    this.dialogRef.close({
      tag: { ...this.data.tag, ...this.tagForm.value }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
