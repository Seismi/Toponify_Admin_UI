import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  empty: string;
  type: string;
  name: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {empty: 'new', type: 'Hydrogen', name: 1.0079},
  {empty: 'new', type: 'Helium', name: 4.0026},
  {empty: 'new', type: 'Lithium', name: 6.941},
  {empty: 'updated', type: 'Beryllium', name: 9.0122},
  {empty: 'new', type: 'Boron', name: 10.811},
  {empty: 'updated', type: 'Carbon', name: 12.0107},
  {empty: 'updated', type: 'Nitrogen', name: 14.0067},
  {empty: 'updated', type: 'Oxygen', name: 15.9994},
  {empty: 'new', type: 'Fluorine', name: 18.9984},
  {empty: 'new', type: 'Neon', name: 20.1797}
];

@Component({
  selector: 'smi-workpackages-table',
  templateUrl: './workpackages-table.component.html',
  styleUrls: ['./workpackages-table.component.scss']
})
export class WorkpackagesTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['refNo', 'workPackage', 'status', 'star'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
}