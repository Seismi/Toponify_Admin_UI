import { HomeComponent } from './containers/home.component';
import { NgModule } from '@angular/core';
import { HomeRoutingComponent } from './containers/home-routing.component';
import { HomeRoutingModule } from './home-routing.module';
import { CoreModule } from '@app/core/core.module';
import { NodeModule } from '@app/nodes/nodes.moudle';



@NgModule({
  imports: [
    CoreModule,
    NodeModule,
    HomeRoutingModule
  ],
  exports: [],
  declarations: [HomeComponent, HomeRoutingComponent],
  providers: [],
})
export class HomeModule { }
