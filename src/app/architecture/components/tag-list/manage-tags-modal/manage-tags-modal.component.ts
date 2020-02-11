import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Tag } from '@app/architecture/store/models/node.model';
import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { TagDetailModalComponent } from '@app/architecture/components/tag-list/tag-detail-modal/tag-detail-modal.component';
import { select, Store } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { CreateTag, DeleteTag, LoadTags, UpdateTag } from '@app/architecture/store/actions/node.actions';
import { getTags } from '@app/architecture/store/selectors/node.selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'smi-manage-tags',
  templateUrl: 'manage-tags-modal.component.html',
  styleUrls: ['manage-tags-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageTagsModalComponent implements OnInit {
  public dataSource$: Observable<MatTableDataSource<Tag>>;
  public displayedColumns: string[] = ['name', 'colour', 'icon', 'type', 'actions'];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ManageTagsModalComponent>,
    private store: Store<NodeState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadTags());
    this.dataSource$ = this.store.pipe(
      select(getTags),
      map(tags => new MatTableDataSource<Tag>(tags))
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(tag: Tag): void {
    const dialogRef = this.dialog.open(TagDetailModalComponent, {
      disableClose: false,
      minWidth: '500px',
      data: {
        tag
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.tag) {
        this.store.dispatch(new UpdateTag({ tag: data.tag }));
      }
    });
  }

  addNew() {
    const dialogRef = this.dialog.open(TagDetailModalComponent, {
      disableClose: false,
      minWidth: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.tag) {
        this.store.dispatch(new CreateTag({ tag: data.tag }));
      }
    });
  }

  onDelete(tag: Tag) {
    this.store.dispatch(new DeleteTag({ tagId: tag.id }));
  }
}
