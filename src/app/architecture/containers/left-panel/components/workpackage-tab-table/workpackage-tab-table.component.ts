import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

// TEMPORARY 
const workpackage = [
  {
    name: 'green',
    id: 'c288392e-6cf5-11e9-a923-1681be663d3e'
  },
  {
    name: 'orange',
    id: 'c2883c3a-6cf5-11e9-a923-1681be663d3e'
  },
  {
    name: 'blue',
    id: 'c2883e74-6cf5-11e9-a923-1681be663d3e'
  }
]

@Component({
  selector: 'smi-workpackage-tab-table',
  templateUrl: './workpackage-tab-table.component.html',
  styleUrls: ['./workpackage-tab-table.component.scss']
})
export class WorkPackageTabTableComponent {

  checked = false;

  constructor(private diagramChangesService: DiagramChangesService) {}

  @Input()
  set data(data: WorkPackageEntity[]) {
    this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
  }

  public dataSource: MatTableDataSource<WorkPackageEntity>;
  displayedColumns: string[] = ['show', 'name', 'c', 'e', 'd'];

  @Output()
  selectWorkPackage = new EventEmitter();

  @Output()
  selectColor = new EventEmitter<object>();

  onSelect(id, event) {
    if(event.checked) {
      this.selectWorkPackage.emit(id)
    }
  }

  onSelectColor(color, id) {
    this.selectColor.emit({color, id});
  }

}