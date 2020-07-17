import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { RadioEntity } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-my-radio-table',
  templateUrl: './my-radio-table.component.html',
  styleUrls: ['./my-radio-table.component.scss']
})
export class MyRadioTableComponent {
  @Input()
  set data(data: RadioEntity[]) {
    this.dataSource = new MatTableDataSource<RadioEntity>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['ref', 'category', 'status', 'title', 'lastUpdateDate', 'lastUpdatedBy'];
  public dataSource: MatTableDataSource<RadioEntity>;

  @Output() openRadio = new EventEmitter<RadioEntity>();

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
