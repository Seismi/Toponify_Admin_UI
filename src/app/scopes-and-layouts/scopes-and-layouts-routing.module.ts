import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScopesAndLayoutsRoutingComponent } from './containers/scopes-and-layouts-routing.component';
import { ScopesAndLayoutsComponent } from './containers/scopes-and-layouts.component';
import { ScopeDetailsComponent } from './containers/scope-details/scope-details.component';
import { LayoutDetailsComponent } from './containers/layout-details/layout-details.component';

export const scopesAndLayoutsRoutes: Routes = [
  {
    path: '',
    component: ScopesAndLayoutsRoutingComponent,
    children: [
      {
        path: '',
        component: ScopesAndLayoutsComponent,
        children: [
          {
            path: ':scopeId',
            component: ScopeDetailsComponent,
            children: [
              {
                path: ':layoutId',
                component: LayoutDetailsComponent
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(scopesAndLayoutsRoutes)],
  exports: [RouterModule]
})
export class ScopesAndLayoutsRoutingModule {}
