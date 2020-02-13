import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'smi-owners-table-in-architecture',
  templateUrl: './owners-table.component.html',
  styleUrls: ['./owners-table.component.scss']
})
export class OwnersTableComponent {
  public formGroup: FormGroup;
  public index: number;

  @Input() data: any;
  @Input() isEditable: boolean = false;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      name: [null, Validators.required]
    });
  }

  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();
  @Output() save = new EventEmitter<{object: Object, value: string}>();

  onAdd(): void {
    this.add.emit();
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  onEdit(object: Object, index: number): void {
    this.formGroup.patchValue({ ...object });
    this.index = index;
  }

  onSave(object: Object): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.index = -1;
    this.save.emit({object: object, value: this.formGroup.value.name});
  }

  onCancel(): void {
    this.index = -1;
  }

}
