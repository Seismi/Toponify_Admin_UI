import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-radio-tab',
  templateUrl: './radio-tab.component.html',
  styleUrls: ['./radio-tab.component.scss']
})
export class RadioTabComponent {

  @Input()
  set data(data: NodeDetail[]) {
    this.dataSource = new MatTableDataSource<NodeDetail>(data);
  }

  public dataSource: MatTableDataSource<NodeDetail>;
  displayedColumns: string[] = ['type', 'name'];

  @Output()
  addRadioInArchitecture = new EventEmitter();

  onSelectRow(radio) {}

  onAdd() {
    this.addRadioInArchitecture.emit();
  }

}