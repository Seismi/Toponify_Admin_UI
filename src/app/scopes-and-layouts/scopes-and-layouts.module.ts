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
import { ScopeDetailsComponent } from './containers/scope-details/scope-details.component';
import { LayoutDetailsComponent } from './containers/layout-details/layout-details.component';
import { ScopeModule } from '@app/scope/scope.module';


@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    ScopesAndLayoutsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatCheckboxModule,
    ScopeModule
  ],
  exports: [],
  declarations: [
      ScopesAndLayoutsComponent, 
      ScopesAndLayoutsRoutingComponent,
      ScopesTableComponent,
      LayoutsTableComponent,
      LayoutsDetailComponent,
      ScopesDetailComponent,
      ScopeDetailsComponent,
      LayoutDetailsComponent
    ],
  providers: [],
})
export class ScopesAndLayoutsModule { }