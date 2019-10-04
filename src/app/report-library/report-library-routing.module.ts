import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportLibraryComponent } from './containers/report-library.component';
import { ReportLibraryDetailsComponent } from './containers/report-library-details/report-library-details.component';

export const reportLibraryRoutes: Routes = [
  {
    path: '',
    component: ReportLibraryComponent,
    children: [
      {
        path: ':reportId',
        component: ReportLibraryDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(reportLibraryRoutes)],
  exports: [RouterModule]
})
export class ReportLibraryRoutingModule {}
