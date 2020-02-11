import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Tag } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-tag',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent {
  @Input() tag: Tag;
  @Input() removable: boolean;

  @Output() remove = new EventEmitter<Tag>();

  onRemove(removedTag: Tag): void {
    this.remove.emit(removedTag);
  }
}
