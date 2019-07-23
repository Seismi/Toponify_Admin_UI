import { Component, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-attr-and-rules-table',
  templateUrl: 'attr-and-rules-table.component.html',
  styleUrls: ['attr-and-rules-table.component.scss']
})
export class AttrAndRulesTableComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<Report>;
  public displayedColumns: string[] = ['category', 'name', 'description'];
}