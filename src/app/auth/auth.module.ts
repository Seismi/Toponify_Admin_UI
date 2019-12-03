import { NgModule } from '@angular/core';
import { LoginComponent } from './containers/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatGridListModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth.routing.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/effects/auth.effects';
import { JWTInterceptor } from './services/jwt-interceptor.service';
import { ErrorInterceptor } from './services/error-Interceptor.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  imports: [
    HttpClientModule,
    MatIconModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthEffects])
  ],
  exports: [LoginComponent],
  declarations: [LoginComponent],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class AuthModule {}
