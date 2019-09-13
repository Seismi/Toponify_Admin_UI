import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { RadioEntity } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-radio-list',
  templateUrl: './radio-list.component.html',
  styleUrls: ['./radio-list.component.scss']
})
export class RadioListComponent {

  selectedRowIndex = -1;

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['title', 'category', 'status'];
  public dataSource: MatTableDataSource<RadioEntity>;

  @Output()
  selectRadio = new EventEmitter();

  onSelect(row) {
    this.selectedRowIndex = row.id;
    this.selectRadio.emit(row);
  }
}