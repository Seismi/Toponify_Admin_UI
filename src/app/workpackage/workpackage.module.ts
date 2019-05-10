import { ChangeTableComponent } from './components/change-table/change-table.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
  } from '@angular/material';
import { NgModule } from '@angular/core';
import { ObjectivesTableComponent } from './components/objectives-table/objectives-table.component';
import { RadioTableComponent } from './components/radio-table/radio-table.component';
import { reducer } from './store/reducers/workpackage.reducer';
import { StoreModule } from '@ngrx/store';
import { WorkPackageEffects } from './store/effects/workpackage.effects';
import { WorkPackageRoutingModule } from './workpackage.routing.module';
import { WorkPackageService } from './services/workpackage.service';
import { WorkPackageRoutingComponent } from './containers/workpackage-routing.component';
import { WorkPackageComponent } from './containers/workpackage/workpackage.component';
import { WorkPackagesTableComponent } from './components/workpackages-table/workpackages-table.component';
import { WorkPackageDetailComponent } from './components/workpackage-detail/workpackage-detail.component';



@NgModule({
  imports: [
    WorkPackageRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    FormsModule,
    CommonModule,
    CoreModule,
    StoreModule.forFeature('workpackageFeature', reducer),
    EffectsModule.forFeature([ WorkPackageEffects]
    )
  ],
  exports: [],
  declarations: [
    WorkPackageComponent,
    WorkPackageRoutingComponent,
    WorkPackagesTableComponent,
    WorkPackageDetailComponent,
    ObjectivesTableComponent,
    RadioTableComponent,
    ChangeTableComponent
  ],
  providers: [
    WorkPackageService
  ],
})
export class WorkPackageModule { }
