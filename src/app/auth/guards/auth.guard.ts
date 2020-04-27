import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoadMyProfile } from '@app/home/store/actions/home.actions';
import { State as UserState } from '@app/home/store/reducers/home.reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userStore: Store<UserState>) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('access_token')) {
      this.userStore.dispatch(new LoadMyProfile());
      return true;
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
