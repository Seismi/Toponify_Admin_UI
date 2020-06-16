import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'smi-organisation-table',
  templateUrl: 'organisation-table.component.html',
  styleUrls: ['organisation-table.component.scss']
})
export class OrganisationTableComponent {
  @Input() title: string;
  @Input()
  set data(data: any[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
    }
  }

  public displayedColumns: string[] = ['name', 'delete'];
  public dataSource: MatTableDataSource<any>;
}
