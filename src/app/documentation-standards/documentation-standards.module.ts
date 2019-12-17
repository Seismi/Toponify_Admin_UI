import { DocumentationStandardsComponent } from './containers/documentation-standards/documentation-standards.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationStandardsRoutingModule } from './documentation-standards-routing.module';
import { CoreModule } from '@app/core/core.module';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTreeModule
} from '@angular/material';
import { DocumentationStandardsTableComponent } from './components/documentation-standards-table/documentation-standards-table.component';
import { DocumentationStandardsDetailComponent } from './components/documentation-standards-detail/documentation-standards-detail.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DocumentationStandardEffects } from './store/effects/documentation-standards.effects';
import { reducer } from '../documentation-standards/store/reducers/documentation-standards.reducer';
import { DocumentationStandardsService } from './services/dcoumentation-standards.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentationStandardsDetailsComponent } from './containers/documentation-standards-details/documentation-standards-details.component';
import { DocumentStandardsLevelsComponent } from './components/document-standards-levels/document-standards-levels.component';
import { DeleteDocumentModalComponent } from './containers/delete-document-modal/delete-document.component';
import { DocumentModalComponent } from './containers/document-modal/document-modal.component';
import { DocumentStandardsRightSideComponent } from './components/right-side/right-side.component';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentationStandardsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatListModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatExpansionModule,
    MatInputModule,
    MatDatepickerModule,
    StoreModule.forFeature('documentationStandardFeature', reducer),
    EffectsModule.forFeature([DocumentationStandardEffects])
  ],
  exports: [DocumentationStandardsTableComponent],
  declarations: [
    DocumentationStandardsComponent,
    DocumentationStandardsTableComponent,
    DocumentationStandardsDetailComponent,
    DocumentationStandardsDetailsComponent,
    DocumentStandardsLevelsComponent,
    DeleteDocumentModalComponent,
    DocumentModalComponent,
    DocumentStandardsRightSideComponent
  ],
  providers: [DocumentationStandardsService],
  entryComponents: [DeleteDocumentModalComponent, DocumentModalComponent, DocumentModalComponent]
})
export class DocumentationStandardsModule {}
