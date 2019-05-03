import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-quicklinks-actions',
  templateUrl: './quicklinks-actions.component.html',
  styleUrls: ['./quicklinks-actions.component.scss']
})
export class QuicklinksActionsComponent implements OnInit {

  @Input() gojsView = false;
  @Input() navigate: string;

  ngOnInit() {
    this.navigate = 'control_camera';
  }

  @Output()
  navigateDiagram = new EventEmitter();

  onNavigate(){
    this.navigateDiagram.emit();
  }

}