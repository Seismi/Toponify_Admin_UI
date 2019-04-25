import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VersionService } from './services/version.service';
import { VersionRoutingModule } from './version.roouting.module';
import { CoreModule } from '@app/core/core.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers/';
import { CommonModule } from '@angular/common';
import { CommentsModule } from '@app/comments/comments.module';
import { EffectsModule } from '@ngrx/effects';
import { VersionEffects } from './store/effects/version.effects';
import {
  MatCardModule,
  MatDividerModule,
  MatTableModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatMenuModule,
  MatTabsModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSortModule,
  MatListModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { VersionsTableComponent } from './components/versions-table/versions-table.component';
import { VersionsManagerComponent } from './containers/versions-manager.component';
import { VersionModelComponent } from './containers/version-model.component';
import { RightPanelComponent } from './containers/right-panel.component';
import { ObjectDetailsFormComponent } from './components/object-details-form/object-details-form.component';
import { VersionRoutingComponent } from './containers/version-routing.component';
import { VersionsModalComponent } from './containers/version-modal/versions-modal.component';
import { VersionSystemEffects } from './store/effects/version-system-effects';
import { VersionSystemService } from './services/version-system-service';
import { SystemLinkEffects } from './store/effects/system-link.effects';
import { SystemLinkService } from './services/system-links.service';
import { ModelEffects } from './store/effects/model.effects';
import { ModelService } from './services/model.service';
import { ModelLinkEffects } from './store/effects/model-link.effects';
import { ModelLinkService } from './services/model-link.service';
import { MapViewEffects } from './store/effects/model-mapview.effects';
import { MapViewService } from './services/map-view.service';
import { Dimensioneffects } from './store/effects/model-dimension.effects';
import { DimensionService } from './services/dimension.service';
import { DimensionLinkEffects } from './store/effects/dimension-link.effects';
import { DimensionLinkService } from './services/dimension-link.service';
import { ElementEffects } from './store/effects/element.effects';
import { ElementService } from './services/element.service';
import { ElementLinkEffects } from './store/effects/eleemnt-link.effects';
import { ElementLinkService } from './services/element-link.service';
import { AttributeEffects } from './store/effects/attribute.effects';
import { AttributeService } from './services/attribute.service';
import { DiagramService } from './services/diagram.service';
import { VersionDiagramComponent } from './components/version-diagram/version-diagram.component';
import { VersionPaletteComponent } from './components/version-palette/version-palette.component';
import { VersionFormComponent } from './components/version-form/version-form.component';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { TableCollapseComponent } from './components/category-table/table-collapse/table-collapse.component';
import { FilterService } from './services/filter.service';

import { ColorPickerModule } from 'ngx-color-picker';
import { LeftPanelComponent } from './containers/left-panel.component';
import { AnalysisTabComponent } from './components/analysis-tab/analysis-tab.component';
import { ColorsPickerComponent } from './components/color-picker/color-picker.component';
import { AddAttrAndRulesComponent } from './components/add-attr-and-rules/add-attr-and-rules.component';
import { DeleteModalComponent } from './containers/delete-modal/delete-modal.component';
import { DeleteNodeModalComponent } from './containers/delete-node-modal/delete-node-modal.component';
import { DiagramNodeService } from './services/diagram-node.service';
import { DeleteLinkModalComponent } from './containers/delete-link-modal/delete-link-modal.component';
import { DiagramLinkService } from './services/diagram-link.service';
import { NodeEffects } from './store/effects/node.effects';
import { LinkEffects } from './store/effects/link.effects';


@NgModule({
  imports: [
  FormsModule,
  MatProgressSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    CommentsModule,
    VersionRoutingModule,
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
    ColorPickerModule,
    StoreModule.forFeature('versionFeature', reducers),
    EffectsModule.forFeature(
      [ VersionEffects,
        NodeEffects,
        LinkEffects,
        VersionSystemEffects,
        SystemLinkEffects,
        ModelEffects,
        ModelLinkEffects,
        MapViewEffects,
        Dimensioneffects,
        DimensionLinkEffects,
        ElementEffects,
        ElementLinkEffects,
        AttributeEffects
    ])
  ],
  exports: [],
  declarations: [
    VersionsManagerComponent,
    VersionsTableComponent,
    VersionModelComponent,
    VersionRoutingComponent,
    VersionDiagramComponent,
    VersionPaletteComponent,
    RightPanelComponent,
    ObjectDetailsFormComponent,
    VersionsModalComponent,
    DeleteModalComponent,
    VersionFormComponent,
    CategoryTableComponent,
    TableCollapseComponent,
    LeftPanelComponent,
    AnalysisTabComponent,
    ColorsPickerComponent,
    DeleteNodeModalComponent,
    DeleteLinkModalComponent,
    AddAttrAndRulesComponent
  ],
  entryComponents: [VersionsModalComponent, DeleteModalComponent, DeleteNodeModalComponent, DeleteLinkModalComponent],
  providers: [
    VersionService,
    VersionSystemService,
    SystemLinkService,
    ModelService,
    ModelLinkService,
    MapViewService,
    DimensionService,
    DimensionLinkService,
    ElementService,
    ElementLinkService,
    AttributeService,
    DiagramService,
    FilterService,
    DiagramNodeService,
    DiagramLinkService
  ]
})
export class VersionModule {}
