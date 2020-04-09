import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

@Component({
  selector: 'smi-reply-text',
  templateUrl: './reply-text.component.html',
  styleUrls: ['./reply-text.component.scss']
})
export class ReplyTextComponent {
  @Input() group: FormGroup;
  @Input() replyMode = false;
  @Input() rows = 3;

  public editor = InlineEditor;
  public config = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'blockQuote',
      'insertTable',
      'undo',
      'redo'
    ],
    removePlugins: ['MediaEmbed', 'ImageUpload', 'ImageToolbar', 'ImageStyle', 'ImageCaption', 'Image', 'EasyImage']
  };

  @Output() sendReply = new EventEmitter<void>();
}
