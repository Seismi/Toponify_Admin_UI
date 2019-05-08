import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportLibraryRoutingComponent } from './containers/report-library-routing.component';
import { ReportLibraryComponent } from './containers/report-library.component';

export const reportLibraryRoutes: Routes = [
  {
    path: '',
    component: ReportLibraryRoutingComponent,
    children: [
      {
        path: '',
        component: ReportLibraryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(reportLibraryRoutes)],
  exports: [RouterModule]
})
export class ReportLibraryRoutingModule {}