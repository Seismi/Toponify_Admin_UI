import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadioComponent } from './containers/radio/radio.component';

export const radioRoutes: Routes = [
  {
    path: '',
    component: RadioComponent,
    children: [
      {
        path: ':radioId',
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