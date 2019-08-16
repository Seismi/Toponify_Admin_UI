import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { LayoutEntity } from '@app/layout/store/models/layout.model';

@Component({
  selector: 'smi-my-layouts-table',
  templateUrl: './my-layouts-table.component.html',
  styleUrls: ['./my-layouts-table.component.scss']
})
export class MyLayoutsTableComponent implements OnInit {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() { }

  displayedColumns: string[] = ['scope', 'layout', 'owner', 'star'];
  public dataSource: MatTableDataSource<LayoutEntity>;

  @Output()
  openLayout = new EventEmitter();

  onOpen() {
    this.openLayout.emit();
  }
}