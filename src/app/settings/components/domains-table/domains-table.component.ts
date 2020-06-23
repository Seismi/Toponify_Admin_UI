import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { OrganisationEmailDomains } from '@app/settings/store/models/organisation.model';

@Component({
  selector: 'smi-domains-table',
  templateUrl: 'domains-table.component.html',
  styleUrls: ['domains-table.component.scss']
})
export class DomainsTableComponent {
  @Input()
  set data(data: OrganisationEmailDomains) {
    if (data) {
      this.dataSource = new MatTableDataSource<OrganisationEmailDomains>([data]);
    }
  }

  @Output() edit = new EventEmitter<void>();

  public displayedColumns: string[] = ['name', 'edit'];
  public dataSource: MatTableDataSource<OrganisationEmailDomains>;
}
