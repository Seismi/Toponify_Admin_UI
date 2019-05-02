import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface PeriodicElement {
  name: string;
  status: string;
  owners: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Deploy new intergration to Group Consolidation', status: 'Draft', owners: 'FSS'},
  {name: 'Automate Publication to Enterprise Data', status: 'Approved', owners: 'Reporting'},
];

@Component({
  selector: 'smi-workpackages-table',
  templateUrl: './workpackages-table.component.html',
  styleUrls: ['./workpackages-table.component.scss']
})
export class WorkpackagesTableComponent implements OnInit {

  selectedRowIndex: number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['name', 'status', 'owners'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @Output()
  workpackageSelected = new EventEmitter();

  onSelectRow(row) {
    this.workpackageSelected.emit(row);
    this.selectedRowIndex = row.name;
  }

}