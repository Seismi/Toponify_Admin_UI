import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { Version } from '@app/version/store/models/version.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatCheckboxChange, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';

import { VersionService } from '@app/version/services/version.service';
import { Level } from '@app/version/services/diagram.service';

@Component({
  selector: 'app-versions-table',
  templateUrl: './versions-table.component.html',
  styleUrls: ['./versions-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class VersionsTableComponent implements OnInit, OnChanges {

  @Input()
  set data(_data: Version[]) {
    this.dataSource = new MatTableDataSource<Version>(_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @Output()
  openVersion = new EventEmitter();

  @Output()
  openComments = new EventEmitter<string>();

  @Output()
  openCurrentVersion = new EventEmitter<string>();

  @Output()
  editVersion = new EventEmitter<string>();

  @Output()
  addVersion = new EventEmitter();

  @Output()
  copyVersion = new EventEmitter();

  @Output()
  archiveVersion = new EventEmitter();

  @Output()
  deleteVersion = new EventEmitter();

  @Output()
  unarchiveVersion = new EventEmitter();

  public displayedColumns: string[] = ['previewImage', 'name', 'lastUpdatedOn', 'star'];
  public expandedElement: Version | null;
  public dataSource: MatTableDataSource<Version>;
  public resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() checked: boolean;

  public viewLevels = Level;

  constructor(public dialog: MatDialog, private versionService: VersionService) {}

  ngOnChanges() {
    this.checked = true;
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Versions per page';

    this.dataSource.filterPredicate = (data: Version, filter: string) => {
      return data.status === filter;
    };
    this.dataSource.filter = 'active';
  }

  onOpen(versionId: string, viewLevel: string) {
    this.openVersion.emit({versionId: versionId, viewLevel: viewLevel});
  }

  onComments(versionId: string) {
    this.openComments.emit(versionId);
  }

  onEdit(id: string) {
    this.editVersion.emit(id);
  }

  onAdd() {
    this.addVersion.emit();
  }

  onCopy(versionId: string) {
    this.copyVersion.emit(versionId);
  }

  onArchive(versionId: string) {
    this.archiveVersion.emit(versionId);
  }

  onDelete(versionId: string){
    this.deleteVersion.emit(versionId)
  }

  onUnarchive(versionId: string){
    this.unarchiveVersion.emit(versionId);
  }

  // Data filter
  setStatus(checkbox: MatCheckboxChange) {
    (checkbox.checked)
      ? this.dataSource.filter = ''
      : this.dataSource.filter = 'active';
  }

}
