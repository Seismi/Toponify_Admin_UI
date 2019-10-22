import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { LayoutDetails, LayoutEntity } from '@app/layout/store/models/layout.model';

@Component({
  selector: 'smi-my-layouts-table',
  templateUrl: './my-layouts-table.component.html',
  styleUrls: ['./my-layouts-table.component.scss']
})
export class MyLayoutsTableComponent {
  @Input()
  set data(data: LayoutEntity[]) {
    this.dataSource = new MatTableDataSource<LayoutEntity>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['scope', 'layout', 'owner', 'star'];
  public dataSource: MatTableDataSource<LayoutEntity>;

  @Output() openLayout = new EventEmitter<void>();

  onOpen() {
    this.openLayout.emit();
  }
}
