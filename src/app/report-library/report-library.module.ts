import { ReportLibraryComponent } from './containers/report-library.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReportLibraryRoutingComponent } from './containers/report-library-routing.component';
import { ReportLibraryRoutingModule } from './report-library-routing.module';
import { CoreModule } from '@app/core/core.module';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatSortModule, 
  MatInputModule,
  MatTabsModule,
  MatFormFieldModule,
  MatIconModule
} from '@angular/material';
import { ReportLibraryTableComponent } from './components/report-library-table/report-library-table.component';
import { ReportLibraryDetailComponent } from './components/report-library-detail/report-library-detail.component';
import { AttrAndRulesTableComponent } from './components/attr-and-rules-table/attr-and-rules-table.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './store/reducers/report.reducer'
import { ReportEffects } from './store/effects/report.effects';
import { ReportService } from './services/report.service';
import { ArchitectureModule } from '@app/architecture/architecture.module';
import { ReportLibraryDetailsComponent } from './containers/report-library-details/report-library-details.component';
import { ReportDataSetTableComponent } from './components/data-set-table/data-set-table.component';
import { ReportOwnersTableComponent } from './components/owners-table/owners-table.component';
import { ReportDimensionsTableComponent } from './components/dimensions-table/dimensions-table.component';
import { ReportReportingConceptsTableComponent } from './components/reporting-concepts-table/reporting-concepts-table.component';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportLibraryRoutingModule,
    ArchitectureModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    StoreModule.forFeature('reportLibraryFeature', reducer),
    EffectsModule.forFeature([ReportEffects])
  ],
  exports: [],
  declarations: [
    ReportLibraryComponent, 
    ReportLibraryRoutingComponent,
    ReportLibraryTableComponent,
    ReportLibraryDetailComponent,
    AttrAndRulesTableComponent,
    ReportLibraryDetailsComponent,
    ReportDataSetTableComponent,
    ReportOwnersTableComponent,
    ReportDimensionsTableComponent,
    ReportReportingConceptsTableComponent
  ],
  providers: [ReportService],
})
export class ReportLibraryModule { }