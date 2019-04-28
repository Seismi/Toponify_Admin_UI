import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutingComponent } from './containers/home-routing.component';
import { HomeComponent } from './containers/home.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeRoutingComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
