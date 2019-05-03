
import { ArchitectureRoutingComponent } from './containers/architecture-routing.component';
import { ArchitectureComponent } from './containers/architecture.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const architectureRoutes: Routes = [
  {
    path: '',
    component: ArchitectureRoutingComponent,
    children: [
      {
        path: '',
        component: ArchitectureComponent
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(architectureRoutes)],
  exports: [RouterModule]
})
export class ArchitectureRoutingModule {}
