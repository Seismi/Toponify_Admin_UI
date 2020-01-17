import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { NodeReports } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-reports-tab',
  templateUrl: './reports-tab.component.html',
  styleUrls: ['./reports-tab.component.scss']
})
export class ReportsTabComponent implements OnInit {
  @Input()
  set data(data: NodeReports[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<NodeReports>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public dataSource: MatTableDataSource<NodeReports>;
  public displayedColumns: string[] = ['name', 'owners', 'dataSet', 'navigate'];

  getOwners(data: NodeReports): string {
    return data.owners.map(owner => owner.name).join('; ');
  }

  onOpen(report: NodeReports): void {
    this.router.navigate([`/report-library/${report.id}`], { queryParamsHandling: 'preserve' });
  }
}
