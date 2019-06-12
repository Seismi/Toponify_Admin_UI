import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

@Component({
  selector: 'smi-workpackage-tab-table',
  templateUrl: './workpackage-tab-table.component.html',
  styleUrls: ['./workpackage-tab-table.component.scss']
})
export class WorkPackageTabTableComponent {

  checked = false;

  constructor(private diagramChangesService: DiagramChangesService) {}

  selectedColors: string[] = this.diagramChangesService.colors;
  
  @Input()
  set data(data: WorkPackageEntity[]) {
    this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
  }

  public dataSource: MatTableDataSource<WorkPackageEntity>;
  displayedColumns: string[] = ['show', 'name', 'c', 'e', 'd'];

  @Output()
  selectWorkPackage = new EventEmitter();

  @Output()
  selectColor = new EventEmitter();

  onSelect(id, event) {
    if(event.checked) {
      this.selectWorkPackage.emit(id)
    }
  }

  onSelectColor(color, id) {
    const colors = this.selectedColors.map((name, workpackageId) => ({name: color, workpackageId: id}));
    this.selectColor.emit(colors)
  }

}