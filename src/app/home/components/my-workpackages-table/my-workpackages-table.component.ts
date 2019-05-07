import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  refNo: string;
  workpackage: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {refNo: 'MD001', workpackage: 'Govering HFM to Planning mappings from DRM', status: 'Draft'},
  {refNo: 'FS001', workpackage: 'Building intergration to load actual data from HFM to Planning for forecast', status: 'Completed'},
];

@Component({
  selector: 'smi-my-workpackages-table',
  templateUrl: './my-workpackages-table.component.html',
  styleUrls: ['./my-workpackages-table.component.scss']
})
export class MyWorkpackagesTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['refNo', 'workpackage', 'status', 'star'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
}