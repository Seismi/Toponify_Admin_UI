import { NgModule } from '@angular/core';
import { TeamService } from './services/team.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TeamEffects } from './store/effects/team.effects';
import { reducer } from './store/reducers/team.reducer';

@NgModule({
    imports: [
        StoreModule.forFeature('teamFeature', reducer),
        EffectsModule.forFeature([TeamEffects])
    ],
    exports: [],
    declarations: [],
    providers: [TeamService]
})
export class TeamModule { }
