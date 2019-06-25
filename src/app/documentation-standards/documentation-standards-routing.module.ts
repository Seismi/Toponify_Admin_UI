import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationStandardsComponent } from './containers/documentation-standards/documentation-standards.component';
import { DocumentationStandardsDetailComponent } from './components/documentation-standards-detail/documentation-standards-detail.component';

export const documentationStandardsRoutes: Routes = [
  {
    path: '',
    component: DocumentationStandardsComponent,
    children: [
      {
        path: ':documentStandardId',
        component: DocumentationStandardsDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(documentationStandardsRoutes)],
  exports: [RouterModule]
})
export class DocumentationStandardsRoutingModule {}