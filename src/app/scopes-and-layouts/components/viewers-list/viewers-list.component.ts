import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ScopeDetails } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-viewers-list',
  templateUrl: './viewers-list.component.html',
  styleUrls: ['./viewers-list.component.scss']
})
export class ViewersListComponent {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<ScopeDetails>;
}
