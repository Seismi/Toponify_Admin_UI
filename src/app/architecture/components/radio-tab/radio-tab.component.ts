import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { Constants } from '@app/core/constants';

@Component({
  selector: 'smi-radio-tab',
  templateUrl: './radio-tab.component.html',
  styleUrls: ['./radio-tab.component.scss']
})
export class RadioTabComponent {
  @Input() nodeCategory: string;

  @Input()
  set data(data: NodeDetail[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<NodeDetail>(
      data.filter((data, index, radios) => radios.findIndex(radio => (JSON.stringify(radio) === JSON.stringify(data))) === index)
    );
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) {}

  public dataSource: MatTableDataSource<NodeDetail>;
  public displayedColumns: string[] = Constants.RADIO_TABLE_COLUMNS;

  @Output()
  addRadio = new EventEmitter<void>();

  @Output()
  openRadio = new EventEmitter<RadioDetail>();

  @Output()
  assignRadio = new EventEmitter<void>();

  onAdd(): void {
    this.addRadio.emit();
  }

  onOpen(radio: RadioDetail) {
    this.openRadio.emit(radio);
  }

  onAssignRadio(): void {
    this.assignRadio.emit();
  }
}
