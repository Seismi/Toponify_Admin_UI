import { Component, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { Constants } from '@app/core/constants';
import { RadioEntity, TableData, Page } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-radio-table-in-architecture',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableInArchitectureComponent implements AfterViewInit {
  @Input()
  set data(data: TableData<RadioEntity>) {
    this.dataSource = new MatTableDataSource<RadioEntity>(data.entities);
    this.page = data.page;
  }

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  public dataSource: MatTableDataSource<RadioEntity>;
  public displayedColumns: string[] = Constants.RADIO_TABLE_COLUMNS;
  public page: Page;

  @Output() raiseNew = new EventEmitter<void>();
  @Output() openRadio = new EventEmitter<RadioDetail>();
  @Output() pageChange = new EventEmitter<{
    previousPageIndex: number;
    pageIndex: number;
    pageSize: number;
    length: number;
  }>();

  ngAfterViewInit() {
    this.paginator.page.subscribe(nextPage => {
      this.pageChange.emit(nextPage);
    });
  }

  onOpen(radio: RadioDetail) {
    this.openRadio.emit(radio);
  }
}
