import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { OrganisationAccountAdmins } from '@app/settings/store/models/organisation.model';

@Component({
  selector: 'smi-accounts-table',
  templateUrl: 'accounts-table.component.html',
  styleUrls: ['accounts-table.component.scss']
})
export class AccountsTableComponent {
  @Input()
  set data(data: OrganisationAccountAdmins[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<OrganisationAccountAdmins>(data);
    }
  }

  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<OrganisationAccountAdmins>();

  public displayedColumns: string[] = ['name', 'delete'];
  public dataSource: MatTableDataSource<OrganisationAccountAdmins>;
}
