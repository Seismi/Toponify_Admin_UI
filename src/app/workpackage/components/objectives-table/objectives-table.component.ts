import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
    name: string;
    type: number;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {type: 1, name: 'Hydrogen'},
    {type: 2, name: 'Helium'},
    {type: 3, name: 'Lithium'},
    {type: 4, name: 'Beryllium'},
    {type: 5, name: 'Boron'},
    {type: 6, name: 'Carbon'},
    {type: 7, name: 'Nitrogen'},
    {type: 8, name: 'Oxygen'},
    {type: 9, name: 'Fluorine'}
  ];

@Component({
  selector: 'smi-objectives-table',
  templateUrl: './objectives-table.component.html',
  styleUrls: ['./objectives-table.component.scss']
})
export class ObjectivesTableComponent  {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    displayedColumns: string[] = ['type', 'name'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

}