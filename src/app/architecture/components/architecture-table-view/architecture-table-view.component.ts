import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Node } from '@app/architecture/store/models/node.model';
import { NodeLink } from '@app/nodes/store/models/node-link.model';

@Component({
  selector: 'smi-architecture-table-view',
  templateUrl: 'architecture-table-view.component.html',
  styleUrls: ['architecture-table-view.component.scss']
})
export class ArchitectureTableViewComponent {
  @Input() workPackageIsEditable: boolean;

  @Input()
  set data(data: Node[] | NodeLink[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<Node | NodeLink>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<Node | NodeLink>;
  public displayedColumns: string[] = ['category', 'name', 'description', 'tags', 'owner'];
}

