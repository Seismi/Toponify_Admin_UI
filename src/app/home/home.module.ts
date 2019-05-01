import { HomeComponent } from './containers/home.component';
import { NgModule } from '@angular/core';
import { HomeRoutingComponent } from './containers/home-routing.component';
import { HomeRoutingModule } from './home-routing.module';
import { CoreModule } from '@app/core/core.module';
import { MyRadioTableComponent } from './components/my-radio-table/my-radio-table.component';
import { MyLayoutsTableComponent } from './components/my-layouts-table/my-layouts-table.component';
import { MyWorkpackagesTableComponent } from './components/my-workpackages-table/my-workpackages-table.component';
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
    MyRadioTableComponent,
    MyLayoutsTableComponent,
    MyWorkpackagesTableComponent
  ],
  providers: [],
})
export class HomeModule { }
