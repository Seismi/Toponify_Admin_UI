import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagListComponent } from '@app/architecture/components/tag-list/tag-list.component';
import { TagDetailModalComponent } from '@app/architecture/components/tag-list/tag-detail-modal/tag-detail-modal.component';
import {
  MatAutocompleteModule, MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatSelectModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatTooltipModule
  ],
  declarations: [TagListComponent, TagDetailModalComponent],
  entryComponents: [TagDetailModalComponent],
  exports: [TagListComponent]
})
export class TagListModule {}
