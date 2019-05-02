import { Component, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface PeriodicElement {
    change: string;
    layer: string;
    object: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {layer: 'System Link', object: 'ERP to HFM actuals', change: 'New'},
    {layer: 'System', object: 'HFM', change: 'Update'}
  ];

@Component({
  selector: 'smi-change-table',
  templateUrl: './change-table.component.html',
  styleUrls: ['./change-table.component.scss']
})
export class ChangeTableComponent  {

    @Input() workpackageSelected = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    displayedColumns: string[] = ['change', 'layer', 'object'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

}