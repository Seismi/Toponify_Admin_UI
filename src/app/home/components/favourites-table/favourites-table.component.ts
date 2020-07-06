import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'smi-favourites-table',
  templateUrl: './favourites-table.component.html',
  styleUrls: ['./favourites-table.component.scss']
})
export class FavouritesTableComponent {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<any>;

  @Output() openWorkPackage = new EventEmitter<string>();

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
