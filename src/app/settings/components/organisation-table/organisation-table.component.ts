import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { OrganisationAccountAdmins } from '@app/settings/store/models/organisation.model';

@Component({
  selector: 'smi-organisation-table',
  templateUrl: 'organisation-table.component.html',
  styleUrls: ['organisation-table.component.scss']
})
export class OrganisationTableComponent {
  @Input() title: string;
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
