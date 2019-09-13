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
  MatDialogModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatTabsModule
  } from '@angular/material';
import { NgModule } from '@angular/core';
import { ObjectivesTableComponent } from './components/objectives-table/objectives-table.component';
import { RadiosTableComponent } from './components/radio-table/radio-table.component';
import { reducer } from './store/reducers/workpackage.reducer';
import { StoreModule } from '@ngrx/store';
import { WorkPackageEffects } from './store/effects/workpackage.effects';
import { WorkPackageRoutingModule } from './workpackage.routing.module';
import { WorkPackageService } from './services/workpackage.service';
import { WorkPackageRoutingComponent } from './containers/workpackage-routing.component';
import { WorkPackageComponent } from './containers/workpackage/workpackage.component';
import { WorkPackagesTableComponent } from './components/workpackages-table/workpackages-table.component';
import { WorkPackageDetailComponent } from './components/workpackage-detail/workpackage-detail.component';
import { WorkPackageModalComponent } from './containers/workpackage-modal/workpackage.component';
import { DeleteWorkPackageModalComponent } from './containers/delete-workpackage-modal/delete-workpackage.component';
import { WorkpackageDetailsComponent } from './containers/workpackage-details/workpackage-details.component';
import { WpOwnersDropdownComponent } from './components/wp-owners-dropdown/wp-owners-dropdown.component';
import { SettingsModule } from '@app/settings/settings.module';
import { WpBaselineDropdownComponent } from './components/wp-baseline-dropdown/wp-baseline-dropdown.component';
import { BaselineTableComponent } from './components/baseline-table/baseline-table.component';
import { OwnersTableComponent } from './components/owners-table/owners-table.component';
import { ApproversTableComponent } from './components/approvers-table/approvers-table.component';
import { OwnersModalComponent } from './containers/owners-modal/owners-modal.component';
import { OwnersListComponent } from './components/owners-list/owners-list.component';
import { WorkPackageTreeModalComponent } from './containers/workpackage-tree-modal/workpackage-tree-modal.component';
import { PropertiesTableComponent } from './components/properties-table/properties-table.component';
import { WorkPackageNodeEffects } from './store/effects/workpackage-node.effects';
import { WorkPackageNodesService } from './services/workpackage-nodes.service';
import { WorkPackageLinkEffects } from './store/effects/workpackage-link.effects';
import { WorkPackageLinksService } from './services/workpackage-links.service';
import { RadioListComponent } from './components/radio-list/radio-list.component';
import { RadioListModalComponent } from './containers/radio-list-modal/radio-list-modal.component';
import { RadioModule } from '@app/radio/radio.module';


@NgModule({
  imports: [
    WorkPackageRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    SettingsModule,
    RadioModule,
    StoreModule.forFeature('workpackageFeature', reducer),
    EffectsModule.forFeature([WorkPackageEffects, WorkPackageNodeEffects, WorkPackageLinkEffects])
  ],
  exports: [WorkPackagesTableComponent],
  declarations: [
    WorkPackageComponent,
    WorkPackageRoutingComponent,
    WorkPackagesTableComponent,
    WorkPackageDetailComponent,
    ObjectivesTableComponent,
    RadiosTableComponent,
    ChangeTableComponent,
    WorkPackageModalComponent,
    DeleteWorkPackageModalComponent,
    WorkpackageDetailsComponent,
    WpOwnersDropdownComponent,
    WpBaselineDropdownComponent,
    BaselineTableComponent,
    OwnersTableComponent,
    ApproversTableComponent,
    OwnersModalComponent,
    OwnersListComponent,
    WorkPackageTreeModalComponent,
    PropertiesTableComponent,
    RadioListComponent,
    RadioListModalComponent
  ],
  entryComponents: [
    WorkPackageModalComponent,
    DeleteWorkPackageModalComponent,
    OwnersModalComponent,
    WorkPackageTreeModalComponent,
    RadioListModalComponent
  ],
  providers: [
    WorkPackageService,
    WorkPackageNodesService,
    WorkPackageLinksService
  ],
})
export class WorkPackageModule { }
