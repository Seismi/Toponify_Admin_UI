import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-radios-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadiosTableComponent  {
  
  @Input() statusDraft: boolean = false;

  @Input()
  set data(data: any[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['type', 'name', 'delete'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output()
  deleteRadio = new EventEmitter();

  onDelete(radio) {
    this.deleteRadio.emit(radio);
  }
}