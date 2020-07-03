import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { AttributesRoutingModule } from './attributes-router.module';
import { AttributesComponent } from './containers/attributes/attributes.component';
import { AttributesRoutingComponent } from './containers/attributes-router.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTooltipModule,
  MatSidenavModule
} from '@angular/material';
import { AttributeService } from './services/attributes.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AttributeEffects } from './store/effects/attributes.effects';
import { reducer } from './store/reducers/attributes.reducer';
import { ArchitectureModule } from '@app/architecture/architecture.module';
import { AttributeModalComponent } from './containers/attribute-modal/attribute-modal.component';
import { AttributeDetailsComponent } from './containers/attribute-details/attribute-details.component';
import { AttributeDetailsFormComponent } from './components/attribute-details-form/attribute-details-form.component';
import { TagListModule } from '@app/architecture/components/tag-list/tag-list.module';
import { TagModule } from '@app/architecture/components/tag-list/tag/tag.module';
import { RelatedAttributeTableComponent } from './components/related-attribute-table/related-attribute-table.component';

@NgModule({
  imports: [
    AttributesRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    ArchitectureModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatSidenavModule,
    TagListModule,
    TagModule,
    StoreModule.forFeature('attributesFeature', reducer),
    EffectsModule.forFeature([AttributeEffects])
  ],
  exports: [],
  declarations: [
    AttributesComponent,
    AttributesRoutingComponent,
    AttributeDetailsComponent,
    AttributesRoutingComponent,
    AttributeDetailsFormComponent,
    RelatedAttributeTableComponent
  ],
  entryComponents: [AttributeModalComponent],
  providers: [AttributeService]
})
export class AttributesModule {}
