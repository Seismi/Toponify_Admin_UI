import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { AttributesRoutingModule } from './attributes-router.module';
import { AttributesComponent } from './containers/attributes.component';
import { AttributesRoutingComponent } from './containers/attributes-router.component';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { TableCollapseComponent } from './components/category-table/table-collapse/table-collapse.component';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDividerModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule,
  MatProgressSpinnerModule, MatSortModule, MatTableModule, MatTabsModule, MatSnackBarModule } from '@angular/material';
import { AttributeService } from './services/attributes.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AttributeEffects } from './store/effects/attributes.effects';
import { reducer } from './store/reducers/attributes.reducer';
import { ArchitectureModule } from '@app/architecture/architecture.module';

@NgModule({
  imports: [
    AttributesRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    ArchitectureModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDividerModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatSortModule, MatTableModule, MatTabsModule, MatSnackBarModule,
    StoreModule.forFeature('attributesFeature', reducer),
    EffectsModule.forFeature([ AttributeEffects ])
  ],
  exports: [],
  declarations: [
    AttributesComponent,
    AttributesRoutingComponent
  ],
  providers: [
    AttributeService
  ],
})
export class AttributesModule { }