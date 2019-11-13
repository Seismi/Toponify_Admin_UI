import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-radios-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadiosTableComponent  {

  //Temporary till delete API will be fixed
  public hide: boolean = false;
  
  @Input() statusDraft: boolean = false;

  @Input()
  set data(data: WorkPackageDetail[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<WorkPackageDetail>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['name', 'delete'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output() addRadio = new EventEmitter<void>();
  @Output() deleteRadio = new EventEmitter<RadioEntity>();

  onAdd(): void {
    this.addRadio.emit();
  }

  onDelete(radio: RadioEntity) {
    this.deleteRadio.emit(radio);
  }
}