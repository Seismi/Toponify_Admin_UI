import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

export interface PeriodicElement {
  name: string;
  status: number;
  owners: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {status: 1, name: 'Hydrogen', owners: 1.0079},
  {status: 2, name: 'Helium', owners: 4.0026},
  {status: 3, name: 'Lithium', owners: 6.941},
  {status: 4, name: 'Beryllium', owners: 9.0122},
  {status: 5, name: 'Boron', owners: 10.811},
  {status: 6, name: 'Carbon', owners: 12.0107},
  {status: 7, name: 'Nitrogen', owners: 14.0067},
  {status: 8, name: 'Oxygen', owners: 15.9994},
  {status: 9, name: 'Fluorine', owners: 18.9984},
  {status: 10, name: 'Neon', owners: 20.1797},
  {status: 7, name: 'Nitrogen', owners: 14.0067},
  {status: 8, name: 'Oxygen', owners: 15.9994},
  {status: 9, name: 'Fluorine', owners: 18.9984},
  {status: 10, name: 'Neon', owners: 20.1797},
  {status: 3, name: 'Lithium', owners: 6.941},
  {status: 5, name: 'Boron', owners: 10.811},
  {status: 6, name: 'Carbon', owners: 12.0107}
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

  displayedColumns: string[] = ['name', 'status', 'owners'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

}