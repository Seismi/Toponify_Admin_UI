import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagListComponent } from '@app/architecture/components/tag-list/tag-list.component';
import { TagDetailModalComponent } from '@app/architecture/components/tag-list/tag-detail-modal/tag-detail-modal.component';
import {
  MatAutocompleteModule, MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatSelectModule, MatTableModule, MatTooltipModule, MatPaginatorModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from '@app/architecture/components/tag-list/tag/tag.module';
import { ManageTagsModalComponent } from '@app/architecture/components/tag-list/manage-tags-modal/manage-tags-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    TagModule
  ],
  declarations: [TagListComponent, TagDetailModalComponent, ManageTagsModalComponent],
  entryComponents: [TagDetailModalComponent, ManageTagsModalComponent],
  exports: [TagListComponent]
})
export class TagListModule {}
