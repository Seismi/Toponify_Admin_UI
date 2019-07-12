import { ReportLibraryComponent } from './containers/report-library.component';
import { NgModule } from '@angular/core';
import { ReportLibraryRoutingComponent } from './containers/report-library-routing.component';
import { ReportLibraryRoutingModule } from './report-library-routing.module';
import { CoreModule } from '@app/core/core.module';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatSortModule, 
  MatTabsModule
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

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    ReportLibraryRoutingModule,
    ArchitectureModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatTabsModule,
    StoreModule.forFeature('reportLibraryFeature', reducer),
    EffectsModule.forFeature([ReportEffects])
  ],
  exports: [],
  declarations: [
    ReportLibraryComponent, 
    ReportLibraryRoutingComponent,
    ReportLibraryTableComponent,
    ReportLibraryDetailComponent,
    AttrAndRulesTableComponent
  ],
  providers: [ReportService],
})
export class ReportLibraryModule { }