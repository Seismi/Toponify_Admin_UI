import { NgModule } from '@angular/core';
import { UserService } from './services/user.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/effects/user.effects';
import { reducer } from './store/reducers/user.reducer';

@NgModule({
    imports: [
        StoreModule.forFeature('userFeature', reducer),
        EffectsModule.forFeature([UserEffects])
    ],
    exports: [],
    declarations: [],
    providers: [UserService]
})
export class UserModule { }
