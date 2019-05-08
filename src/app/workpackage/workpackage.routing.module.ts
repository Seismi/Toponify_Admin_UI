import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkPackageComponent } from './containers/workpackage/workpackage.component';

export const workPackageRoutes: Routes = [
  {
    path: '',
    component: WorkPackageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(workPackageRoutes)],
  exports: [RouterModule]
})
export class WorkPackageRoutingModule {}
