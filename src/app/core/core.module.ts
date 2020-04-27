import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatIconModule, MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ErrorInterceptor } from '@app/core/interceptors/error.interceptor';
import { CoreLayoutModule } from '@app/core/layout/core-layout.module';
import { RouteEffects } from '@app/core/store/effects/route.effects';
import { SearchPipe } from '@app/pipes/search.pipe';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../core/store/reducers/search.reducer';
import { NotificationPaneComponent } from './components/notification-pane/notification-pane.component';
import { ByRoleDirective } from './directives/by-role.directive';
import { CanEditDirective } from './directives/can-edit.directive';
import { AuthLayoutComponent } from './layout/app-layouts/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layouts/main-layout.component';
import { DeleteModalComponent } from './layout/components/delete-modal/delete-modal.component';
import { DownloadCSVModalComponent } from './layout/components/download-csv-modal/download-csv-modal.component';
import { EditDocumentationStandardsTableComponent } from './layout/components/edit-documentation-standards/edit-documentation-standards.component';
import { EditDocumentationStandardsFormComponent } from './layout/components/edit-documentation-standards/form/form.component';
import { RelatedRadioTableComponent } from './layout/components/related-radio-table/related-radio-table.component';
import { RelatedWorkPackageTableComponent } from './layout/components/related-work-package-table/related-work-package-table.component';
import { RightHandSideComponent } from './layout/components/right-hand-side/right-hand-side.component';
import { SelectModalComponent } from './layout/components/select-modal/select-modal.component';
import { BaseHeaderComponent } from './layout/header/base-header.component';
import { BreadcrumbComponent } from './layout/header/breadcrumb/breadcrumb.component';
import { NodeNameComponent } from './layout/header/node-name/node-name.component';
import { QuicklinksActionsComponent } from './layout/header/quicklinks-actions/quicklinks-actions.component';
import { ScopesDropdownComponent } from './layout/header/quicklinks-actions/scopes-dropdown/scopes-dropdown.component';
import { SearchComponent } from './layout/header/search/search.component';
import { ToolbarColumnComponent } from './layout/header/toolbar-column/toolbar-column.component';
import { ToolbarSplitterComponent } from './layout/header/toolbar-splitter/toolbar-splitter.component';
import { WorkPackageNameComponent } from './layout/header/workpackage-name/workpackage-name.component';
import { ZoomActionsComponent } from './layout/header/zoom-actions/zoom-actions.component';
import { LeftHandPaneContentComponent } from './layout/left-hand-pane-content/left-hand-pane-content.component';
import { LeftHandPaneComponent } from './layout/left-hand-pane/left-hand-pane.component';
import { MenuComponent } from './layout/menu/menu.component';
import { ModelContainerComponent } from './layout/model-container/model-container.component';
import { ModelContentComponent } from './layout/model-content/model-content.component';
import { ModelSidebarComponent } from './layout/model-sidebar/model-sidebar.component';
import { RightSideBarComponent } from './layout/right-sidebar/right-sidebar.component';
import { NotificationService } from './services/notification.service';
import { SearchService } from './services/search.service';
import { NotificationEffects } from './store/effects/notification.effects';
import { SearchEffects } from './store/effects/search.effects';

@NgModule({
  imports: [
    RouterModule,
    MatSidenavModule,
    CoreLayoutModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    StoreModule.forFeature('searchFeature', reducer),
    EffectsModule.forFeature([SearchEffects, RouteEffects, NotificationEffects])
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
    NotificationPaneComponent,
    RelatedWorkPackageTableComponent,
    ByRoleDirective,
    CanEditDirective,
    SearchPipe
  ],
  entryComponents: [DeleteModalComponent, SelectModalComponent],
  providers: [
    SearchService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  declarations: [NotificationPaneComponent, ByRoleDirective, CanEditDirective, SearchPipe]
})
export class CoreModule {}
