import { NgModule } from '@angular/core';

import { reducer } from './store/reducers/node.reducer';
import { StoreModule } from '@ngrx/store';
import { NodeService } from './services/node.service';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from './store/effects/node.effects';

@NgModule({
  imports: [StoreModule.forFeature('nodeFeature', reducer), EffectsModule.forFeature([NodeEffects])],
  exports: [],
  declarations: [],
  providers: [NodeService]
})
export class NodeModule {}
