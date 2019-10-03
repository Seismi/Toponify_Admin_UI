import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { RelatedRadios } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-radio-table-in-reports-page',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableInReportsPageComponent {
  @Input()
  set data(data: RelatedRadios[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<RelatedRadios>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) {}

  public dataSource: MatTableDataSource<RelatedRadios>;
  displayedColumns: string[] = ['name', 'navigate'];

  onSelect(id: string) {
    this.router.navigate(['/radio/' + id]);
  }
}
