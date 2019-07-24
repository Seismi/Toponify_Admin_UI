import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadioComponent } from './containers/radio/radio.component';
import { RadioDetailsComponent } from './containers/radio-details/radio-details.component';

export const radioRoutes: Routes = [
  {
    path: '',
    component: RadioComponent,
    children: [
      {
        path: ':radioId',
        component: RadioDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(radioRoutes)],
  exports: [RouterModule]
})
export class RadioRoutingModule {}