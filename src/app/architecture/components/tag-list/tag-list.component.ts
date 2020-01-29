import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Tag } from '@app/architecture/store/models/node.model';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagControl = new FormControl();
  filteredTags$: Observable<Tag[]>;
  availableTags$ = new Subject<Tag[]>();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  @Output() updateAvailableTags = new EventEmitter<void>();

  constructor() {
    this.filteredTags$ = combineLatest(this.tagControl.valueChanges.pipe(startWith(null)), this.availableTags$).pipe(
      map(([tagName, tags]) => (tagName ? this.filter(tagName, tags) : tags))
    );
  }

  onRemove(removedTag: Tag): void {
    console.log('remove');
    const index = this.tags.findIndex(tag => tag.id === removedTag.id);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagInput.nativeElement.blur();
    if (event.option.value === 'manage') {
      return this.manageTags();
    }
    if (event.option.value === 'create') {
      return this.creatNew();
    }
    console.log('selected', event);
    // this.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagControl.reset();
  }

  private filter(value: string, tags: Tag[]): Tag[] {
    const filterValue = value.toLowerCase();
    return tags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) > -1);
  }

  creatNew() {
    this.tagControl.reset();
    console.log('create new');
  }

  manageTags() {
    this.tagControl.reset();
    console.log('manage tags');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('tags') || changes.hasOwnProperty('editMode')) {
      this.updateAvailableTags.emit();
    }
  }
}
