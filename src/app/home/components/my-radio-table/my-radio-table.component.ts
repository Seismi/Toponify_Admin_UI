import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  empty: string;
  type: string;
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {empty: 'New', type: 'Risk', name: 'HFM and Planning can fall out of alignment'},
  {empty: 'New', type: 'Workpackage', name: 'Governing HFM to Planning mappings from DRM'},
  {empty: 'Updated', type: 'Opportunity', name: 'Mappings from HFM to Planning not maintained using DRM'},
];

@Component({
  selector: 'smi-my-radio-table',
  templateUrl: './my-radio-table.component.html',
  styleUrls: ['./my-radio-table.component.scss']
})
export class MyRadioTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['empty', 'type', 'name', 'star'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
}