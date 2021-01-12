import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstancesComponent } from './containers/instances.component';

export const instancesRoutes: Routes = [
  {
    path: '',
    component: InstancesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(instancesRoutes)],
  exports: [RouterModule]
})
export class InstancesRoutingModule {}
