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
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatToolbarModule, MatChipsModule, MatSidenavModule, MatSlideToggleModule, MatButtonToggleModule, MatAutocompleteModule
} from '@angular/material';
import { CoreModule } from '@app/core/core.module';
import { NodeService } from '@app/architecture/services/node.service';
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
import { DiagramPartTemplatesService } from './services/diagram-part-templates.service';
import { DiagramLevelService } from './services/diagram-level.service';
import { GojsCustomObjectsService } from '@app/architecture/services/gojs-custom-objects.service';
import { RadioModule } from '@app/radio/radio.module';
import { DocumentationStandardsModule } from '@app/documentation-standards/documentation-standards.module';
import { AttributesTabComponent } from './components/attributes-tab/attributes-tab.component';
import { ScopeModule } from '@app/scope/scope.module';
import { LayoutModule } from '@app/layout/layout.module';
import { WorkPackageTabTableComponent } from './components/workpackage-tab-table/workpackage-tab-table.component';
import { LayerPipe } from './pipes/layer.pipe';
import { AttributeModalComponent } from '@app/attributes/containers/attribute-modal/attribute-modal.component';
import { AttributeDetailComponent } from '@app/attributes/components/attribute-detail/attribute-detail.component';
import { RadioTableInArchitectureComponent } from './components/radio-table/radio-table.component';
import { CategoryTableComponent } from '@app/attributes/components/category-table/category-table.component';
import { TableCollapseComponent } from '@app/attributes/components/category-table/table-collapse/table-collapse.component';
import { ScopesAndLayoutsModule } from '@app/scopes-and-layouts/scopes-and-layouts.module';
import { OwnersTableComponent } from './components/owners-table/owners-table.component';
import { EditNameModalComponent } from '@app/architecture/components/edit-name-modal/edit-name-modal.component';
import { SettingsModule } from '@app/settings/settings.module';
import { SwitchViewTabsComponent } from '@app/architecture/components/switch-view-tabs/switch-view-tabs.component';
import { ArchitectureTableViewComponent } from './components/architecture-table-view/architecture-table-view.component';
import { ScopeTableComponent } from './components/scope-table/scope-table.component';
import { NodeScopeModalComponent } from './containers/add-scope-modal/add-scope-modal.component';
import { NewChildrenModalComponent } from './containers/new-children-modal/new-children-modal.component';
import { ReportsTabComponent } from './components/reports-tab/reports-tab.component';
import { AddExistingAttributeModalComponent } from './containers/add-existing-attribute-modal/add-existing-attribute-modal.component';
import { AttributesListComponent } from './components/attributes-list/attributes-list.component';
import { DeleteAttributeModalComponent } from './containers/delete-attribute-modal/delete-attribute-modal.component';
import {DiagramImageService} from '@app/architecture/services/diagram-image.service';
import { RadioConfirmModalComponent } from './containers/radio-confirm-modal/radio-confirm-modal.component';
import { ComponentsOrLinksModalComponent } from './containers/components-or-links-modal/components-or-links-modal.component';
import { TagListModule } from '@app/architecture/components/tag-list/tag-list.module';
import { TagModule } from '@app/architecture/components/tag-list/tag/tag.module';
import { LayoutActionsComponent } from './components/diagram-actions/layout-actions/layout-actions.component';
import { ComponentsTableComponent } from './components/components-table/components-table.component';
import { GroupInfoTableComponent } from './components/group-info-table/group-info-table.component';
import { SourceOrTargetTableComponent } from './components/source-or-target-table/source-or-target-table.component';
import { SaveLayoutModalComponent } from './components/save-layout-modal/save-layout-modal.component';
import { LayoutSettingsModalComponent } from './containers/layout-settings-modal/layout-settings-modal.component';
import { DiagramActionsComponent } from './components/diagram-actions/diagram-actions.component';
import { LayoutsDropdownComponent } from './components/diagram-actions/layouts-dropdown/layouts-dropdown.component';
import {CustomToolsService} from '@app/architecture/services/custom-tools-service';
import {CustomLayoutService} from '@app/architecture/services/custom-layout-service';
import {DiagramUtilitiesService} from '@app/architecture/services/diagram-utilities-service';

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
    SettingsModule,
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
    MatSnackBarModule,
    MatListModule,
    ScopeModule,
    LayoutModule,
    MatGridListModule,
    MatSelectModule,
    MatTooltipModule,
    MatToolbarModule,
    ScopesAndLayoutsModule,
    TagListModule,
    TagModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatAutocompleteModule
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
    AttributesTabComponent,
    DeleteLinkModalComponent,
    WorkPackageTabTableComponent,
    LayerPipe,
    AttributeModalComponent,
    AttributeDetailComponent,
    RadioTableInArchitectureComponent,
    CategoryTableComponent,
    TableCollapseComponent,
    OwnersTableComponent,
    EditNameModalComponent,
    SaveLayoutModalComponent,
    SwitchViewTabsComponent,
    ArchitectureTableViewComponent,
    ScopeTableComponent,
    NodeScopeModalComponent,
    NewChildrenModalComponent,
    ReportsTabComponent,
    AddExistingAttributeModalComponent,
    AttributesListComponent,
    DeleteAttributeModalComponent,
    RadioConfirmModalComponent,
    ComponentsOrLinksModalComponent,
    LayoutActionsComponent,
    ComponentsTableComponent,
    GroupInfoTableComponent,
    SourceOrTargetTableComponent,
    LayoutSettingsModalComponent,
    DiagramActionsComponent,
    LayoutsDropdownComponent
  ],
  entryComponents: [
    DeleteModalComponent,
    DeleteNodeModalComponent,
    DeleteLinkModalComponent,
    AttributeModalComponent,
    EditNameModalComponent,
    SaveLayoutModalComponent,
    NodeScopeModalComponent,
    NewChildrenModalComponent,
    NodeScopeModalComponent,
    AddExistingAttributeModalComponent,
    DeleteAttributeModalComponent,
    RadioConfirmModalComponent,
    ComponentsOrLinksModalComponent,
    LayoutSettingsModalComponent,
  ],
  providers: [
    GojsCustomObjectsService,
    CustomToolsService,
    CustomLayoutService,
    DiagramUtilitiesService,
    DiagramChangesService,
    DiagramListenersService,
    DiagramPartTemplatesService,
    DiagramLevelService,
    DiagramListenersService,
    DiagramImageService,
    NodeService,
    WorkPackageService
  ]
})
export class ArchitectureModule {}
