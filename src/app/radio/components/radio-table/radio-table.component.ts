import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RadioEntity, TableData, Page } from '@app/radio/store/models/radio.model';
import { Observable } from 'rxjs';
import { LoadingStatus } from '@app/architecture/store/models/node.model';
import { Store } from '@ngrx/store';
import { State as RadioState } from '../../store/reducers/radio.reducer';
import { getRadiosLoadingStatus } from '@app/radio/store/selectors/radio.selector';

@Component({
  selector: 'smi-radio-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableComponent implements AfterViewInit {
  public loadingStatus = LoadingStatus;
  @Input() selectedRadioIndex: string | number = -1;

  @Input()
  set data(data: TableData<RadioEntity>) {
    this.dataSource = new MatTableDataSource<RadioEntity>(data.entities);
    this.page = data.page;
    this.dataSource.sort = this.sort;
  }

  constructor(private store: Store<RadioState>) { }

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  get isLoading$(): Observable<LoadingStatus> {
    return this.store.select(getRadiosLoadingStatus);
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
