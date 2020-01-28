import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectChange, MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import { Observable } from 'rxjs';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import {
  FindPotentialWorkpackageNodes,
  AddWorkPackageNode
} from '@app/workpackage/store/actions/workpackage-node.actions';
import { FormControl } from '@angular/forms';
import { WorkPackageNodeFindPotential } from '@app/workpackage/store/models/workpackage.models';
import { getPotentialWorkPackageNodes } from '@app/architecture/store/selectors/workpackage.selector';
import { NewChildrenModalComponent } from '../new-children-modal/new-children-modal.component';

@Component({
  selector: 'smi-descendants-modal',
  templateUrl: './descendants-modal.component.html',
  styleUrls: ['./descendants-modal.component.scss']
})
export class DescendantsModalComponent implements OnInit {
  public descendants$: Observable<DescendantsEntity[]>;
  public displayedColumns: string[] = ['name'];
  public selectedDescendants: DescendantsEntity[] = [];
  public workpackageId: string;
  public nodeId: string;
  public childrenOf: WorkPackageNodeFindPotential;
  public components = new FormControl();
  public title: string;

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private dialog: MatDialog,
    private store: Store<WorkPackageState>,
    public dialogRef: MatDialogRef<DescendantsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.workpackageId = data.workpackageId;
    this.nodeId = data.nodeId;
    this.childrenOf = data.childrenOf;
    this.title = data.title;
  }

  ngOnInit() {
    this.store.dispatch(
      new FindPotentialWorkpackageNodes({
        workPackageId: this.workpackageId,
        nodeId: this.nodeId,
        data: this.childrenOf
      })
    );
    this.descendants$ = this.store.pipe(select(getPotentialWorkPackageNodes));
  }

  onSubmit(): void {
    this.dialogRef.close({ descendant: this.selectedDescendants });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSelect($event: MatSelectChange, children: DescendantsEntity): void {
    if ($event.source.selected) {
      this.selectedDescendants.push(children);
    }
    if (!$event.source.selected) {
      const index = this.selectedDescendants.indexOf(children);
      if (index > -1) {
        this.selectedDescendants.splice(index, 1);
      }
    }
  }

  onOpenDropdown(): void {
    this.searchInput.nativeElement.focus();
  }

  clearInputValue(): void {
    this.searchInput.nativeElement.value = '';
  }

  onAddComponent(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(NewChildrenModalComponent, {
      disableClose: false,
      width: '450px',
      data: {
        parentId: this.nodeId,
        newSubItem: false
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.data) {
        this.store.dispatch(
          new AddWorkPackageNode({
            workpackageId: this.workpackageId,
            node: data.data,
            scope: this.data.scopeId
          })
        );
      }
    });
  }
}
