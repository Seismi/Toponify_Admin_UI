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
import { ScopesTableComponent } from './components/scopes-table/scopes-table.component';
import { LayoutsTableComponent } from './components/layouts-table/layouts-table.component';
import { LayoutsDetailComponent } from './components/layouts-detail/layouts-detail.component';
import { ScopesDetailComponent } from './components/scopes-detail/scopes-detail.component';
import { ScopeDetailsComponent } from './containers/scope-details/scope-details.component';
import { LayoutDetailsComponent } from './containers/layout-details/layout-details.component';
import { ScopeModule } from '@app/scope/scope.module';
import { LayoutModule } from '@app/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScopeModalComponent } from './containers/scope-modal/scope-modal.component';
import { OwnersDropdownComponent } from './components/owners-dropdown/owners-dropdown.component';
import { SettingsModule } from '@app/settings/settings.module';
import { ViewersDropdownComponent } from './components/viewers-dropdown/viewers-dropdown.component';
import { DeleteScopesAndLayoutsModalComponent } from './containers/delete-modal/delete-scopes-and-layouts.component';
import { OwnersListComponent } from './components/owners-list/owners-list.component';
import { ViewersListComponent } from './components/viewers-list/viewers-list.component';
import { LayoutModalComponent } from './containers/layout-modal/layout-modal.component';

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
      ScopesTableComponent,
      LayoutsTableComponent,
      LayoutsDetailComponent,
      ScopesDetailComponent,
      ScopeDetailsComponent,
      LayoutDetailsComponent,
      ScopeModalComponent,
      OwnersDropdownComponent,
      ViewersDropdownComponent,
      DeleteScopesAndLayoutsModalComponent,
      OwnersListComponent,
      ViewersListComponent,
      LayoutModalComponent
    ],
  providers: [],
  entryComponents: [ ScopeModalComponent, DeleteScopesAndLayoutsModalComponent, LayoutModalComponent ]
})
export class ScopesAndLayoutsModule { }