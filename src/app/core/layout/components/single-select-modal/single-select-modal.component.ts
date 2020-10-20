import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface Option {
  id: string;
  name: string;
}

@Component({
  selector: 'smi-single-select-modal',
  templateUrl: './single-select-modal.component.html',
  styleUrls: ['./single-select-modal.component.scss']
})
export class SingleSelectModalComponent implements OnInit {
  public selectionControl = new FormControl('', Validators.required);
  public filteredOptions$: Observable<Option[]>;
  public options$: Observable<Option[]>;

  @Output() addGroupMember = new EventEmitter<void>();
  @Output() addNewComponent = new EventEmitter<void>();
  @Output() addDescendant = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<SingleSelectModalComponent>,
    @Inject(MAT_DIALOG_DATA)
      public data: {
        title: string;
        label: string;
        options$: Observable<Option[]>;
        groupMembers: boolean;
        newComponent: boolean;
        descendants: boolean;
      }
    ) {
      this.options$ = data.options$.pipe(map(options => [...options.map(opt => ({ ...opt }))]));
    }

  ngOnInit(): void {
    this.filteredOptions$ = combineLatest(this.selectionControl.valueChanges.pipe(startWith('')), this.options$).pipe(
      map(([value, options]) => options.filter(option => option.name.toLowerCase().includes(value.toString().toLowerCase())))
    );
  }

  displayFn(option: Option): string {
    return option && option.name ? option.name : '';
  }

  onConfirm(): void {
    this.dialogRef.close({ value: this.selectionControl.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
