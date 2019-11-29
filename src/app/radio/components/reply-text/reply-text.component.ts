import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-reply-text',
  templateUrl: './reply-text.component.html',
  styleUrls: ['./reply-text.component.scss']
})
export class ReplyTextComponent {
  @Input() group: FormGroup;
  @Input() replyMode = false;
  @Input() rows = 4;
  public disabled = true;

  @Output()
  sendReply = new EventEmitter<void>();

  onType(event) {
    event.length ? (this.disabled = false) : (this.disabled = true);
  }

  onSend() {
    this.sendReply.emit();
  }
}
