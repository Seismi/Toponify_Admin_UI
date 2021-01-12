import { CustomersComponent } from './containers/customers.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomersRoutingModule } from './customers-routing.module';
import { CoreModule } from '@app/core/core.module';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    CustomersRoutingModule
  ],
  declarations: [CustomersComponent]
})
export class CustomersModule {}
