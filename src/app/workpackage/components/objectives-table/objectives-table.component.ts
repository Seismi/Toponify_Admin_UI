import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
    name: string;
    type: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {type: 'Risk', name: 'Users can edit data manually on upload'},
    {type: 'Issue', name: 'Data frequently late'}
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