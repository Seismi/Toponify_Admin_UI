import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadioRoutingComponent } from './containers/radio-routing.components';
import { RadioComponent } from './containers/radio.component';

export const radioRoutes: Routes = [
  {
    path: '',
    component: RadioRoutingComponent,
    children: [
      {
        path: '',
        component: RadioComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(radioRoutes)],
  exports: [RouterModule]
})
export class RadioRoutingModule {}