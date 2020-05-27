import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RadioEntity, TableData, Page } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-radio-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableComponent implements AfterViewInit {
  @Input() selectedRadioIndex: string | number = -1;

  @Input()
  set data(data: TableData<RadioEntity>) {
    this.dataSource = new MatTableDataSource<RadioEntity>(data.entities);
    this.page = data.page;
    console.info('page: ', this.page);
    this.dataSource.sort = this.sort;
  }

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['refNo', 'category', 'status', 'title', 'last_update_date', 'last_update_by'];
  public dataSource: MatTableDataSource<RadioEntity>;
  public page: Page;

  @Output() selectRadio = new EventEmitter<string>();
  @Output() addRadio = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<{
    previousPageIndex: number;
    pageIndex: number;
    pageSize: number;
    length: number;
  }>();

  onSelectRow(row) {
    this.selectRadio.emit(row);
  }

  onAdd() {
    this.addRadio.emit();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(nextPage => {
      // debugger;
      this.pageChange.emit(nextPage);
    });
  }

  downloadCSV(): void {
    this.download.emit();
  }
}
