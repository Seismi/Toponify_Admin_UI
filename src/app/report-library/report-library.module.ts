import { ReportLibraryComponent } from './containers/report-library.component';
import { NgModule } from '@angular/core';
import { ReportLibraryRoutingComponent } from './containers/report-library-routing.component';
import { ReportLibraryRoutingModule } from './report-library-routing.module';
import { CoreModule } from '@app/core/core.module';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatSortModule 
} from '@angular/material';
import { ReportLibraryTableComponent } from './components/report-library-table/report-library-table.component';
import { ReportLibraryDetailComponent } from './components/report-library-detail/report-library-detail.component';
import { AttrAndRulesTableComponent } from './components/attr-and-rules-table/attr-and-rules-table.component';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    ReportLibraryRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule
  ],
  exports: [],
  declarations: [
    ReportLibraryComponent, 
    ReportLibraryRoutingComponent,
    ReportLibraryTableComponent,
    ReportLibraryDetailComponent,
    AttrAndRulesTableComponent
  ],
  providers: [],
})
export class ReportLibraryModule { }