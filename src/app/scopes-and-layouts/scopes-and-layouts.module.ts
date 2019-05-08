import { ScopesAndLayoutsComponent } from './containers/scopes-and-layouts.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScopesAndLayoutsRoutingComponent } from './containers/scopes-and-layouts-routing.component';
import { ScopesAndLayoutsRoutingModule } from './scopes-and-layouts-routing.module';
import { CoreModule } from '@app/core/core.module';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatSortModule,
  MatCheckboxModule
} from '@angular/material';
import { ScopesTableComponent } from './components/scopes-table/scopes-table.component';
import { LayoutsTableComponent } from './components/layouts-table/layouts-table.component';
import { LayoutsDetailComponent } from './components/layouts-detail/layouts-detail.component';
import { ScopesDetailComponent } from './components/scopes-detail/scopes-detail.component';


@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    ScopesAndLayoutsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatCheckboxModule
  ],
  exports: [],
  declarations: [
      ScopesAndLayoutsComponent, 
      ScopesAndLayoutsRoutingComponent,
      ScopesTableComponent,
      LayoutsTableComponent,
      LayoutsDetailComponent,
      ScopesDetailComponent
    ],
  providers: [],
})
export class ScopesAndLayoutsModule { }