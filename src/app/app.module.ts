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
import { SharedService } from './services/shared-service';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from '@app/core/custom-serializer';
import { MatSnackBarModule } from '@angular/material';

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
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      name: 'NgRx Store DevTools',
      logOnly: environment.production,
      maxAge: 20 // Retains last 20 states
    }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer
    })
  ],
  declarations: [AppComponent],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule {}
