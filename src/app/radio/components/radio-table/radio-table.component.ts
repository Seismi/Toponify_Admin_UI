import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RadioEntity } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-radio-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableComponent {
  public selectedRowIndex = -1;

  @Input()
  set data(data: RadioEntity[]) {
    this.dataSource = new MatTableDataSource<RadioEntity>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['refNo', 'category', 'status', 'title', 'last_update_date', 'last_update_by'];
  public dataSource: MatTableDataSource<RadioEntity>;

  @Output()
  selectRadio = new EventEmitter<string>();

  @Output()
  addRadio = new EventEmitter<void>();

  @Output()
  download = new EventEmitter<void>();

  onSelectRow(row) {
    this.selectedRowIndex = row.id;
    this.selectRadio.emit(row);
  }

  onAdd() {
    this.addRadio.emit();
  }

  downloadCSV(): void {
    this.download.emit();
  }
}
