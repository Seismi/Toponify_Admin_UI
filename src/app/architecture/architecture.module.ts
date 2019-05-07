
import { CoreModule } from '@app/core/core.module';
import { NodeModule } from '@app/nodes/nodes.moudle';
import { NgModule } from '@angular/core';
import { ArchitectureRoutingModule } from './architecture-routing.module';
import { ArchitectureRoutingComponent } from './containers/architecture-routing.component';
import { ArchitectureComponent } from './containers/architecture.component';
import { ArchitectureDiagramComponent } from './components/architecture-diagram/architecture-diagram.component';
import { ArchitecturePaletteComponent } from './components/architecture-palette/architecture-palette.component';
import {RightPanelComponent} from './containers/right-panel.component';
import {ObjectDetailsFormComponent} from './components/object-details-form/object-details-form.component';
import {DeleteModalComponent} from './containers/delete-modal/delete-modal.component';
import {CategoryTableComponent} from './components/category-table/category-table.component';
import {TableCollapseComponent} from './components/category-table/table-collapse/table-collapse.component';
import {LeftPanelComponent} from './containers/left-panel.component';
import {AnalysisTabComponent} from './components/analysis-tab/analysis-tab.component';
import {ColorsPickerComponent} from './components/color-picker/color-picker.component';
import {DeleteNodeModalComponent} from './containers/delete-node-modal/delete-node-modal.component';
import {DeleteLinkModalComponent} from './containers/delete-link-modal/delete-link-modal.component';
import {AddAttrAndRulesComponent} from './components/add-attr-and-rules/add-attr-and-rules.component';
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
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CommentsModule} from '@app/comments/comments.module';
import {ColorPickerModule} from 'ngx-color-picker';
// import {AttributeService} from '@app/architecture/services/attribute.service';
import {DiagramService} from '@app/architecture/services/diagram.service';
import {FilterService} from '@app/architecture/services/filter.service';
import {NodeService} from '@app/nodes/services/node.service';


@NgModule({
  imports: [
    CoreModule,
    NodeModule,
    ArchitectureRoutingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    CommentsModule,
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
  ],
    exports: [],
    declarations: [
      ArchitectureRoutingComponent,
      ArchitectureComponent,
      ArchitectureDiagramComponent,
      ArchitecturePaletteComponent,
      RightPanelComponent,
      ObjectDetailsFormComponent,
      DeleteModalComponent,
      CategoryTableComponent,
      TableCollapseComponent,
      LeftPanelComponent,
      AnalysisTabComponent,
      ColorsPickerComponent,
      DeleteNodeModalComponent,
      DeleteLinkModalComponent,
      AddAttrAndRulesComponent
    ],
    entryComponents: [DeleteModalComponent, DeleteNodeModalComponent, DeleteLinkModalComponent],
    providers: [
      // AttributeService,
      DiagramService,
      FilterService,
      NodeService
    ],
})
export class ArchitectureModule { }
