import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-reply-text',
  templateUrl: './reply-text.component.html',
  styleUrls: ['./reply-text.component.scss']
})

export class ReplyTextComponent {

  @Input() replyMode = false;
  @Input() rows:number = 4;
  @Input() group: FormGroup;
  @Input() disableButton = true;

  @Output()
  sendReply = new EventEmitter();

  onSend() {
    this.sendReply.emit();
  }

}