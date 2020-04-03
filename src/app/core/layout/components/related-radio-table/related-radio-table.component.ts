import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { Constants } from '@app/core/constants';

@Component({
  selector: 'smi-related-radio-table',
  templateUrl: './related-radio-table.component.html',
  styleUrls: ['./related-radio-table.component.scss']
})
export class RelatedRadioTableComponent {
  @Input() showButtons = true;

  @Input()
  set data(data: NodeDetail[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<NodeDetail>(
      data.filter((data, index, radios) =>
        radios.findIndex(radio => (JSON.stringify(radio) === JSON.stringify(data))) === index)
    );
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) { }

  public dataSource: MatTableDataSource<NodeDetail>;
  public displayedColumns: string[] = Constants.RADIO_TABLE_COLUMNS;

  @Output() raiseNew = new EventEmitter<void>();
  @Output() openModal = new EventEmitter<RadioDetail>();
  @Output() assignRadio = new EventEmitter<void>();

  openRadio(radioId: string): void {
    this.router.navigate(['/radio/' + radioId], { queryParamsHandling: 'preserve' });
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
