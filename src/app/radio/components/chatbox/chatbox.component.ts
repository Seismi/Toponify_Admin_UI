import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'smi-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatBoxComponent {

  @Input() group: FormGroup;

  constructor() {}

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['title'];
  public dataSource: MatTableDataSource<RadioDetail>;

  @Output()
  sendReply = new EventEmitter();

  onSend() {
    this.sendReply.emit();
  }
  
}