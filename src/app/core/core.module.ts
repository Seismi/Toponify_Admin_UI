import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './layout/app-layouts/main-layout.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/app-layouts/auth-layout.component';
import { BaseHeaderComponent } from './layout/header/base-header.component';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatSliderModule,
  MatListModule,
  MatCardModule,
  MatTooltipModule
} from '@angular/material';
import { ZoomActionsComponent } from './layout/header/zoom-actions/zoom-actions.component';
import { LayoutActionsComponent } from './layout/header/layout-actions/layout-actions.component';
import { SearchComponent } from './layout/header/search/search.component';
import { LogoComponent } from './layout/header/logo/logo.component';
import { MenuComponent } from './layout/header/menu/menu.component';
import { ToolbarColumnComponent } from './layout/header/toolbar-column/toolbar-column.component';
import { CommonModule } from '@angular/common';
import { ToolbarSplitterComponent } from './layout/header/toolbar-splitter/toolbar-splitter.component';
import { ModelContainerComponent } from './layout/model-container/model-container.component';
import { ModelSidebarComponent } from './layout/model-sidebar/model-sidebar.component';
import { ModelContentComponent } from './layout/model-content/model-content.component';
import { DraggerComponent } from './layout/model-sidebar/dragger/dragger.component';

import { MdePopoverModule } from '@material-extended/mde';
import { ZoomPopoverComponent } from './layout/header/zoom-actions/zoom-dropdown/zoom-popover.component';
import { ZoomSliderComponent } from './layout/header/zoom-actions/zoom-dropdown/zoom-slider/zoom-slider.component';
import { ZoomSliderListComponent } from './layout/header/zoom-actions/zoom-dropdown/zoom-slider-list/zoom-slider-list.component';
import { QuicklinksActionsComponent } from './layout/header/quicklinks-actions/quicklinks-actions.component';

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
    MdePopoverModule
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
    QuicklinksActionsComponent
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
    ZoomPopoverComponent,
    ZoomSliderComponent,
    ZoomSliderListComponent,
    QuicklinksActionsComponent
  ],
  providers: []
})
export class CoreModule {}
