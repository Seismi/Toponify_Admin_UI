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
import { HomePageService } from './services/home.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './store/reducers/home.reducers'
import { HomePageEffects } from './store/effects/home.effects';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    HomeRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    HomeRoutingModule,
    StoreModule.forFeature('homePageFeature', reducer),
    EffectsModule.forFeature([ HomePageEffects ])
  ],
  exports: [],
  declarations: [
    HomeComponent,
    HomeRoutingComponent,
    MyRadioTableComponent,
    MyLayoutsTableComponent,
    MyWorkpackagesTableComponent
  ],
  providers: [
    HomePageService
  ],
})
export class HomeModule { }
