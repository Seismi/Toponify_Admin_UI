import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-radio-table-in-reports-page',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableInReportsPageComponent {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) {}

  public dataSource: MatTableDataSource<Report>;
  displayedColumns: string[] = ['name', 'navigate'];

  onSelect(id){
    this.router.navigate(['/radio/' + id]);
  }
}