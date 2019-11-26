import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { AttributeDetail } from '@app/attributes/store/models/attributes.model';

@Component({
  selector: 'smi-radio-table-in-attributes-page',
  templateUrl: './radio-table.component.html',
  styleUrls: ['./radio-table.component.scss']
})
export class RadioTableInAttributesPageComponent {
  @Input()
  set data(data: any[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) {}

  public dataSource: MatTableDataSource<AttributeDetail>;
  displayedColumns: string[] = ['name', 'navigate'];

  onSelect(id){
    this.router.navigate(['/radio/' + id], {queryParamsHandling: 'preserve' });
  }
}
