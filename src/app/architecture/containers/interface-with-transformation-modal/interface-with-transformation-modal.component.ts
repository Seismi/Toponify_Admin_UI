import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getNodeEntities } from '@app/architecture/store/selectors/node.selector';
import { Node } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-interface-with-transformation-modal',
  templateUrl: './interface-with-transformation-modal.component.html',
  styleUrls: ['./interface-with-transformation-modal.component.scss']
})
export class InterfaceWithTransformationModalComponent implements OnInit {
  public formGroup: FormGroup;
  public targetArray: Node[];
  public sourceArray: Node[];

  @ViewChild('searchTarget') searchTarget: ElementRef;
  @ViewChild('searchSource') searchSource: ElementRef;

  constructor(
    private fb: FormBuilder,
    private store: Store<NodeState>,
    public dialogRef: MatDialogRef<InterfaceWithTransformationModalComponent>,
    @Inject(MAT_DIALOG_DATA) { }
    ) {
      this.formGroup = this.fb.group({
        name: ['New Transformation', Validators.required],
        sourceId: [null, Validators.required],
        targetId: [null, Validators.required]
      });
    }

  ngOnInit(): void {
    this.store.pipe(select(getNodeEntities)).subscribe(data => {
      const target = data.filter(node => node.endPointType === 'target');
      const source = data.filter(node => node.endPointType === 'source');
      this.targetArray = data.filter(node => node.group === target[0].id);
      this.sourceArray = data.filter(node => node.group === source[0].id);
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.dialogRef.close({ node: this.formGroup.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  filter(node: Node): boolean {
    const searchValue = this.searchTarget.nativeElement.value || this.searchSource.nativeElement.value;
    return searchValue !== '' && node.name.toLowerCase().indexOf(searchValue.toLowerCase()) === -1;
  }

}
