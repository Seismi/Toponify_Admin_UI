import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { RadioEntity } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-my-radio-table',
  templateUrl: './my-radio-table.component.html',
  styleUrls: ['./my-radio-table.component.scss']
})
export class MyRadioTableComponent implements OnInit {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() { }

  displayedColumns: string[] = ['date', 'name', 'navigate'];
  public dataSource: MatTableDataSource<RadioEntity>;
}