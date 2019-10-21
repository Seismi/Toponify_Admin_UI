import { Component, Input, EventEmitter, Output } from '@angular/core';
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
  public radio: RadioDetail;

  constructor() {}

  @Input()
  set data(data: any) { this.radio = data };

  displayedColumns: string[] = ['title'];
  public dataSource: MatTableDataSource<RadioDetail>;

  @Output()
  sendReply = new EventEmitter();

  onSend() {
    this.sendReply.emit();
  }
  
}