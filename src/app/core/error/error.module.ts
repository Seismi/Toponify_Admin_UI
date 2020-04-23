import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from '@app/core/error/error.component';
import { CoreLayoutModule } from '@app/core/layout/core-layout.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CoreLayoutModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ErrorComponent
      }
    ])
  ],
  declarations: [ErrorComponent]
})
export class ErrorModule {}
