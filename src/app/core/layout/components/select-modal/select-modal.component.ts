import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger, MatDialog } from '@angular/material';
import { combineLatest, Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith, tap } from 'rxjs/operators';
import { NewChildrenModalComponent } from '@app/architecture/containers/new-children-modal/new-children-modal.component';
import { AddWorkPackageNode } from '@app/workpackage/store/actions/workpackage-node.actions';
import { Store } from '@ngrx/store';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';

@Component({
  selector: 'smi-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss']
})
export class SelectModalComponent implements OnInit {
  public title: string;
  public searchControl = new FormControl();
  public selectionControl = new FormControl('', Validators.required);
  public options$: Observable<{ id: string; name: string }[]>;
  public filteredOptions$: Observable<{ id: string; name: string; selected?: boolean }[]>;
  private selectedOptions = [];
  @ViewChild('searchInput') searchInput: ElementRef;
  public searchActive: boolean;
  private multi: boolean;
  private options: { id: string; name: string; selected?: boolean }[];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(
    private store: Store<WorkPackageState>,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SelectModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      options$: Observable<{ id: string; name: string }[]>;
      multi: boolean;
      selectedIds: string[];
      placeholder: string;
      descendants: boolean;
      groupMembers: boolean;
      nodeId: string,
      workPackageId: string,
      scopeId: string
    }
  ) {
    this.title = data.title;
    this.options$ = data.options$.pipe(
      map(options => {
        this.options = [...options.map(opt => ({...opt, selected: data.selectedIds.some(id => id === opt.id)}))];
        if ( data.selectedIds.length) {
          this.selectedOptions = this.options.filter(opt => opt.selected);
          this.selectionControl.setValue(this.selectedOptions.map(opt => opt.name).join(', '));
        }
        return this.options;
      })
    );
    this.multi = !!data.multi;
  }

  ngOnInit() {
    this.filteredOptions$ = combineLatest(this.searchControl.valueChanges.pipe(startWith('')), this.options$).pipe(
      map(([value, options]) => options.filter(option => option.name.toLowerCase().includes(value.toLowerCase())))
    );
  }

  onConfirm() {
    this.dialogRef.close({
      value: this.selectedOptions
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  optionClicked(event: Event, option) {
    event.stopPropagation();
    this.toggleSelection(option);
  }

  toggleSelection(option) {
    option.selected = !option.selected;
    if (this.multi) {
      if (option.selected) {
        this.selectedOptions.push(option);
      } else {
        const i = this.selectedOptions.findIndex(value => value.id === option.id);
        this.selectedOptions.splice(i, 1);
      }
      this.selectionControl.setValue(this.selectedOptions.map(opt => opt.name).join(', '));
    } else {
      if (option.selected) {
        this.options.forEach(opt => {
          if (opt.id !== option.id) {
            opt.selected = false;
          }
        });
        this.selectedOptions = [option];
        this.autocompleteTrigger.closePanel();
      } else {
        this.selectedOptions = [];
      }
    }
    this.selectionControl.setValue(this.selectedOptions.map(opt => opt.name).join(', '));
  }

  onFocus() {
    this.searchActive = !this.searchActive;
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 200);
  }

  onAutocompleteClose() {
    this.searchActive = !this.searchActive;
  }

  onAddComponent(): void {

    this.dialogRef.close();
    const dialogRef = this.dialog.open(NewChildrenModalComponent, {
      disableClose: false,
      width: '450px',
      data: {
        parentId: this.data.nodeId,
        addGroupMember: false
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.data) {
        this.store.dispatch(
          new AddWorkPackageNode({
            workpackageId: this.data.workPackageId,
            node: data.data,
            scope: this.data.scopeId
          })
        );
      }
    });
  }

  onAddGroupMember(): void {

    this.dialogRef.close();
    const dialogRef = this.dialog.open(NewChildrenModalComponent, {
      disableClose: false,
      width: '450px',
      data: {
        group: this.data.nodeId,
        addGroupMember: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.data) {
        this.store.dispatch(
          new AddWorkPackageNode({
            workpackageId: this.data.workPackageId,
            node: data.data,
            scope: this.data.scopeId
          })
        );
      }
    });
  }
}
