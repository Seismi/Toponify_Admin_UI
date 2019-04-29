import { HomeComponent } from './containers/home.component';
import { NgModule } from '@angular/core';
import { HomeRoutingComponent } from './containers/home-routing.component';
import { HomeRoutingModule } from './home-routing.module';
import { CoreModule } from '@app/core/core.module';
import { RadioTableComponent } from './components/radio-table/radio-table.component';
import { LayoutsTableComponent } from './components/layouts-table/layouts-table.component';
import { WorkpackagesTableComponent } from './components/workpackages-table/workpackages-table.component';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatIconModule,
  MatMenuModule 
} from '@angular/material';


@NgModule({
  imports: [
    CoreModule,
    HomeRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [],
  declarations: [
    HomeComponent, 
    HomeRoutingComponent,
    RadioTableComponent,
    LayoutsTableComponent,
    WorkpackagesTableComponent
  ],
  providers: [],
})
export class HomeModule { }
