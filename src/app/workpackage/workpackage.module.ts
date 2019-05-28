import { ChangeTableComponent } from './components/change-table/change-table.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatDialogModule
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
import { WorkPackageModalComponent } from './containers/new-workpackage-modal/new-workpackage.component';
import { NewWorkpackageFormComponent } from './components/new-workpackage-form/new-workpackage-form.component';
import { DeleteWorkPackageModalComponent } from './containers/delete-workpackage-modal/delete-workpackage.component';



@NgModule({
  imports: [
    WorkPackageRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    StoreModule.forFeature('workpackageFeature', reducer),
    EffectsModule.forFeature([ WorkPackageEffects]
    )
  ],
  exports: [WorkPackagesTableComponent],
  declarations: [
    WorkPackageComponent,
    WorkPackageRoutingComponent,
    WorkPackagesTableComponent,
    WorkPackageDetailComponent,
    ObjectivesTableComponent,
    RadioTableComponent,
    ChangeTableComponent,
    WorkPackageModalComponent,
    NewWorkpackageFormComponent,
    DeleteWorkPackageModalComponent
  ],
  entryComponents: [WorkPackageModalComponent, DeleteWorkPackageModalComponent],
  providers: [
    WorkPackageService
  ],
})
export class WorkPackageModule { }
