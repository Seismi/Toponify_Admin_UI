import { ReportLibraryComponent } from './containers/report-library.component';
import { NgModule } from '@angular/core';
import { ReportLibraryRoutingComponent } from './containers/report-library-routing.component';
import { ReportLibraryRoutingModule } from './report-library-routing.module';
import { CoreModule } from '@app/core/core.module';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule 
} from '@angular/material';
import { ReportLibraryTableComponent } from './components/report-library-table/report-library-table.component';
import { ReportLibraryDetailComponent } from './components/report-library-detail/report-library-detail.component';
import { AttrAndRulesTableComponent } from './components/attr-and-rules-table/attr-and-rules-table.component';
import { ReportLibraryActionsComponent } from './components/report-library-actions/report-library-actions.component';


@NgModule({
  imports: [
    CoreModule,
    ReportLibraryRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  exports: [],
  declarations: [
    ReportLibraryComponent, 
    ReportLibraryRoutingComponent,
    ReportLibraryTableComponent,
    ReportLibraryDetailComponent,
    AttrAndRulesTableComponent,
    ReportLibraryActionsComponent
  ],
  providers: [],
})
export class ReportLibraryModule { }