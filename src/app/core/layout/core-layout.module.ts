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
  MatCheckboxModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatBadgeModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { MdePopoverModule } from '@material-extended/mde';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from '@app/core/layout/app-layouts/main-layout.component';
import { AuthLayoutComponent } from '@app/core/layout/app-layouts/auth-layout.component';
import { BaseHeaderComponent } from '@app/core/layout/header/base-header.component';
import { SearchComponent } from '@app/core/layout/header/search/search.component';
import { ToolbarSplitterComponent } from '@app/core/layout/header/toolbar-splitter/toolbar-splitter.component';
import { ZoomActionsComponent } from '@app/core/layout/header/zoom-actions/zoom-actions.component';
import { ModelContainerComponent } from '@app/core/layout/model-container/model-container.component';
import { ModelSidebarComponent } from '@app/core/layout/model-sidebar/model-sidebar.component';
import { ModelContentComponent } from '@app/core/layout/model-content/model-content.component';
import { ToolbarColumnComponent } from '@app/core/layout/header/toolbar-column/toolbar-column.component';
import { QuicklinksActionsComponent } from '@app/core/layout/header/quicklinks-actions/quicklinks-actions.component';
import { BreadcrumbComponent } from '@app/core/layout/header/breadcrumb/breadcrumb.component';
import { NodeNameComponent } from '@app/core/layout/header/node-name/node-name.component';
import { RightSideBarComponent } from '@app/core/layout/right-sidebar/right-sidebar.component';
import { ScopesDropdownComponent } from '@app/core/layout/header/quicklinks-actions/scopes-dropdown/scopes-dropdown.component';
import { MenuComponent } from '@app/core/layout/menu/menu.component';
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
import { ReportService } from '@app/report-library/services/report.service';
import { LeftHandPaneComponent } from './left-hand-pane/left-hand-pane.component';
import { LeftHandPaneContentComponent } from './left-hand-pane-content/left-hand-pane-content.component';
import { LoaderComponent } from '@app/core/layout/model-sidebar/loader/loader.component';
import { RelatedRadioTableComponent } from './components/related-radio-table/related-radio-table.component';
import { NotificationIndicatorComponent } from '../components/notification-indicator/notification-indicator.component';
import { RelatedWorkPackageTableComponent } from './components/related-work-package-table/related-work-package-table.component';
import { AppDrawerComponent } from './app-drawer/app-drawer.component';
import { NotificationPaneComponent } from '../components/notification-pane/notification-pane.component';
import { SearchPipe } from '@app/pipes/search.pipe';

@NgModule({
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
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
    MatCheckboxModule,
    MatSidenavModule,
    MatBadgeModule
  ],
  exports: [
    MainLayoutComponent,
    AuthLayoutComponent,
    BaseHeaderComponent,
    ToolbarColumnComponent,
    ToolbarSplitterComponent,
    SearchComponent,
    ZoomActionsComponent,
    ModelContainerComponent,
    ModelSidebarComponent,
    ModelContentComponent,
    QuicklinksActionsComponent,
    BreadcrumbComponent,
    ScopesDropdownComponent,
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
    SelectModalComponent,
    LeftHandPaneComponent,
    MenuComponent,
    LeftHandPaneContentComponent,
    RelatedRadioTableComponent,
    NotificationIndicatorComponent,
    RelatedWorkPackageTableComponent,
    AppDrawerComponent,
    NotificationPaneComponent,
    SearchPipe
  ],
  declarations: [
    NotificationIndicatorComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    BaseHeaderComponent,
    ZoomActionsComponent,
    MenuComponent,
    SearchComponent,
    LogoComponent,
    ToolbarColumnComponent,
    ToolbarSplitterComponent,
    ModelContainerComponent,
    ModelSidebarComponent,
    ModelContentComponent,
    DraggerComponent,
    LoaderComponent,
    QuicklinksActionsComponent,
    BreadcrumbComponent,
    ScopesDropdownComponent,
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
    SelectModalComponent,
    LeftHandPaneComponent,
    LeftHandPaneContentComponent,
    RelatedRadioTableComponent,
    RelatedWorkPackageTableComponent,
    AppDrawerComponent,
    NotificationPaneComponent,
    SearchPipe
  ],
  entryComponents: [DeleteModalComponent, SelectModalComponent, DownloadCSVModalComponent, SelectModalComponent],
  providers: [ReportService]
})
export class CoreLayoutModule {}
