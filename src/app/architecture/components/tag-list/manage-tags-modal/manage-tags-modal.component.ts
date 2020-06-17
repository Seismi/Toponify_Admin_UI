import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Tag } from '@app/architecture/store/models/node.model';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { TagDetailModalComponent } from '@app/architecture/components/tag-list/tag-detail-modal/tag-detail-modal.component';
import { select, Store } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { CreateTag, DeleteTag, LoadTags, UpdateTag } from '@app/architecture/store/actions/node.actions';
import { getTags } from '@app/architecture/store/selectors/node.selector';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, debounceTime, switchMap, takeUntil, skip, distinctUntilChanged } from 'rxjs/operators';

const autocomplete = (time, selector) => (source$) =>
  source$.pipe(
    debounceTime(time),
    switchMap((...args: any[]) => 
      selector(...args)
        .pipe(
            takeUntil(
                source$
                    .pipe(
                        skip(1)
                    )
            )
        )
    )
  )

@Component({
  selector: 'smi-manage-tags',
  templateUrl: 'manage-tags-modal.component.html',
  styleUrls: ['manage-tags-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageTagsModalComponent implements OnInit {
  public dataSource$: Observable<MatTableDataSource<Tag>>;
  public displayedColumns: string[] = ['name', 'colour', 'icon', 'type', 'actions'];
  search$ = new BehaviorSubject<string>('');

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ManageTagsModalComponent>,
    private store: Store<NodeState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadTags({filterText: ''}));
    this.dataSource$ = this.store.pipe(
      select(getTags),
      map(tags => new MatTableDataSource<Tag>(tags))
    );
    this.search$
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(term => {
      this.store.dispatch(new LoadTags({filterText: term}))
    });
  }


  onClose(): void {
    this.dialogRef.close();
  }

  onSearch(filterText: string): void {
    this.search$.next(filterText);
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
