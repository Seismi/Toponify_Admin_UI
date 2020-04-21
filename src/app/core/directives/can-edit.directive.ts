import { Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { State as UserState } from '@app/home/store/reducers/home.reducers';
import { getMyRoles } from '@app/home/store/selectors/home.selectors';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Roles } from './by-role.directive';

@Directive({
  selector: '[appCanEdit]'
})
export class CanEditDirective implements OnInit {
  userStoreSubscription: Subscription;
  roles = [];

  @Input()
  set appCanEdit(roles: Roles[]) {
    if (!roles || !roles.length) {
      throw new Error('Roles value is empty or missed');
    }

    this.roles = roles;
  }

  constructor(private viewContainer: ViewContainerRef, private userStore: Store<UserState>) {}

  ngOnInit() {
    this.userStoreSubscription = this.userStore.pipe(select(getMyRoles)).subscribe(userRoles => {
      if (userRoles) {
        let canEdit = false;

        canEdit = this.roles.some(role => !!userRoles.find(userRole => userRole.name === role));

        if (!canEdit) {
          // FIXME: temp patch
          (this.viewContainer as any)._data.componentView.component.canEdit = false;
        }
      }
    });
  }
}
