import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ScopeDetails } from '@app/scope/store/models/scope.model';


@Component({
  selector: 'smi-owners-list',
  templateUrl: './owners-list.component.html',
  styleUrls: ['./owners-list.component.scss']
})
export class OwnersListComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<ScopeDetails>;

}