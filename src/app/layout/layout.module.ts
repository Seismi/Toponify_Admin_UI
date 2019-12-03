import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutService } from './services/layout.service';
import { LayoutEffects } from './store/effects/layout.effects';
import { reducer } from './store/reducers/layout.reducer';

@NgModule({
  imports: [StoreModule.forFeature('layoutFeature', reducer), EffectsModule.forFeature([LayoutEffects])],
  exports: [],
  declarations: [],
  providers: [LayoutService]
})
export class LayoutModule {}
