import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

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

    ngOnInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    displayedColumns: string[] = ['type', 'name'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

}