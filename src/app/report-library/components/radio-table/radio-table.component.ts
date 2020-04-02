import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { RelatedRadios } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-radio-table-in-reports-page',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableInReportsPageComponent {
  @Input() workPackageIsEditable: boolean;
  @Input()
  set data(data: RelatedRadios[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<RelatedRadios>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() raiseNew = new EventEmitter<void>();
  @Output() assignRadio = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  constructor(private router: Router) {}

  public dataSource: MatTableDataSource<RelatedRadios>;
  displayedColumns: string[] = ['refNo', 'name', 'status', 'navigate'];

  onSelect(id: string) {
    this.router.navigate(['/radio/' + id], { queryParamsHandling: 'preserve' });
  }
}
