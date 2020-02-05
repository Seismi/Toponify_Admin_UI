import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Tag, TagApplicableTo, TagColour, TagIcon } from '@app/architecture/store/models/node.model';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TagDetailModalComponent } from '@app/architecture/components/tag-list/tag-detail-modal/tag-detail-modal.component';
import { Level } from '@app/architecture/services/diagram-level.service';
import { ManageTagsModalComponent } from '@app/architecture/components/tag-list/manage-tags-modal/manage-tags-modal.component';

@Component({
  selector: 'smi-tag-list',
  templateUrl: 'tag-list.component.html',
  styleUrls: ['tag-list.component.scss']
})
export class TagListComponent implements OnChanges {
  @Input() tags: Tag[];
  @Input() editMode: boolean;
  @Input('availableTags') set availableTags(tags: Tag[]) {
    this.availableTags$.next(tags);
  }
  @Input() componentLayer: string;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagControl = new FormControl({ value: '', disabled: true });
  filteredTags$: Observable<Tag[]>;
  availableTags$ = new Subject<Tag[]>();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  @Output() updateAvailableTags = new EventEmitter<void>();
  @Output() createTag = new EventEmitter<Tag>();
  @Output() addTag = new EventEmitter<string>();
  @Output() removeTag = new EventEmitter<Tag>();
  @Output() updateTag = new EventEmitter<Tag>();

  constructor(private dialog: MatDialog) {
    this.filteredTags$ = combineLatest(this.tagControl.valueChanges.pipe(startWith(null)), this.availableTags$).pipe(
      map(([tagName, tags]) => (tagName ? this.filter(tagName, tags) : tags))
    );
  }

  onRemove(removedTag: Tag): void {
    this.removeTag.emit(removedTag);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagInput.nativeElement.blur();
    if (event.option.value === 'manage') {
      return this.manageTags();
    }
    if (event.option.value.startsWith('@create_')) {
      return this.creatNew();
    }
    this.addTag.emit(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagControl.reset();
  }

  private filter(value: string, tags: Tag[]): Tag[] {
    const filterValue = value.toLowerCase();
    return tags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) > -1);
  }

  creatNew() {
    const dialogRef = this.dialog.open(TagDetailModalComponent, {
      disableClose: false,
      minWidth: '500px',
      data: {
        tag: {
          id: '',
          name: this.tagControl.value.replace('@create_', '').trim(),
          applicableTo: [this.componentLayer + 's'],
          textColour: TagColour.black,
          backgroundColour: TagColour.white,
          iconName: 'none'
        },
        currentComponentType: this.componentLayer + 's'
      }
    });
    this.tagInput.nativeElement.value = '';
    this.tagControl.reset();

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.tag) {
        this.createTag.emit(data.tag);
      }
    });
  }

  manageTags() {
    this.dialog.open(ManageTagsModalComponent, {
      disableClose: false,
      minWidth: '600px',
      data: {
       tags: this.tags
      }
    });
    this.tagInput.nativeElement.value = '';
    this.tagControl.reset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('tags') || changes.hasOwnProperty('editMode')) {
      this.updateAvailableTags.emit();
    }
  }
}
