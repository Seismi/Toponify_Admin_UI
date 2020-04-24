import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioComponent } from './containers/radio/radio.component';
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
  MatSortModule,
  MatDialogModule,
  MatSelectModule,
  MatTabsModule,
  MatDatepickerModule,
  MatIconModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatListModule,
  MatExpansionModule,
  MatTooltipModule,
  MatSliderModule,
  MatBadgeModule,
  MatChipsModule,
  MatCheckboxModule
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
import { reducer } from './store/reducers/radio.reducer';
import { RadioDetailsComponent } from './containers/radio-details/radio-details.component';
import { SettingsModule } from '@app/settings/settings.module';
import { RadioHeaderComponent } from './components/radio-header/radio-header.component';
import { FilterModalComponent } from './containers/filter-modal/filter-modal.component';
import { FilterRadioFormComponent } from './components/filter-radio-form/filter-radio-form.component';
import { DocumentationStandardsModule } from '@app/documentation-standards/documentation-standards.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { DeleteRadioPropertyModalComponent } from './containers/delete-property-modal/delete-property-modal.component';
import { RelatesToTableComponent } from './components/relates-to-table/relates-to-table.component';
import { AssociateModalComponent } from '@app/radio/components/associate-modal/associate-modal.component';
import { ConfirmModalComponent } from '@app/radio/components/confirm-modal/confirm-modal.component';
import { DeleteRadioModalComponent } from './containers/delete-radio-modal/delete-radio-modal.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TagListModule } from '@app/architecture/components/tag-list/tag-list.module';
import { AlphabeticalOrderPipe } from '@app/pipes/alphabetical-order.pipe';

@NgModule({
  imports: [
    RadioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    CommonModule,
    SettingsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatMomentDateModule,
    DocumentationStandardsModule,
    MatSidenavModule,
    TagListModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSliderModule,
    MatBadgeModule,
    MatChipsModule,
    MatCheckboxModule,
    StoreModule.forFeature('radioFeature', reducer),
    EffectsModule.forFeature([RadioEffects]),
    CKEditorModule
  ],
  exports: [
    RadioTableComponent,
    RadioDetailsComponent,
    ReplyTextComponent,
    ChatBoxComponent,
    RadioDetailComponent
  ],
  declarations: [
    RadioComponent,
    RadioRoutingComponent,
    RadioTableComponent,
    RadioDetailComponent,
    RadioModalComponent,
    ReplyModalComponent,
    ReplyTextComponent,
    ChatBoxComponent,
    RadioDetailsComponent,
    RadioHeaderComponent,
    FilterModalComponent,
    FilterRadioFormComponent,
    DeleteRadioPropertyModalComponent,
    RelatesToTableComponent,
    ConfirmModalComponent,
    AssociateModalComponent,
    DeleteRadioModalComponent,
    AlphabeticalOrderPipe
  ],
  entryComponents: [
    RadioModalComponent,
    ReplyModalComponent,
    FilterModalComponent,
    DeleteRadioPropertyModalComponent,
    ConfirmModalComponent,
    AssociateModalComponent,
    DeleteRadioModalComponent
  ],
  providers: [RadioService, { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }]
})
export class RadioModule {}
