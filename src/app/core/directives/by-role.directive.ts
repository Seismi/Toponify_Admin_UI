import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { State as UserState } from '@app/home/store/reducers/home.reducers';
import { getMyRoles } from '@app/home/store/selectors/home.selectors';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import isEqual from 'lodash.isequal';

export enum Roles {
  ADMIN = 'Administrator',
  ARCHITECT = 'Architect',
  MEMBER = 'Team Member'
}

@Directive({
  selector: '[appByRole]'
})
export class ByRoleDirective implements OnInit, OnDestroy {
  userStoreSubscription: Subscription;

  @Input()
  set appByRole(roles: Roles[]) {
    if (!roles || !roles.length) {
      throw new Error('Roles value is empty or missed');
    }

    this.roles = roles;
  }

  roles = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userStore: Store<UserState>
  ) {}

  ngOnInit() {
    this.userStoreSubscription = this.userStore
      .pipe(
        select(getMyRoles),
        distinctUntilChanged(isEqual)
      )
      .subscribe(userRoles => {
        if (userRoles) {
          let hasAccess = false;

          hasAccess = this.roles.some(role => !!userRoles.find(userRole => userRole.name === role));

          if (hasAccess) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainer.clear();
          }
        } else {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy() {
    this.userStoreSubscription.unsubscribe();
  }
}
