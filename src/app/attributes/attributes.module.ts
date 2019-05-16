import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { AttributesRoutingModule } from './attributes-router.module';
import { AttributesComponent } from './containers/attributes.component';
import { AttributesRoutingComponent } from './containers/attributes-router.component';

@NgModule({
  imports: [
    AttributesRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule],
  exports: [],
  declarations: [
    AttributesComponent, 
    AttributesRoutingComponent
  ],
  providers: [],
})
export class AttributesModule { }