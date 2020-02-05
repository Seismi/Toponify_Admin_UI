import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Tag } from '@app/architecture/store/models/node.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { TagDetailModalComponent } from '@app/architecture/components/tag-list/tag-detail-modal/tag-detail-modal.component';

@Component({
  selector: 'smi-manage-tags',
  templateUrl: 'manage-tags-modal.component.html',
  styleUrls: ['manage-tags-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageTagsModalComponent {
  public dataSource: MatTableDataSource<Tag>;
  public displayedColumns: string[] = ['name', 'colour', 'icon', 'type', 'actions'];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ManageTagsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tags: Tag[];
    }
  ) {
    this.dataSource = new MatTableDataSource<Tag>(data.tags);
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
        console.log('edited tag', data.tag);
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
        console.log('new tag', data.tag);
      }
    });
  }

  onDelete(tag: Tag) {
    console.log('delete', tag);
  }
}
