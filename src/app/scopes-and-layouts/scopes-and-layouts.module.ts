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
  MatIconModule
} from '@angular/material';
import { ScopesAndLayoutsTableComponent } from './components/scopes-and-layouts-table/scopes-and-layouts-table.component';
import { ScopeModule } from '@app/scope/scope.module';
import { LayoutModule } from '@app/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScopeAndLayoutModalComponent } from './containers/scope-and-layout-modal/scope-and-layout-modal.component';
import { SettingsModule } from '@app/settings/settings.module';
import { DeleteScopesAndLayoutsModalComponent } from './containers/delete-modal/delete-scopes-and-layouts.component';
import { ScopesAndLayoutsDetailComponent } from './components/scopes-and-layouts-detail/scopes-and-layouts-detail.component';
import { ScopeDetailsComponent } from './containers/scope-details/scope-details.component';
import { LayoutDetailsComponent } from './containers/layout-details/layout-details.component';

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
    SettingsModule
  ],
  exports: [],
  declarations: [
    ScopesAndLayoutsComponent,
    ScopesAndLayoutsRoutingComponent,
    ScopesAndLayoutsTableComponent,
    ScopesAndLayoutsDetailComponent,
    ScopeAndLayoutModalComponent,
    DeleteScopesAndLayoutsModalComponent,
    ScopeDetailsComponent,
    LayoutDetailsComponent
  ],
  providers: [],
  entryComponents: [
    ScopeAndLayoutModalComponent, 
    DeleteScopesAndLayoutsModalComponent
  ]
})
export class ScopesAndLayoutsModule {}
