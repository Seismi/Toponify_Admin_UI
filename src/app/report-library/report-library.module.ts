import { ReportLibraryComponent } from './containers/report-library.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReportLibraryRoutingModule } from './report-library-routing.module';
import { CoreModule } from '@app/core/core.module';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatSelectModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatTooltipModule
} from '@angular/material';
import { ReportLibraryTableComponent } from './components/report-library-table/report-library-table.component';
import { ReportLibraryDetailComponent } from './components/report-library-detail/report-library-detail.component';
import { AttributesTableInReportsPageComponent } from './components/attributes-table/attributes-table.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './store/reducers/report.reducer';
import { ReportEffects } from './store/effects/report.effects';
import { ReportService } from './services/report.service';
import { ArchitectureModule } from '@app/architecture/architecture.module';
import { ReportLibraryDetailsComponent } from './containers/report-library-details/report-library-details.component';
import { ReportDataSetTableComponent } from './components/data-set-table/data-set-table.component';
import { ReportOwnersTableComponent } from './components/owners-table/owners-table.component';
import { ReportDimensionsTableComponent } from './components/dimensions-table/dimensions-table.component';
import { ReportReportingConceptsTableComponent } from './components/reporting-concepts-table/reporting-concepts-table.component';
import { RadioTableInReportsPageComponent } from './components/radio-table/radio-table.component';
import { WorkPackageTableInReportsPageComponent } from './components/workpackage-table/workpackage-table.component';
import { ReportModalComponent } from './containers/report-modal/report-modal.component';
import { ReportDeleteModalComponent } from './containers/report-delete-modal/report-delete-modal.component';
import { TableHeaderComponent } from '@app/report-library/components/table-header/table-header.component';
import { ReportRightSideComponent } from './components/right-side/right-side.component';
import { SelectModalComponent } from '@app/report-library/components/select-modal/select-modal.component';
import { ReportingConceptFilterModalComponent } from '@app/report-library/components/reporting-concept-filter-modal/reporting-concept-filter-modal.component';

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
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTooltipModule,
    StoreModule.forFeature('reportLibraryFeature', reducer),
    EffectsModule.forFeature([ReportEffects])
  ],
  exports: [SelectModalComponent],
  declarations: [
    ReportLibraryComponent,
    ReportLibraryTableComponent,
    ReportLibraryDetailComponent,
    AttributesTableInReportsPageComponent,
    ReportLibraryDetailsComponent,
    ReportDataSetTableComponent,
    ReportOwnersTableComponent,
    ReportDimensionsTableComponent,
    ReportReportingConceptsTableComponent,
    RadioTableInReportsPageComponent,
    WorkPackageTableInReportsPageComponent,
    ReportModalComponent,
    ReportDeleteModalComponent,
    TableHeaderComponent,
    ReportRightSideComponent,
    SelectModalComponent,
    ReportingConceptFilterModalComponent
  ],
  entryComponents: [
    ReportModalComponent,
    ReportDeleteModalComponent,
    SelectModalComponent,
    ReportingConceptFilterModalComponent
  ],
  providers: [ReportService]
})
export class ReportLibraryModule { }
