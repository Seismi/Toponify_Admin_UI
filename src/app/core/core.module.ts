import { NgModule } from '@angular/core';
import { MainLayoutComponent } from './layout/app-layouts/main-layout.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/app-layouts/auth-layout.component';
import { BaseHeaderComponent } from './layout/header/base-header.component';
import { ZoomActionsComponent } from './layout/header/zoom-actions/zoom-actions.component';
import { SearchComponent } from './layout/header/search/search.component';
import { ToolbarColumnComponent } from './layout/header/toolbar-column/toolbar-column.component';
import { CommonModule } from '@angular/common';
import { ToolbarSplitterComponent } from './layout/header/toolbar-splitter/toolbar-splitter.component';
import { ModelContainerComponent } from './layout/model-container/model-container.component';
import { ModelSidebarComponent } from './layout/model-sidebar/model-sidebar.component';
import { ModelContentComponent } from './layout/model-content/model-content.component';
import { QuicklinksActionsComponent } from './layout/header/quicklinks-actions/quicklinks-actions.component';
import { BreadcrumbComponent } from './layout/header/breadcrumb/breadcrumb.component';
import { ScopesDropdownComponent } from './layout/header/quicklinks-actions/scopes-dropdown/scopes-dropdown.component';
import { RightSideBarComponent } from './layout/right-sidebar/right-sidebar.component';
import { SearchService } from './services/search.service';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../core/store/reducers/search.reducer';
import { SearchEffects } from './store/effects/search.effects';
import { EffectsModule } from '@ngrx/effects';
import { NodeNameComponent } from './layout/header/node-name/node-name.component';
import { RouteEffects } from '@app/core/store/effects/route.effects';
import { CoreLayoutModule } from '@app/core/layout/core-layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from '@app/core/interceptors/error.interceptor';
import { WorkPackageNameComponent } from './layout/header/workpackage-name/workpackage-name.component';
import { EditDocumentationStandardsFormComponent } from './layout/components/edit-documentation-standards/form/form.component';
import { EditDocumentationStandardsTableComponent } from './layout/components/edit-documentation-standards/edit-documentation-standards.component';
import { RightHandSideComponent } from './layout/components/right-hand-side/right-hand-side.component';
import { DeleteModalComponent } from './layout/components/delete-modal/delete-modal.component';
import { SelectModalComponent } from './layout/components/select-modal/select-modal.component';
import { DownloadCSVModalComponent } from './layout/components/download-csv-modal/download-csv-modal.component';
import { LeftHandPaneComponent } from './layout/left-hand-pane/left-hand-pane.component';
import { MenuComponent } from './layout/menu/menu.component';
import { LeftHandPaneContentComponent } from './layout/left-hand-pane-content/left-hand-pane-content.component';
import { RelatedRadioTableComponent } from './layout/components/related-radio-table/related-radio-table.component';
import { NotificationService } from './services/notification.service';
import { NotificationEffects } from './store/effects/notification.effects';
import { NotificationPaneComponent } from './components/notification-pane/notification-pane.component';
import { MatSidenavModule } from '@angular/material';
import { RelatedWorkPackageTableComponent } from './layout/components/related-work-package-table/related-work-package-table.component';

@NgModule({
  imports: [
    RouterModule,
    MatSidenavModule,
    CoreLayoutModule,
    CommonModule,
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
    RelatedWorkPackageTableComponent
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
  declarations: [NotificationPaneComponent]
})
export class CoreModule {}
