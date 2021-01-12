import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatSidenavModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { BaseHeaderComponent } from './components/header/base-header.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { LeftHandPaneComponent } from './components/left-hand-pane/left-hand-pane.component';
import { ModelContainerComponent } from './components/model-container/model-container.component';
import { AppDrawerComponent } from './components/app-drawer/app-drawer.component';
import { MenuComponent } from './components/menu/menu.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    MatSidenavModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatToolbarModule
  ],
  declarations: [
    LeftHandPaneComponent,
    ModelContainerComponent,
    BaseHeaderComponent,
    LogoComponent,
    AppDrawerComponent,
    MenuComponent
  ],
  exports: [
    LeftHandPaneComponent,
    ModelContainerComponent,
    BaseHeaderComponent,
    LogoComponent,
    AppDrawerComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
