import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributesComponent } from './containers/attributes/attributes.component';
import { AttributeDetailsComponent } from './containers/attribute-details/attribute-details.component';

export const attributesRoutes: Routes = [
  {
    path: '',
    component: AttributesComponent,
    children: [
      {
        path: ':attributeId',
        component: AttributeDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(attributesRoutes)],
  exports: [RouterModule]
})
export class AttributesRoutingModule {}