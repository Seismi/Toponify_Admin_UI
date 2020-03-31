import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
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
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) {}

  @Output() raiseNew = new EventEmitter<void>();
  @Output() assignRadio = new EventEmitter<void>();

  public dataSource: MatTableDataSource<AttributeDetail>;
  public displayedColumns: string[] = ['refNo', 'name', 'status', 'navigate'];

  onSelect(id: string): void {
    this.router.navigate(['/radio/' + id], { queryParamsHandling: 'preserve' });
  }
}
