import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { GroupInfo } from '@app/architecture/store/models/node.model';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'smi-components-table',
  templateUrl: './components-table.component.html',
  styleUrls: ['./components-table.component.scss']
})
export class ComponentsTableComponent {
  @Input() title: string;
  @Input() workPackageIsEditable: boolean;
  @Input() disabled: boolean;
  @Input() allowSort = true;
  @Input()
  set data(data: GroupInfo[]) {
    if (!data) {
      data = [];
    } else {
      data = cloneDeep(data);
    }
    this.setTableData(data);
  }

  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<any>();
  @Output() itemClick = new EventEmitter<any>();
  @Output() changeOrder = new EventEmitter<GroupInfo[]>();

  public dataSource: MatTableDataSource<GroupInfo>;
  public displayedColumns: string[] = ['name', 'arrow-up', 'arrow-down', 'actions'];

  public allowMoveUp(sortOrder: number): boolean {
    if (this.dataSource.data.length === 1) {
      return false;
    }
    if (!sortOrder) {
      return;
    }
    return sortOrder === 1 ? false : true;
  }

  public allowMoveDown(sortOrder: number): boolean {
    if (this.dataSource.data.length === 1) {
      return false;
    }
    if (!sortOrder) {
      return;
    }
    return this.dataSource.data.length === sortOrder ? false : true;
  }

  public handleMoveUpElement(element: GroupInfo): void {
    let data = cloneDeep(this.dataSource.data);

    if (!element.sortOrder || element.sortOrder === 0) {
      data = this.setMissingOrder(data);
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === element.id) {
        if (data[i - 1]) {
          data[i - 1].sortOrder = data[i].sortOrder;
          data[i].sortOrder -= 1;
          break;
        }
      }
    }
    this.setTableData(data);
    this.changeOrder.emit(data);
  }

  public handleMoveDownElement(element: GroupInfo): void {
    let data = cloneDeep(this.dataSource.data);

    if (!element.sortOrder || element.sortOrder === 0) {
      data = this.setMissingOrder(data);
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === element.id) {
        if (data[i + 1]) {
          data[i + 1].sortOrder = data[i].sortOrder;
          data[i].sortOrder += 1;
          break;
        }
      }
    }
    this.setTableData(data);
    this.changeOrder.emit(data);
  }

  private setMissingOrder(data: Array<GroupInfo>): Array<GroupInfo> {
    let order = 1;
    return data.map(el => {
      if (el.sortOrder && el.sortOrder > 0) {
        order = ++el.sortOrder;
        return { ...el, sortOrder: el.sortOrder };
      } else {
        return { ...el, sortOrder: order++ };
      }
    });
  }

  private setTableData(data: GroupInfo[]): void {
    data.sort((a: GroupInfo, b: GroupInfo) => {
      if (!a.sortOrder || a.sortOrder === 0) {
        return 1;
      }
      return a.sortOrder - b.sortOrder;
    });
    this.dataSource = new MatTableDataSource<GroupInfo>(data);
  }
}
