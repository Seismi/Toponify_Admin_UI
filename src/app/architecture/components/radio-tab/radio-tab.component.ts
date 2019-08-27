import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-radio-tab',
  templateUrl: './radio-tab.component.html',
  styleUrls: ['./radio-tab.component.scss']
})
export class RadioTabComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) {}

  public dataSource: MatTableDataSource<NodeDetail>;
  displayedColumns: string[] = ['name', 'navigate'];

  @Output()
  addRadio = new EventEmitter();

  onAdd() {
    this.addRadio.emit();
  }

  onSelect(id){
    this.router.navigate(['/radio/' + id]);
  }

}