import { HomeComponent } from './containers/home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { CoreModule } from '@app/core/core.module';
import { MyRadioTableComponent } from './components/my-radio-table/my-radio-table.component';
import { MyLayoutsTableComponent } from './components/my-layouts-table/my-layouts-table.component';
import { MyWorkpackagesTableComponent } from './components/my-workpackages-table/my-workpackages-table.component';
import { MatIconModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatSidenavModule, MatTabsModule, MatChipsModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { HomePageService } from './services/home.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './store/reducers/home.reducers';
import { HomePageEffects } from './store/effects/home.effects';
import { HomeTabsComponent } from './components/home-tabs/home-tabs.component';
import { FavouritesTableComponent } from './components/favourites-table/favourites-table.component';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    HomeRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    MatSidenavModule,
    MatTabsModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule,
    StoreModule.forFeature('homePageFeature', reducer),
    EffectsModule.forFeature([HomePageEffects])
  ],
  exports: [],
  declarations: [
    HomeComponent,
    MyRadioTableComponent,
    MyLayoutsTableComponent,
    MyWorkpackagesTableComponent,
    HomeTabsComponent,
    FavouritesTableComponent
  ],
  providers: [HomePageService]
})
export class HomeModule {}
