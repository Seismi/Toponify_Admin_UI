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
  MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatIconModule,
  MatSidenavModule,
  MatTabsModule
} from '@angular/material';
import { ScopesAndLayoutsTableComponent } from './components/scopes-and-layouts-table/scopes-and-layouts-table.component';
import { ScopeModule } from '@app/scope/scope.module';
import { LayoutModule } from '@app/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScopeAndLayoutModalComponent } from './containers/scope-and-layout-modal/scope-and-layout-modal.component';
import { SettingsModule } from '@app/settings/settings.module';
import { ScopesAndLayoutsDetailComponent } from './components/scopes-and-layouts-detail/scopes-and-layouts-detail.component';
import { ScopeDetailsComponent } from './containers/scope-details/scope-details.component';
import { LayoutDetailsComponent } from './containers/layout-details/layout-details.component';
import { ScopesAndLayoutsComponentsTableComponent } from './components/scopes-and-layouts-components-table/scopes-and-layouts-components-table.component';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScopesAndLayoutsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    ScopeModule,
    LayoutModule,
    SettingsModule,
    MatSidenavModule,
    MatTabsModule
  ],
  exports: [],
  declarations: [
    ScopesAndLayoutsComponent,
    ScopesAndLayoutsRoutingComponent,
    ScopesAndLayoutsTableComponent,
    ScopesAndLayoutsDetailComponent,
    ScopeAndLayoutModalComponent,
    ScopeDetailsComponent,
    LayoutDetailsComponent,
    ScopesAndLayoutsComponentsTableComponent
  ],
  providers: [],
  entryComponents: [ScopeAndLayoutModalComponent]
})
export class ScopesAndLayoutsModule {}
