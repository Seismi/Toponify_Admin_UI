import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getNodeEntities } from '@app/architecture/store/selectors/node.selector';
import { Node } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-link-with-transformation-modal',
  templateUrl: './link-with-transformation-modal.component.html',
  styleUrls: ['./link-with-transformation-modal.component.scss']
})
export class LinkWithTransformationModalComponent implements OnInit {
  public formGroup: FormGroup;
  public nodesInTargetGroup: Node[];
  public nodesInSourceGroup: Node[];

  constructor(
    private fb: FormBuilder,
    private store: Store<NodeState>,
    public dialogRef: MatDialogRef<LinkWithTransformationModalComponent>,
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
      this.nodesInTargetGroup = data.filter(node => node.group === target[0].id);
      this.nodesInSourceGroup = data.filter(node => node.group === source[0].id);
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

}
