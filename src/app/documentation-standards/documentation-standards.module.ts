import { DocumentationStandardsComponent } from './containers/documentation-standards.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationStandardsRoutingComponent } from './containers/documentation-standards-routing.component';
import { DocumentationStandardsRoutingModule } from './documentation-standards-routing.module';
import { CoreModule } from '@app/core/core.module';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatSortModule 
} from '@angular/material';
import { DocumentationStandardsTableComponent } from './components/documentation-standards-table/documentation-standards-table.component';
import { DocumentationStandardsDetailComponent } from './components/documentation-standards-detail/documentation-standards-detail.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DocumentationStandardEffects } from './store/effects/documentation-standards.effects';
import { reducer } from '../documentation-standards/store/reducers/documentation-standards.reducer';
import { DocumentationStandardsService } from './services/dcoumentation-standards.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
    StoreModule.forFeature('documentationStandardFeature', reducer),
    EffectsModule.forFeature([ DocumentationStandardEffects ])
  ],
  exports: [],
  declarations: [
    DocumentationStandardsComponent, 
    DocumentationStandardsRoutingComponent,
    DocumentationStandardsTableComponent,
    DocumentationStandardsDetailComponent
  ],
  providers: [
    DocumentationStandardsService
  ],
})
export class DocumentationStandardsModule { }