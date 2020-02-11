import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule, MatIconModule } from '@angular/material';
import { TagComponent } from '@app/architecture/components/tag-list/tag/tag.component';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule],
  declarations: [TagComponent],
  exports: [TagComponent]
})
export class TagModule {}
