import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-quicklinks-actions',
  templateUrl: './quicklinks-actions.component.html',
  styleUrls: ['./quicklinks-actions.component.scss']
})
export class QuicklinksActionsComponent implements OnInit {

  @Input()
  set data(data: WorkPackageEntity[]) {
    this.workpackage = data;
  }

  @Input() gojsView = false;
  @Input() navigate: string;
  workpackage: any[];

  ngOnInit() {
    this.navigate = 'control_camera';
  }

  @Output()
  navigateDiagram = new EventEmitter();

  @Output()
  selectWorkPackage = new EventEmitter();


  onNavigate(){
    this.navigateDiagram.emit();
  }

  onSelect(id) {
    this.selectWorkPackage.emit(id);
  }

}