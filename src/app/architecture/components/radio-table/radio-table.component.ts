import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { Constants } from '@app/core/constants';

@Component({
  selector: 'smi-radio-table-in-architecture',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableInArchitectureComponent {
  @Input()
  set data(data: NodeDetail[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<NodeDetail>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) {}

  public dataSource: MatTableDataSource<NodeDetail>;
  public displayedColumns: string[] = Constants.RADIO_TABLE_COLUMNS;

  @Output() raiseNew = new EventEmitter<void>();
  @Output() openRadio = new EventEmitter<RadioDetail>();

  onOpen(radio: RadioDetail) {
    this.openRadio.emit(radio);
  }
}
