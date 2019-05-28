import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';

@Component({
  selector: 'smi-documentation-standards-table',
  templateUrl: 'documentation-standards-table.component.html',
  styleUrls: ['documentation-standards-table.component.scss']
})
export class DocumentationStandardsTableComponent implements OnInit {

  @Input()
  set data(data: DocumentStandard[]) {
    this.dataSource = new MatTableDataSource<DocumentStandard>(data);
  }

  selectedRowIndex: number = -1;

  ngOnInit() {}

  public dataSource: MatTableDataSource<DocumentStandard>;
  displayedColumns: string[] = ['name', 'levels'];

  @Output()
  documentationSelected = new EventEmitter();

  onSelectRow(row) {
    this.selectedRowIndex = row.id;
    this.documentationSelected.emit(row);
  }

}