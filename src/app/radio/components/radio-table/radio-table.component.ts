import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RadioEntity } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-radio-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableComponent implements OnInit {

  @Input()
  selectedRowIndex: number = -1;

  @Input()
  set data(data: RadioEntity[]) {
    this.dataSource = new MatTableDataSource<RadioEntity>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['title','category','status','last_update_date','last_update_by'];
  public dataSource: MatTableDataSource<RadioEntity>;

  ngOnInit() {}

  @Output()
  selectRadio = new EventEmitter<string>();

  @Output()
  addRadio = new EventEmitter();

  onSelectRow(row) {
    this.selectRadio.emit(row);
  }

  onAdd() {
    this.addRadio.emit();
  }
  
}
