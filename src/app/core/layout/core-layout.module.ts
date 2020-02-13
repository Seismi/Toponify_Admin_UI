import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSliderModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTableModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatCheckboxModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { MdePopoverModule } from '@material-extended/mde';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from '@app/core/layout/app-layouts/main-layout.component';
import { AuthLayoutComponent } from '@app/core/layout/app-layouts/auth-layout.component';
import { BaseHeaderComponent } from '@app/core/layout/header/base-header.component';
import { SearchComponent } from '@app/core/layout/header/search/search.component';
import { ToolbarSplitterComponent } from '@app/core/layout/header/toolbar-splitter/toolbar-splitter.component';
import { LayoutActionsComponent } from '@app/core/layout/header/layout-actions/layout-actions.component';
import { ZoomActionsComponent } from '@app/core/layout/header/zoom-actions/zoom-actions.component';
import { ModelContainerComponent } from '@app/core/layout/model-container/model-container.component';
import { ModelSidebarComponent } from '@app/core/layout/model-sidebar/model-sidebar.component';
import { ModelContentComponent } from '@app/core/layout/model-content/model-content.component';
import { ToolbarColumnComponent } from '@app/core/layout/header/toolbar-column/toolbar-column.component';
import { QuicklinksActionsComponent } from '@app/core/layout/header/quicklinks-actions/quicklinks-actions.component';
import { BreadcrumbComponent } from '@app/core/layout/header/breadcrumb/breadcrumb.component';
import { LeftSideBarComponent } from '@app/core/layout/left-sidebar/left-sidebar.component';
import { LayoutsDropdownComponent } from '@app/core/layout/header/quicklinks-actions/layouts-dropdown/layouts-dropdown.component';
import { NodeNameComponent } from '@app/core/layout/header/node-name/node-name.component';
import { RightSideBarComponent } from '@app/core/layout/right-sidebar/right-sidebar.component';
import { ScopesDropdownComponent } from '@app/core/layout/header/quicklinks-actions/scopes-dropdown/scopes-dropdown.component';
import { MenuComponent } from '@app/core/layout/header/menu/menu.component';
import { LogoComponent } from '@app/core/layout/header/logo/logo.component';
import { DraggerComponent } from '@app/core/layout/model-sidebar/dragger/dragger.component';
import { RouterModule } from '@angular/router';
import { WorkPackageNameComponent } from './header/workpackage-name/workpackage-name.component';
import { EditDocumentationStandardsTableComponent } from './components/edit-documentation-standards/edit-documentation-standards.component';
import { EditDocumentationStandardsFormComponent } from './components/edit-documentation-standards/form/form.component';
import { RightHandSideComponent } from './components/right-hand-side/right-hand-side.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { SelectModalComponent } from './components/select-modal/select-modal.component';
import { DownloadCSVModalComponent } from './components/download-csv-modal/download-csv-modal.component';

@NgModule({
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSliderModule,
    MatListModule,
    MatCardModule,
    MatTooltipModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdePopoverModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  exports: [
    MainLayoutComponent,
    AuthLayoutComponent,
    BaseHeaderComponent,
    ToolbarColumnComponent,
    ToolbarSplitterComponent,
    SearchComponent,
    LayoutActionsComponent,
    ZoomActionsComponent,
    ModelContainerComponent,
    ModelSidebarComponent,
    ModelContentComponent,
    QuicklinksActionsComponent,
    BreadcrumbComponent,
    ScopesDropdownComponent,
    LayoutsDropdownComponent,
    RightSideBarComponent,
    LeftSideBarComponent,
    NodeNameComponent,
    WorkPackageNameComponent,
    EditDocumentationStandardsTableComponent,
    EditDocumentationStandardsFormComponent,
    DeleteModalComponent,
    SelectModalComponent,
    DownloadCSVModalComponent,
    RightHandSideComponent,
    DeleteModalComponent,
    SelectModalComponent
  ],
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent,
    BaseHeaderComponent,
    ZoomActionsComponent,
    LayoutActionsComponent,
    MenuComponent,
    SearchComponent,
    LogoComponent,
    ToolbarColumnComponent,
    ToolbarSplitterComponent,
    ModelContainerComponent,
    ModelSidebarComponent,
    ModelContentComponent,
    DraggerComponent,
    QuicklinksActionsComponent,
    BreadcrumbComponent,
    ScopesDropdownComponent,
    LayoutsDropdownComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
    NodeNameComponent,
    WorkPackageNameComponent,
    EditDocumentationStandardsTableComponent,
    EditDocumentationStandardsFormComponent,
    DeleteModalComponent,
    SelectModalComponent,
    DownloadCSVModalComponent,
    RightHandSideComponent,
    DeleteModalComponent,
    SelectModalComponent
  ],
  entryComponents: [
    DeleteModalComponent,
    SelectModalComponent,
    DownloadCSVModalComponent,
    SelectModalComponent
  ]
})
export class CoreLayoutModule {}
