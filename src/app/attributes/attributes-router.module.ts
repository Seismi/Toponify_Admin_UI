import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributesComponent } from './containers/attributes.component';
import { AttributesRoutingComponent } from './containers/attributes-router.component';

export const attributesRoutes: Routes = [
  {
    path: '',
    component: AttributesRoutingComponent,
    children: [
      {
        path: '',
        component: AttributesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(attributesRoutes)],
  exports: [RouterModule]
})
export class AttributesRoutingModule {}