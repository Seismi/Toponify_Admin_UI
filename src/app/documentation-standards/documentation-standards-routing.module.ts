import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationStandardsComponent } from './containers/documentation-standards/documentation-standards.component';
import { DocumentationStandardsDetailsComponent } from './containers/documentation-standards-details/documentation-standards-details.component';

export const documentationStandardsRoutes: Routes = [
  {
    path: '',
    component: DocumentationStandardsComponent,
    children: [
      {
        path: ':documentStandardId',
        component: DocumentationStandardsDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(documentationStandardsRoutes)],
  exports: [RouterModule]
})
export class DocumentationStandardsRoutingModule {}