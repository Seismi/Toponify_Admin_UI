import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-radios-table',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadiosTableComponent {
  @Input() statusDraft = false;

  @Input()
  set data(data: WorkPackageDetail[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageDetail>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  constructor(private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['refNo', 'name', 'status', 'edit', 'delete'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output() addRadio = new EventEmitter<void>();
  @Output() deleteRadio = new EventEmitter<RadioEntity>();
  @Output() editRadio = new EventEmitter<WorkPackageDetail>();

  onAdd(): void {
    this.addRadio.emit();
  }

  onDelete(radio: RadioEntity): void {
    this.deleteRadio.emit(radio);
  }

  onEdit(radio: WorkPackageDetail): void {
    this.editRadio.emit(radio);
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToRadioPage(radioId: string): void {
    this.router.navigate([`/radio/${radioId}`]);
  }
}
