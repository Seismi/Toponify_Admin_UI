import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AttributesEntity } from '@app/architecture/store/models/node-link.model';

@Component({
  selector: 'smi-attributes-tab',
  templateUrl: './attributes-tab.component.html',
  styleUrls: ['./attributes-tab.component.scss']
})
export class AttributesTabComponent {
  @Input() workPackageIsEditable: boolean;
  @Input() nodeCategory: string;

  @Input()
  set data(data: AttributesEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<AttributesEntity>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<AttributesEntity>;
  public displayedColumns: string[] = ['category', 'name'];

  @Output() addAttribute = new EventEmitter<void>();
  @Output() addExisting = new EventEmitter<void>();

  onAdd(): void {
    this.addAttribute.emit();
  }

  onAddExisting(): void {
    this.addExisting.emit();
  }

  nodeIsEditable(): boolean {
    if (!this.workPackageIsEditable || this.nodeCategory === 'copy') {
      return true;
    }
    return false;
  }
}
