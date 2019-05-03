import { Component, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface PeriodicElement {
    name: string;
    type: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {type: 'Risk', name: 'Connector used to extract data is new unproven technology'},
    {type: 'Dependency', name: 'Security approval for direct connection'}
  ];

@Component({
  selector: 'smi-radio-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableComponent  {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    displayedColumns: string[] = ['type', 'name'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

}