import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';
import { Roles } from '@app/core/directives/by-role.directive';

@Component({
  selector: 'smi-documentation-standards-table',
  templateUrl: 'documentation-standards-table.component.html',
  styleUrls: ['documentation-standards-table.component.scss']
})
export class DocumentationStandardsTableComponent {
  public selectedRowIndex: string | number = -1;
  public Roles = Roles;

  @ViewChild('searchField') input: ElementRef;

  @Input()
  set data(data: DocumentStandard[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<DocumentStandard>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.input) {
        this.dataSource.filter = this.input.nativeElement.value;
      }
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<DocumentStandard>;
  @Input() displayedColumns: string[] = ['name', 'levels'];

  @Output() documentSelected = new EventEmitter<DocumentStandard>();
  @Output() addDocument = new EventEmitter<void>();

  onSelectRow(documentStandard: DocumentStandard): void {
    this.selectedRowIndex = documentStandard.id;
    this.documentSelected.emit(documentStandard);
  }

  onAdd(): void {
    this.addDocument.emit();
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
