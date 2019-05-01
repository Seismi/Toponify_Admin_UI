import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkpackageRoutingComponent } from './containers/workpackage-routing.component';
import { WorkpackageComponent } from './containers/workpackage.component';

export const workpackageRoutes: Routes = [
  {
    path: '',
    component: WorkpackageRoutingComponent,
    children: [
      {
        path: '',
        component: WorkpackageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(workpackageRoutes)],
  exports: [RouterModule]
})
export class WorkpackageRoutingModule {}