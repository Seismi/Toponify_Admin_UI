import { UsersComponent } from './containers/users.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { CoreModule } from '@app/core/core.module';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    UsersRoutingModule
  ],
  declarations: [UsersComponent]
})
export class UsersModule {}
