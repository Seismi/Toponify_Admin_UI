import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Node } from '@app/architecture/store/models/node.model';
import { NodeLink, NodeLinkDetail } from '@app/nodes/store/models/node-link.model';
import { NodeDetail } from '@app/nodes/store/models/node.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { getNodeEntityById } from '@app/architecture/store/selectors/node.selector';
import { map } from 'rxjs/operators';

const SystemColumns = ['category', 'name', 'description', 'tags', 'r', 'a', 'd', 'i', 'o', 'owner'];
const LinkColumns = ['category', 'name', 'description', 'tags', 'r', 'a', 'd', 'i', 'o', 'owner', 'source', 'target'];

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

  @Input()
  set data(data: Node[] | NodeLink[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<Node | NodeLink>(data);
    this.dataSource.paginator = this.paginator;
  }

  @Output() selectNode = new EventEmitter<Node | NodeLink>();
  @Output() changeLevel = new EventEmitter<Node | NodeLink>();

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

  getNodeName(id: string): Observable<string> {
    return this.nodeStore.select(getNodeEntityById, {id}).pipe(map(node => node.name));
  }
}

