import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromVersion from '../store/reducers';
import * as VersionActions from '../store/actions/version.actions';
import { Observable, Subscription } from 'rxjs';
import { Version } from '../store/models/version.model';
import { Router } from '@angular/router';
import { VersionsModalComponent } from './version-modal/versions-modal.component';
import { MatDialog } from '@angular/material';
import { VersionsTableComponent } from '../components/versions-table/versions-table.component';


@Component({
  selector: 'app-versions-manager',
  templateUrl: 'versions-manager.component.html',
  styleUrls: ['versions-manager.component.scss']
})

export class VersionsManagerComponent implements OnInit, OnDestroy {

  @ViewChild(VersionsTableComponent) versionsTable: VersionsTableComponent;
  checked: boolean;

  loading$: Observable<boolean>;
  versions$: Observable<Version[]>;
  subscription: Subscription;
  version: Version[];
  test$: Subscription;

  constructor(
    private store: Store<fromVersion.State>,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.store.dispatch(new VersionActions.LoadVersions());
    this.loading$ = this.store.pipe(select(fromVersion.getLoading));
    this.versions$ = this.store.pipe(select(fromVersion.getVersions));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onOpenVersion(version: any)  {
    this.router.navigate(['/version/', version.versionId], {
      queryParams: {
        filter: `filterLevel:${version.viewLevel}`
      }
    });
  }

  onEditVersion(id: string) {
    this.subscription = this.store.pipe(select(fromVersion.getVersionById(id))).subscribe(value => {
      this.version = value;
    });

    const dialogRef = this.dialog.open(VersionsModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        mode: 'edit',
        version: { ...this.version[0] }
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.version) {
        this.store.dispatch(new VersionActions.UpdateVersion({ data: data.version }));
      }
    });
  }

  onAddVersion() {
    const dialogRef = this.dialog.open(VersionsModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        mode: 'add',
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.version) {
        this.store.dispatch(new VersionActions.AddVersion({ data: data.version }));
      }
    });
  }

  onArchiveVersion(versionId: string) {
    this.subscription = this.store.pipe(select(fromVersion.getVersionById(versionId))).subscribe(value => {
      this.version = value;
    });

    this.store.dispatch(new VersionActions.ArchiveVersion({
      data: {
        id: this.version[0].id,
        name: this.version[0].name,
        description: this.version[0].description,
        status: 'archived'
      }
    }));
  }

  onUnarchiveVersion(versionId: string) {
    this.subscription = this.store.pipe(select(fromVersion.getVersionById(versionId))).subscribe(value => {
      this.version = value;
    });

    this.store.dispatch(new VersionActions.UnarchiveVersion({
      data: {
        id: this.version[0].id,
        name: this.version[0].name,
        description: this.version[0].description,
        status: 'active'
      }
    }));
  }

  onDeleteVersion(versionId: string) {
    this.store.dispatch(new VersionActions.DeleteVersion(versionId));
  }

  onCopyVersion(versionId: string) {
    this.subscription = this.store.pipe(select(fromVersion.getVersionById(versionId))).subscribe(value => {
      this.version = value;
    });

    const dialogRef = this.dialog.open(VersionsModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        mode: 'copy',
        version: {
          name: 'Copy of: ' + this.version[0].name,
          description: 'Copy of: ' + this.version[0].name,
          status: this.version[0].status,
          isCopy: true,
          copyFromId: this.version[0].id
        }
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.version) {
        this.store.dispatch(new VersionActions.CopyVersion({ data: data.version }));
      }
    });
  }

  onSearchVersion(filterValue: string) {
    this.versionsTable.dataSource.filterPredicate = function(data: Version, filter: string): boolean {
      return data.name.toLowerCase().includes(filter);
    };
    this.versionsTable.dataSource.filter = filterValue.trim().toLowerCase();

    (filterValue === '')
      ? this.checked = false
      : this.checked = true;
  }

}
