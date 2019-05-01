import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
    change: string;
    layer: number;
    object: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {layer: 1, object: 'Hydrogen', change: 'HFM'},
    {layer: 2, object: 'Helium', change: 'HFM'},
    {layer: 3, object: 'Lithium', change: 'HFM'},
    {layer: 4, object: 'Beryllium', change: 'HFM'},
    {layer: 5, object: 'Boron', change: 'HFM'},
    {layer: 6, object: 'Carbon', change: 'HFM'},
    {layer: 7, object: 'Nitrogen', change: 'HFM'},
    {layer: 8, object: 'Oxygen', change: 'HFM'},
    {layer: 9, object: 'Fluorine', change: 'HFM'}
  ];

@Component({
  selector: 'smi-change-table',
  templateUrl: './change-table.component.html',
  styleUrls: ['./change-table.component.scss']
})
export class ChangeTableComponent  {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    displayedColumns: string[] = ['change', 'layer', 'object'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

}