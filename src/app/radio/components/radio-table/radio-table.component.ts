import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Radio } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-radio-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableComponent implements OnInit {

  selectedRowIndex: number = -1;
  @Input() radioPage: boolean;

  @Input()
  set data(data: Radio[]) {
    this.dataSource = new MatTableDataSource<Radio>(data);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() displayedColumns: string[] = ['title','category','status','last_update_date','last_update_by'];
  public dataSource: MatTableDataSource<Radio>;

  ngOnInit() {}

  @Output()
  showSelectedRowDetails = new EventEmitter<string>();

  @Output()
  addComment = new EventEmitter();

  onSelectRow(row) {
    this.showSelectedRowDetails.emit(row);
    this.selectedRowIndex = row.id;
  }

  onAdd() {
    this.addComment.emit();
  }
  
}
