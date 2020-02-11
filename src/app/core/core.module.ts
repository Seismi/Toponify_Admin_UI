import { NgModule } from '@angular/core';
import { MainLayoutComponent } from './layout/app-layouts/main-layout.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/app-layouts/auth-layout.component';
import { BaseHeaderComponent } from './layout/header/base-header.component';
import { ZoomActionsComponent } from './layout/header/zoom-actions/zoom-actions.component';
import { LayoutActionsComponent } from './layout/header/layout-actions/layout-actions.component';
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
import { LayoutsDropdownComponent } from './layout/header/quicklinks-actions/layouts-dropdown/layouts-dropdown.component';
import { RightSideBarComponent } from './layout/right-sidebar/right-sidebar.component';
import { LeftSideBarComponent } from './layout/left-sidebar/left-sidebar.component';
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

@NgModule({
  imports: [
    RouterModule,
    CoreLayoutModule,
    CommonModule,
    StoreModule.forFeature('searchFeature', reducer),
    EffectsModule.forFeature([SearchEffects, RouteEffects])
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
  entryComponents: [
    DeleteModalComponent,
    SelectModalComponent
  ],
  providers: [
    SearchService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
