import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
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
import { DiagramChangesService } from './services/diagram-changes.service';
import { DiagramListenersService } from './services/diagram-listeners.service';
import { DiagramTemplatesService } from './services/diagram-templates.service';
import { DiagramLevelService } from './services/diagram-level.service';
import { GojsCustomObjectsService } from '@app/architecture/services/gojs-custom-objects.service';
import { RadioModule } from '@app/radio/radio.module';
import { DocumentationStandardsModule } from '@app/documentation-standards/documentation-standards.module';
import { WorkPackageTabComponent } from './components/workpackage-tab/workpackage-tab.component';
import { RadioTabComponent } from './components/radio-tab/radio-tab.component';
import { PropertiesTabComponent } from './components/properties-tab/properties-tab.component';
import { AttributesTabComponent } from './components/attributes-tab/attributes-tab.component';
import { ScopeModule } from '@app/scope/scope.module';
import { LayoutModule } from '@app/layout/layout.module';
import { WorkPackageTabTableComponent } from './components/workpackage-tab-table/workpackage-tab-table.component';
import { WorkPackageColorComponent } from './components/color-picker/color-picker.component';
import { LayerPipe } from './pipes/layer.pipe';
import { AttributeModalComponent } from '@app/attributes/containers/attribute-modal/attribute-modal.component';
import { AttributeDetailComponent } from '@app/attributes/components/attribute-detail/attribute-detail.component';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from './store/effects/node.effects';
import { RadioTableInArchitectureComponent } from './components/radio-table/radio-table.component';
import { CategoryTableComponent } from '@app/attributes/components/category-table/category-table.component';
import { TableCollapseComponent } from '@app/attributes/components/category-table/table-collapse/table-collapse.component';
import { ScopesAndLayoutsModule } from '@app/scopes-and-layouts/scopes-and-layouts.module';
import { OwnersTableComponent } from './components/owners-table/owners-table.component';
import { DescendantsTableComponent } from '@app/architecture/components/descendants-table/descendants-table.component';
import { DescendantsModalComponent } from './containers/descendants-modal/descendants-modal.component';
import { EditNameModalComponent } from '@app/architecture/components/edit-name-modal/edit-name-modal.component';
import { SwitchViewTabsComponent } from '@app/architecture/components/switch-view-tabs/switch-view-tabs.component';
import { ArchitectureTableViewComponent } from './components/architecture-table-view/architecture-table-view.component';

@NgModule({
  imports: [
    CoreModule,
    ArchitectureRoutingModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
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
    MatSelectModule,
    MatTooltipModule,
    ScopesAndLayoutsModule,
    StoreModule.forFeature('architectureFeature', reducer),
    EffectsModule.forFeature([NodeEffects])
  ],
  exports: [ObjectDetailsFormComponent, WorkPackageTabTableComponent, CategoryTableComponent, TableCollapseComponent],
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
    WorkPackageTabComponent,
    RadioTabComponent,
    PropertiesTabComponent,
    AttributesTabComponent,
    DeleteLinkModalComponent,
    WorkPackageTabTableComponent,
    WorkPackageColorComponent,
    LayerPipe,
    AttributeModalComponent,
    AttributeDetailComponent,
    RadioTableInArchitectureComponent,
    CategoryTableComponent,
    TableCollapseComponent,
    OwnersTableComponent,
    DescendantsTableComponent,
    DescendantsModalComponent,
    EditNameModalComponent,
    SwitchViewTabsComponent,
    ArchitectureTableViewComponent
  ],
  entryComponents: [
    DeleteModalComponent,
    DeleteNodeModalComponent,
    DeleteLinkModalComponent,
    AttributeModalComponent,
    DescendantsModalComponent,
    EditNameModalComponent
  ],
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
  ]
})
export class ArchitectureModule {}
