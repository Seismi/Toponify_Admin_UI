import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Node } from '@app/architecture/store/models/node.model';
import { NodeLink, NodeLinkDetail } from '@app/architecture/store/models/node-link.model';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';

const SystemColumns = ['category', 'reference', 'name', 'description', 'tags', 'radio', 'owner'];
const LinkColumns = ['category', 'reference', 'name', 'description', 'tags', 'radio', 'owner', 'source', 'target'];

@Component({
  selector: 'smi-architecture-table-view',
  templateUrl: 'architecture-table-view.component.html',
  styleUrls: ['architecture-table-view.component.scss']
})
export class ArchitectureTableViewComponent implements OnInit {
  @Input() workPackageIsEditable: boolean;
  @Input() selectedItem: NodeDetail | NodeLinkDetail;
  @Input() view: 'system' | 'link';
  @Input() find: (id: string) => Observable<string>;
  @Input() filterValue: string;

  @Input()
  set data(data: Node[] | NodeLink[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<Node | NodeLink>(data);
    this.dataSource.filter = this.filterValue;
    this.dataSource.paginator = this.paginator;
  }

  @Output() selectNode = new EventEmitter<Node | NodeLink>();
  @Output() changeLevel = new EventEmitter<Node | NodeLink>();
  @Output() download = new EventEmitter<void>();
  @Output() add = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
}
