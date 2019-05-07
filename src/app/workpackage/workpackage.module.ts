import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@app/core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { WorkPackageService } from './services/workpackage.service';
import { WorkPackageEffects } from './store/effects/workpackage.effects';
import { reducers } from './store/reducers';
import { WorkPackageRoutingModule } from './workpackage.routing.module';
import { WorkPackageComponent } from './containers/workpackage/workpackage.component';

@NgModule({
  imports: [
    WorkPackageRoutingModule,
    FormsModule,
    CommonModule,
    CoreModule,
    StoreModule.forFeature('workpackageFeature', reducers),
    EffectsModule.forFeature(
      [ WorkPackageEffects ]
    )
  ],
  exports: [],
  declarations: [WorkPackageComponent],
  entryComponents: [WorkPackageComponent],
  providers: [
    WorkPackageService
  ]
})
export class WorkPackageModule {}
