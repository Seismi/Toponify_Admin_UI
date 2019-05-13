import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioComponent } from './containers/radio.component';
import { RadioRoutingComponent } from './containers/radio-routing.components';
import { CoreModule } from '@app/core/core.module';
import { CommonModule } from '@angular/common';
import { RadioRoutingModule } from './radio-routing.module';
import { 
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule  
} from '@angular/material';
import { RadioTableComponent } from './components/radio-table/radio-table.component';
import { RadioModalComponent } from './containers/radio-modal/radio-modal.component';
import { ReplyModalComponent } from './containers/reply-modal/reply-modal.component';
import { ReplyTextComponent } from './components/reply-text/reply-text.component';
import { ChatBoxComponent } from './components/chatbox/chatbox.component';
import { RadioDetailComponent } from './components/radio-detail/radio-detail.component';
import { RadioService } from './services/radio.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RadioEffects } from './store/effects/radio.effects';
import { reducer } from './store/reducer/radio.reducer';


@NgModule({
    imports: [
        RadioRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        CommonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatPaginatorModule,
        MatDialogModule,
        StoreModule.forFeature('radioFeature', reducer),
        EffectsModule.forFeature([ RadioEffects ])
    ],
    exports: [],
    declarations: [
        RadioComponent, 
        RadioRoutingComponent,
        RadioTableComponent,
        RadioDetailComponent,
        RadioModalComponent,
        ReplyModalComponent,
        ReplyTextComponent,
        ChatBoxComponent
    ],
    entryComponents: [RadioModalComponent, ReplyModalComponent],
    providers: [
        RadioService
    ]
})
export class RadioModule { }
