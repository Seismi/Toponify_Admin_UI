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
  MatNativeDateModule
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
import { RadioPropertiesTabComponent } from './components/properties-tab/properties-tab.component';
import { SettingsModule } from '@app/settings/settings.module';
import { RadioHeaderComponent } from './components/radio-header/radio-header.component';
import { RadioRightSideComponent } from './components/right-side/right-side.component';
import { FilterModalComponent } from './containers/filter-modal/filter-modal.component';
import { FilterRadioFormComponent } from './components/filter-radio-form/filter-radio-form.component';
import { DocumentationStandardsModule } from '@app/documentation-standards/documentation-standards.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { DeleteRadioPropertyModalComponent } from './containers/delete-property-modal/delete-property-modal.component';
import { RelatesToTableComponent } from './components/relates-to-table/relates-to-table.component';

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
    StoreModule.forFeature('radioFeature', reducer),
    EffectsModule.forFeature([RadioEffects])
  ],
  exports: [
    RadioTableComponent,
    RadioDetailsComponent,
    RadioPropertiesTabComponent,
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
    RadioPropertiesTabComponent,
    RadioHeaderComponent,
    RadioRightSideComponent,
    FilterModalComponent,
    FilterRadioFormComponent,
    DeleteRadioPropertyModalComponent,
    RelatesToTableComponent
  ],
  entryComponents: [RadioModalComponent, ReplyModalComponent, FilterModalComponent, DeleteRadioPropertyModalComponent],
  providers: [RadioService, { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }]
})
export class RadioModule {}
