import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-reply-text',
  templateUrl: './reply-text.component.html',
  styleUrls: ['./reply-text.component.scss']
})

export class ReplyTextComponent {
  @Input() group: FormGroup;
  @Input() replyMode: boolean = false;
  @Input() rows: number = 4;
  public disabled: boolean = true;

  onType(event) {
    (event.length) ? this.disabled = false : this.disabled = true;
  }

  @Output()
  sendReply = new EventEmitter();

  onSend() {
    this.sendReply.emit();
  }
}