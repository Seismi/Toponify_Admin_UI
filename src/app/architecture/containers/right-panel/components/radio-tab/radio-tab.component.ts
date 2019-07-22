import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NodeDetail } from '@app/nodes/store/models/node.model';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-radio-tab',
  templateUrl: './radio-tab.component.html',
  styleUrls: ['./radio-tab.component.scss']
})
export class RadioTabComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  constructor(private router: Router) {}

  public dataSource: MatTableDataSource<NodeDetail>;
  displayedColumns: string[] = ['name', 'navigate'];

  @Output()
  addRadioInArchitecture = new EventEmitter();

  onAdd() {
    this.addRadioInArchitecture.emit();
  }

  onSelect(id){
    this.router.navigate(['/radio/' + id]);
  }

}