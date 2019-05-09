import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationStandardsRoutingComponent } from './containers/documentation-standards-routing.component';
import { DocumentationStandardsComponent } from './containers/documentation-standards.component';

export const documentationStandardsRoutes: Routes = [
  {
    path: '',
    component: DocumentationStandardsRoutingComponent,
    children: [
      {
        path: '',
        component: DocumentationStandardsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(documentationStandardsRoutes)],
  exports: [RouterModule]
})
export class DocumentationStandardsRoutingModule {}