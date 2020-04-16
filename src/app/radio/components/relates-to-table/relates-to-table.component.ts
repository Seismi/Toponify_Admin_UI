import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { RadioDetail, RelatesTo } from '@app/radio/store/models/radio.model';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-relates-to-table',
  templateUrl: './relates-to-table.component.html',
  styleUrls: ['./relates-to-table.component.scss']
})
export class RelatesToTableComponent {
  @Input()
  set data(data: RadioDetail[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<RadioDetail>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (radio: RadioDetail, filter) => {
        const dataStr = JSON.stringify(radio).toLowerCase();
        return dataStr.indexOf(filter) !== -1;
      };
    }
  }

  @Output() unlinkRelatesTo = new EventEmitter<RelatesTo>();
  @Output() addRelatesTo = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['workPackage', 'itemType', 'name'];
  public dataSource: MatTableDataSource<RadioDetail>;

  constructor(private router: Router) {}

  onAdd() {
    this.addRelatesTo.emit();
  }

  onUnLink(relatesTo: RelatesTo) {
    this.unlinkRelatesTo.emit(relatesTo);
  }

  loadRelateTo(element: any): void {
    try {
      const linkStringPos = element.item.itemType.indexOf('link');
      const isLink = linkStringPos !== -1;
      const selectedType = isLink ? 'link' : 'node';
      const filterLevel = (() => {
        if (isLink) {
          return element.item.itemType.substring(0, linkStringPos).trim();
        }
        return element.item.itemType;
      })();

      const quesryParams = {
        filterLevel: filterLevel,
        selectedItem: element.item.id,
        selectedType: selectedType
      };

      if (element.workPackage.id !== '00000000-0000-0000-0000-000000000000') {
        quesryParams['workpackages'] = element.workPackage.id;
      }
      this.router.navigate(['/topology'], { queryParams: quesryParams});
    } catch (err) {
      console.error(err);
    }
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
