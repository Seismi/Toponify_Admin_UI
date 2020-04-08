import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from '@app/core/constants';
import { User } from '@app/settings/store/models/user.model';
import { RadioDetail, RelatesTo } from '@app/radio/store/models/radio.model';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { Tag, NodeDetail } from '@app/architecture/store/models/node.model';

interface Scores {
  level: number;
  text: string;
}

@Component({
  selector: 'smi-radio-detail',
  templateUrl: './radio-detail.component.html',
  styleUrls: ['./radio-detail.component.scss']
})
export class RadioDetailComponent {
  public users: User[];
  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() radioStatus: string;
  @Input() rows = 8;
  @Input() relatesTo: RadioDetail;
  @Input() tags: Tag[];
  @Input() availableTags: Tag[];
  @Input() selectedNode: NodeDetail;

  @Input()
  set data(data: any[]) {
    this.users = data;
  }

  public scores: Scores[] = [
    {
      level: 1,
      text: 'Lowest'
    },
    {
      level: 2,
      text: 'Low'
    },
    {
      level: 3,
      text: 'Medium'
    },
    {
      level: 4,
      text: 'High'
    },
    {
      level: 5,
      text: 'Highest'
    }
  ];
  public categories = Constants.RADIO_CATEGORIES;
  public status = Constants.RADIO_STATUS;
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

  @Output()
  archiveRadio = new EventEmitter<void>();

  @Output()
  saveRadio = new EventEmitter<void>();

  @Output()
  unlinkRelatesTo = new EventEmitter<RelatesTo>();

  @Output()
  addRelatesTo = new EventEmitter<void>();

  @Output()
  deleteRadio = new EventEmitter<void>();
  
  @Output() addTag = new EventEmitter<string>();
  @Output() updateAvailableTags = new EventEmitter<void>();
  @Output() removeTag = new EventEmitter<Tag>();

  compareUsers(u1: any, u2: any): boolean {
    return u1.name === u2.name && u1.id === u2.id;
  }

  onArchive() {
    this.archiveRadio.emit();
  }

  onSave() {
    this.isEditable = false;
    this.saveRadio.emit();
  }

  onEdit() {
    this.isEditable = true;
  }

  onCancel() {
    this.isEditable = false;
  }

  onDelete(): void {
    this.deleteRadio.emit();
  }
}
