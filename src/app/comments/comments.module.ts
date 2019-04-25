import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from './containers/comments.component';
import { CommentService } from './services/comment.service';
import { reducer } from './store/reducer/comment.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommentEffects } from './store/effects/comment.effects';
import { CommonModule } from '@angular/common';

import { 
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatPaginatorModule,
  MatDialogModule  
} from '@angular/material';
import { CommentsTableComponent } from './components/comments-table/comments-table.component';
import { CommentsDetailComponent } from './components/comments-detail/comments-detail.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { CoreModule } from '@app/core/core.module';
import { CommentModalComponent } from './containers/comment-modal/comment-modal.component';
import { ReplyCommentModalComponent } from './containers/reply-comment-modal/reply-comment-modal.component';
import { ReplyTextComponent } from './components/reply-text/reply-text.component';

@NgModule({
  imports: [
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    StoreModule.forFeature('commentFeature', reducer),
    EffectsModule.forFeature([CommentEffects])
  ],
  declarations: [
    CommentsComponent,
    CommentsTableComponent,
    CommentsDetailComponent,
    ChatboxComponent,
    CommentModalComponent,
    ReplyCommentModalComponent,
    ReplyTextComponent
  ],
  entryComponents: [CommentModalComponent, ReplyCommentModalComponent],
  exports: [CommentsComponent],
  providers: [CommentService]
})
export class CommentsModule {}
