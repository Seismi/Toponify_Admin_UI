import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-reply-text',
  templateUrl: './reply-text.component.html',
  styleUrls: ['./reply-text.component.scss']
})

export class ReplyTextComponent {

  @Input() rows:number = 4;
  @Input() group: FormGroup;

}