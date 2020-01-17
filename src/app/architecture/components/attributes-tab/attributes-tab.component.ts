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
  public displayedColumns: string[] = ['category', 'name', 'delete'];

  @Output() addAttribute = new EventEmitter<void>();
  @Output() deleteAttribute = new EventEmitter<AttributesEntity>();

  onAdd(): void {
    this.addAttribute.emit();
  }

  onDelete(attribute: AttributesEntity): void {
    this.deleteAttribute.emit(attribute);
  }

  nodeIsEditable(): boolean {
    if (!this.workPackageIsEditable || this.nodeCategory === 'copy') {
      return true;
    }
    return false;
  }
}
