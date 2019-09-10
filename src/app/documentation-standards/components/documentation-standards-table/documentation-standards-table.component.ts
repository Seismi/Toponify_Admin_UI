import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';

@Component({
  selector: 'smi-documentation-standards-table',
  templateUrl: 'documentation-standards-table.component.html',
  styleUrls: ['documentation-standards-table.component.scss']
})
export class DocumentationStandardsTableComponent {

  selectedRowIndex: number = -1;

  @Input()
  set data(data: DocumentStandard[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<DocumentStandard>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<DocumentStandard>;
  @Input() displayedColumns: string[] = ['name', 'levels'];

  @Output()
  documentSelected = new EventEmitter();

  @Output()
  addDocument = new EventEmitter();

  onSelectRow(row) {
    this.selectedRowIndex = row.id
    this.documentSelected.emit(row);
  }

  onAdd() {
    this.addDocument.emit();
  }
}