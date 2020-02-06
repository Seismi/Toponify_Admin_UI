import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers, reducers } from './core/store';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app.routing';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from '@app/core/custom-serializer';
import { MatIconModule } from '@angular/material';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material';
import { AttributesModule } from './attributes/attributes.module';
import { reducer as workpackageReducer } from '@app/workpackage/store/reducers/workpackage.reducer';
import { WorkPackageEffects } from '@app/workpackage/store/effects/workpackage.effects';
import { WorkPackageNodeEffects } from '@app/workpackage/store/effects/workpackage-node.effects';
import { WorkPackageLinkEffects } from '@app/workpackage/store/effects/workpackage-link.effects';
import { NodeEffects } from '@app/architecture/store/effects/node.effects';
import { reducer as architectureReducer } from '@app/architecture/store/reducers/architecture.reducer';

@NgModule({
  imports: [
    BrowserModule,
    MatSnackBarModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    CoreModule,
    AttributesModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      name: 'NgRx Store DevTools',
      logOnly: environment.production,
      maxAge: 20 // Retains last 20 states
    }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer
    }),
    MatIconModule,
    StoreModule.forFeature('workpackageFeature', workpackageReducer),
    EffectsModule.forFeature([WorkPackageEffects, WorkPackageNodeEffects, WorkPackageLinkEffects]),
    StoreModule.forFeature('architectureFeature', architectureReducer),
    EffectsModule.forFeature([NodeEffects])
  ],
  declarations: [AppComponent],
  providers: [{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3500 } }],
  bootstrap: [AppComponent]
})
export class AppModule {}
