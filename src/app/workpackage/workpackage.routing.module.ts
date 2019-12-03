import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkPackageComponent } from './containers/workpackage/workpackage.component';
import { WorkpackageDetailsComponent } from './containers/workpackage-details/workpackage-details.component';

export const workPackageRoutes: Routes = [
  {
    path: '',
    component: WorkPackageComponent,
    children: [
      {
        path: ':workpackageId',
        component: WorkpackageDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(workPackageRoutes)],
  exports: [RouterModule]
})
export class WorkPackageRoutingModule {}
