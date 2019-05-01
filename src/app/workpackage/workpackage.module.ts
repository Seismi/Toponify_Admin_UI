import { WorkpackageComponent } from './containers/workpackage.component';
import { NgModule } from '@angular/core';
import { WorkpackageRoutingComponent } from './containers/workpackage-routing.component';
import { WorkpackageRoutingModule } from './workpackage-routing.module';
import { CoreModule } from '@app/core/core.module';
import { WorkpackagesTableComponent } from './components/workpackages-table/workpackages-table.component';
import { WorkpackageDetailComponent } from './components/workpackage-detail/workpackage-detail.component';
import { ObjectivesTableComponent } from './components/objectives-table/objectives-table.component';
import { RadioTableComponent } from './components/radio-table/radio-table.component';
import { ChangeTableComponent } from './components/change-table/change-table.component';
import { WorkpackageLayoutActionsComponent } from './components/layout-actions/layout-actions.component';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule 
} from '@angular/material';


@NgModule({
  imports: [
    CoreModule,
    WorkpackageRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  exports: [],
  declarations: [
    WorkpackageComponent, 
    WorkpackageRoutingComponent,
    WorkpackagesTableComponent,
    WorkpackageDetailComponent,
    ObjectivesTableComponent,
    RadioTableComponent,
    ChangeTableComponent,
    WorkpackageLayoutActionsComponent
  ],
  providers: [],
})
export class WorkpackageModule { }