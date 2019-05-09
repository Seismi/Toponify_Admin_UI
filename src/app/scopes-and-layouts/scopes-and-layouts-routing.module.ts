import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScopesAndLayoutsRoutingComponent } from './containers/scopes-and-layouts-routing.component';
import { ScopesAndLayoutsComponent } from './containers/scopes-and-layouts.component';

export const scopesAndLayoutsRoutes: Routes = [
  {
    path: '',
    component: ScopesAndLayoutsRoutingComponent,
    children: [
      {
        path: '',
        component: ScopesAndLayoutsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(scopesAndLayoutsRoutes)],
  exports: [RouterModule]
})
export class ScopesAndLayoutsRoutingModule {}