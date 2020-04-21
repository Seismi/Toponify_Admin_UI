import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { State as UserState } from '@app/home/store/reducers/home.reducers';
import { getMyRoles } from '@app/home/store/selectors/home.selectors';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Roles } from '../directives/by-role.directive';

@Injectable()
export class ByRoleGuard implements CanActivate {
  constructor(private router: Router, private userStore: Store<UserState>) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    return this.userStore.pipe(
      select(getMyRoles),
      filter(data => !!data),
      map(myRoles => {
        const roles = next.data.roles as Roles[];
        let hasAccess = false;

        hasAccess = roles.some(role => !!myRoles.find(userRole => userRole.name === role));

        if (hasAccess) {
          return true;
        }

        this.router.navigate(['error']);
        return false;
      })
    );
  }
}
