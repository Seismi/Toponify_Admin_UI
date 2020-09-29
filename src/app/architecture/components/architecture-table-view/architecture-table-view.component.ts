import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Node } from '@app/architecture/store/models/node.model';
import { NodeLink, NodeLinkDetail } from '@app/architecture/store/models/node-link.model';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { Level } from '@app/architecture/services/diagram-level.service';

const SystemColumns = ['category', 'reference', 'name', 'description', 'tags', 'radio', 'owner', 'impactedBy'];
const LinkColumns = ['category', 'reference', 'name', 'description', 'tags', 'radio', 'owner', 'source', 'target', 'impactedBy'];

@Component({
  selector: 'smi-architecture-table-view',
  templateUrl: 'architecture-table-view.component.html',
  styleUrls: ['architecture-table-view.component.scss']
})
export class ArchitectureTableViewComponent implements OnInit, OnChanges {
  @Input() workPackageIsEditable: boolean;
  @Input() selectedItem: NodeDetail | NodeLinkDetail;
  @Input() view: 'system' | 'link';
  @Input() find: (id: string) => Observable<string>;
  @Input() filterLevel: string;
  private filterValue: string;

  @Input()
  set data(data: any[]) {
    if (!data && data.some(obj => obj.hasOwnProperty(name))) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<Node | NodeLink>(
      data.filter(node => node.category !== 'warning')
    );
    this.dataSource.filter = this.filterValue;
    this.dataSource.paginator = this.paginator;
  }

  @Output() selectNode = new EventEmitter<Node | NodeLink>();
  @Output() changeLevel = new EventEmitter<Node | NodeLink>();
  @Output() download = new EventEmitter<void>();
  @Output() add = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;

  public dataSource: MatTableDataSource<Node | NodeLink>;
  public displayedColumns: string[];

  private isSingleClick: boolean;

  constructor(private nodeStore: Store<NodeState>) {}

  ngOnInit(): void {
    if (this.view === 'system') {
      this.displayedColumns = SystemColumns;
    } else {
      this.displayedColumns = LinkColumns;
    }
    setTimeout(() => this.navigateToSelectedItem());
  }

  navigateToSelectedItem() {
    if (this.selectedItem) {
      const pageIndex = this.getPageIndex();
      if (this.dataSource.paginator.pageIndex !== pageIndex) {
        if (this.dataSource.paginator.pageIndex > pageIndex) {
          while (this.dataSource.paginator.pageIndex > pageIndex) {
            this.dataSource.paginator.previousPage();
          }
        }
        if (this.dataSource.paginator.pageIndex < pageIndex) {
          while (this.dataSource.paginator.pageIndex < pageIndex) {
            this.dataSource.paginator.nextPage();
          }
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedItem &&
      changes.selectedItem.currentValue && (!changes.selectedItem.previousValue ||
      changes.selectedItem.currentValue.id !== changes.selectedItem.previousValue.id)) {
      if (!this.filterValue) {
        this.filterValue = this.searchInput.nativeElement.value;
      }
      setTimeout(() => this.navigateToSelectedItem());
    }
  }

  getPageIndex(): number {
    if (this.selectedItem) {
      const arrIndex = this.dataSource.data.findIndex(item => item.id === this.selectedItem.id);
      const page = (arrIndex + 1) / 10;
      if (page <= 1) {
        return 0;
      }
      return Math.floor(page);
    }
    return 0;
  }

  onSelect(row: Node | NodeLink) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.selectNode.emit(row);
      }
    }, 350);
  }

  dblClick(row: Node | NodeLink) {
    this.isSingleClick = false;
    this.changeLevel.emit(row);
  }

  downloadCSV() {
    this.download.emit();
  }

  onAdd(): void {
    this.add.emit();
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  disableCreateNewButton(): boolean {
    return !this.workPackageIsEditable || [Level.sources, Level.targets, Level.usage].includes(this.filterLevel as Level);
  }

}
