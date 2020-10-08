import { Component, DoCheck, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Link } from 'gojs';
import { getNodeEntities } from '@app/architecture/store/selectors/node.selector';
import { Node } from '@app/architecture/store/models/node.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

const systemCategories = ['transactional', 'analytical', 'reporting', 'master data', 'file'];
const dataNodeCategories = ['data structure', 'data set', 'master data set'];
const dimensionCategories = ['dimension'];
const reportingConceptCategories = ['structure', 'list', 'key'];

@Component({
  selector: 'smi-components-or-links-modal',
  templateUrl: './components-or-links-modal.component.html',
  styleUrls: ['./components-or-links-modal.component.scss']
})
export class ComponentsOrLinksModalComponent implements OnInit, DoCheck {
  public group: FormGroup;
  public nodes: Node[];
  nameValue = '';
  filteredSources$: Observable<Node[]>;
  filteredTargets$: Observable<Node[]>;

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
      this.group = this.fb.group({
        category: [this.getCategories()[0], Validators.required],
        name: [null, (!this.data.link) ? Validators.required : null],
        sourceId: [null, (this.data.link) ? Validators.required : null],
        targetId: [null, (this.data.link) ? Validators.required : null]
      });
    }

  ngDoCheck(): void {
    const source = this.group.value.sourceId;
    const target = this.group.value.targetId;
    if (source && target) {
      this.nameValue = `${source.name + ' - ' + target.name}`;
    }
  }

  ngOnInit(): void {
    this.store.pipe(select(getNodeEntities)).subscribe(data => (this.nodes = data));

    this.filteredSources$ = this.group.get('sourceId').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.nodes.slice())
      );

    this.filteredTargets$ = this.group.get('targetId').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.nodes.slice())
      );
  }

  getCategories(): string[] {
    switch (this.data.level) {
      case 'system':
        return (!this.data.link) ? systemCategories : ['master data', 'data'];
      case 'data':
        return (!this.data.link) ? dataNodeCategories : ['master data', 'data'];
      case 'dimension':
        return (!this.data.link) ? dimensionCategories : ['master data'];
      case 'reporting concept':
        return (!this.data.link) ? reportingConceptCategories : ['master data'];
    }
  }

  onSubmit(): void {
    if (this.group.invalid) {
      return;
    }
    this.dialogRef.close({ node: this.group.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  displayFn(system: Node): string {
    return system && system.name ? system.name : '';
  }

  private _filter(name: string): Node[] {
    const filterValue = name.toLowerCase();
    return this.nodes.filter(node => node.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
