import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Link } from 'gojs';
import { getNodeEntities } from '@app/architecture/store/selectors/node.selector';
import { Node } from '@app/architecture/store/models/node.model';

const systemCategories = ['transactional', 'analytical', 'reporting', 'master data', 'file'];
const dataSetCategories = ['physical', 'virtual', 'master data'];
const dimensionCategories = ['dimension'];
const reportingConceptCategories = ['structure', 'list', 'key'];

@Component({
  selector: 'smi-components-or-links-modal',
  templateUrl: './components-or-links-modal.component.html',
  styleUrls: ['./components-or-links-modal.component.scss']
})
export class ComponentsOrLinksModalComponent implements OnInit {
  public formGroup: FormGroup;
  public nodes: Node[];
  
  constructor(
    private fb: FormBuilder,
    private store: Store<NodeState>,
    public dialogRef: MatDialogRef<ComponentsOrLinksModalComponent>,
    @Inject(MAT_DIALOG_DATA) 
      public data: {
        workPackageId: string,
        link: Link,
        level: string
      }
    ) {
      this.formGroup = this.fb.group({
        category: [this.getCategories()[0], Validators.required],
        name: [null, Validators.required],
        sourceId: [null],
        targetId: [null]
      });
    }

  ngOnInit(): void {
    this.store.pipe(select(getNodeEntities)).subscribe(nodes => {
      const components = nodes.filter(node => !node.group.length);
      this.nodes = components;
    });
  }

  getCategories(): string[] {
    switch (this.data.level) {
      case 'system':
        return (!this.data.link) ? systemCategories : ['master data', 'data'];
      case 'data set':
        return (!this.data.link) ? dataSetCategories : ['master data', 'data'];
      case 'dimension':
        return (!this.data.link) ? dimensionCategories : ['master data'];
      case 'reporting concept':
        return (!this.data.link) ? reportingConceptCategories : ['master data'];
    }
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.dialogRef.close({node: this.formGroup.value});
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
