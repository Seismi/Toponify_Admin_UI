import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface PeriodicElement {
  name: string;
  dataSets: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Income Statement', dataSets: 'Global Consolidation'},
  {name: 'Balance Sheet', dataSets: 'Global Consolidation'},
  {name: 'Cash Flow', dataSets: 'Global Consolidation'},
  {name: 'Standart Income Statement', dataSets: 'Global Ledger'}
];


@Component({
  selector: 'smi-report-library-table',
  templateUrl: 'report-library-table.component.html',
  styleUrls: ['report-library-table.component.scss']
})
export class ReportLibraryTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['name', 'dataSets'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
}