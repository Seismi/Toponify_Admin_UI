import { NgModule } from '@angular/core';
import { ScopeService } from './services/scope.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ScopeEffects } from './store/effects/scope.effects';
import { reducer } from './store/reducers/scope.reducer';

@NgModule({
  imports: [StoreModule.forFeature('scopeFeature', reducer), EffectsModule.forFeature([ScopeEffects])],
  exports: [],
  declarations: [],
  providers: [ScopeService]
})
export class ScopeModule {}
