import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDividerModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule,
  MatProgressSpinnerModule, MatSortModule, MatTableModule, MatTabsModule } from '@angular/material';
// import {AttributeService} from './services/attribute.service';
import { FilterService } from './services/filter.service';
import { reducer } from '@app/architecture/store/reducers/view.reducer';
import { CoreModule } from '@app/core/core.module';
import { NodeModule } from '@app/nodes/node.module';
import { NodeService } from '@app/nodes/services/node.service';
import { StoreModule } from '@ngrx/store';
// import {CommentsModule} from '@app/comments/comments.module';
import { ColorPickerModule } from 'ngx-color-picker';
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
import { LeftPanelComponent } from './containers/left-panel.component';
import { RightPanelComponent } from './containers/right-panel.component';
import { WorkPackageService } from '@app/workpackage/services/workpackage.service';
import { WorkPackageModule } from '@app/workpackage/workpackage.module';
import {DiagramChangesService} from './services/diagram-changes.service';
import {DiagramListenersService} from './services/diagram-listeners.service';
import {DiagramTemplatesService} from './services/diagram-templates.service';
import {DiagramLevelService} from './services/diagram-level.service';
import {GojsCustomObjectsService} from '@app/architecture/services/gojs-custom-objects.service';


@NgModule({
  imports: [
    CoreModule,
    NodeModule,
    ArchitectureRoutingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    WorkPackageModule,
    // CommentsModule,
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
    StoreModule.forFeature('architectureFeature', reducer)
  ],
    exports: [ObjectDetailsFormComponent],
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
      DeleteLinkModalComponent
    ],
    entryComponents: [DeleteModalComponent, DeleteNodeModalComponent, DeleteLinkModalComponent],
    providers: [
      // AttributeService,
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
