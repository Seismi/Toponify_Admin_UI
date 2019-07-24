import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDividerModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule,
  MatProgressSpinnerModule, MatSortModule, MatTableModule, MatTabsModule, MatGridListModule } from '@angular/material';
import { FilterService } from './services/filter.service';
import { reducer } from '@app/architecture/store/reducers/architecture.reducer';
import { CoreModule } from '@app/core/core.module';
import { NodeService } from '@app/architecture/services/node.service';
import { StoreModule } from '@ngrx/store';
import { ArchitectureRoutingModule } from './architecture-routing.module';
import { AnalysisTabComponent } from './components/analysis-tab/analysis-tab.component';
import { ArchitectureDiagramComponent } from './components/architecture-diagram/architecture-diagram.component';
import { ArchitecturePaletteComponent } from './components/architecture-palette/architecture-palette.component';
import { ObjectDetailsFormComponent } from './components/object-details-form/object-details-form.component';
import { ArchitectureRoutingComponent } from './containers/architecture-routing.component';
import { ArchitectureComponent } from './containers/architecture.component';
import { DeleteLinkModalComponent } from './containers/delete-link-modal/delete-link-modal.component';
import { DeleteModalComponent } from './containers/delete-modal/delete-modal.component';
import { DeleteNodeModalComponent } from './containers/delete-node-modal/delete-node-modal.component';
import { LeftPanelComponent } from './containers/left-panel/left-panel.component';
import { RightPanelComponent } from './containers/right-panel/right-panel.component';
import { WorkPackageService } from '@app/workpackage/services/workpackage.service';
import { WorkPackageModule } from '@app/workpackage/workpackage.module';
import {DiagramChangesService} from './services/diagram-changes.service';
import {DiagramListenersService} from './services/diagram-listeners.service';
import {DiagramTemplatesService} from './services/diagram-templates.service';
import {DiagramLevelService} from './services/diagram-level.service';
import {GojsCustomObjectsService} from '@app/architecture/services/gojs-custom-objects.service';
import { RadioModule } from '@app/radio/radio.module';
import { DocumentationStandardsModule } from '@app/documentation-standards/documentation-standards.module';
import { CategoryTableComponent } from '@app/attributes/components/category-table/category-table.component';
import { TableCollapseComponent } from '@app/attributes/components/category-table/table-collapse/table-collapse.component';
import { WorkPackageTabComponent } from './components/workpackage-tab/workpackage-tab.component';
import { RadioTabComponent } from './components/radio-tab/radio-tab.component';
import { PropertiesTabComponent } from './components/properties-tab/properties-tab.component';
import { AttributesTabComponent } from './components/attributes-tab/attributes-tab.component';
import { ScopeModule } from '@app/scope/scope.module';
import { LayoutModule } from '@app/layout/layout.module';
import { WorkPackageTabTableComponent } from './components/workpackage-tab-table/workpackage-tab-table.component';
import { WorkPackageColorComponent } from './components/color-picker/color-picker.component';
import { LayerPipe } from './pipes/layer.pipe';
import { RightSideBarComponent } from './components/right-sidebar/right-sidebar.component';
import { LeftSideBarComponent } from './components/left-side-bar/left-side-bar.component';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from './store/effects/node.effects';


@NgModule({
  imports: [
    CoreModule,
    ArchitectureRoutingModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    WorkPackageModule,
    RadioModule,
    DocumentationStandardsModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSortModule,
    MatListModule,
    ScopeModule,
    LayoutModule,
    MatGridListModule,
    StoreModule.forFeature('architectureFeature', reducer),
    EffectsModule.forFeature([NodeEffects])
  ],
    exports: [ObjectDetailsFormComponent, CategoryTableComponent, TableCollapseComponent, WorkPackageTabTableComponent],
    declarations: [
      ArchitectureRoutingComponent,
      ArchitectureComponent,
      ArchitectureDiagramComponent,
      ArchitecturePaletteComponent,
      RightPanelComponent,
      ObjectDetailsFormComponent,
      DeleteModalComponent,
      LeftPanelComponent,
      AnalysisTabComponent,
      DeleteNodeModalComponent,
      CategoryTableComponent,
      TableCollapseComponent,
      WorkPackageTabComponent,
      RadioTabComponent,
      PropertiesTabComponent,
      AttributesTabComponent,
      DeleteLinkModalComponent,
      WorkPackageTabTableComponent,
      WorkPackageColorComponent,
      LayerPipe,
      RightSideBarComponent,
      LeftSideBarComponent
    ],
    entryComponents: [DeleteModalComponent, DeleteNodeModalComponent, DeleteLinkModalComponent],
    providers: [
      GojsCustomObjectsService,
      DiagramChangesService,
      DiagramListenersService,
      DiagramTemplatesService,
      DiagramLevelService,
      DiagramListenersService,
      FilterService,
      NodeService,
      WorkPackageService
    ],
})
export class ArchitectureModule { }
