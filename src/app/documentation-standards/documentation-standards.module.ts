import { DocumentationStandardsComponent } from './containers/documentation-standards.component';
import { NgModule } from '@angular/core';
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
import { DocumentationStandardsActionsComponent } from './components/documentation-standards-actions/documentation-standards-actions.component';


@NgModule({
  imports: [
    CoreModule,
    DocumentationStandardsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule
  ],
  exports: [],
  declarations: [
    DocumentationStandardsComponent, 
    DocumentationStandardsRoutingComponent,
    DocumentationStandardsTableComponent,
    DocumentationStandardsDetailComponent,
    DocumentationStandardsActionsComponent
  ],
  providers: [],
})
export class DocumentationStandardsModule { }