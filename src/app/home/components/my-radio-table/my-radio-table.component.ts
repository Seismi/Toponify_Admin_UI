import { Component, Input, ViewChild } from '@angular/core';
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

  public displayedColumns: string[] = ['date', 'type', 'name', 'navigate'];
  public dataSource: MatTableDataSource<RadioEntity>;
}
