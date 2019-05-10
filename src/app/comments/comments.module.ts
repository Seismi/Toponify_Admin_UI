import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from './containers/comments.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule
  ],
  declarations: [
    CommentsComponent
  ],
  entryComponents: [],
  exports: [CommentsComponent],
  providers: []
})
export class CommentsModule {}
