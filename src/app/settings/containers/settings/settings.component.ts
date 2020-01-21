import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { LoadUserRoles } from '@app/settings/store/actions/user.actions';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';

@Component({
  selector: 'smi-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public selectedTabIndex: number;

  constructor(private router: Router, private userStore: Store<UserState>, private teamStore: Store<TeamState>) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/settings') {
          return this.router.navigate(['/settings/my-user']);
        }
        if (event.url.includes('/my-user')) {
          return (this.selectedTabIndex = 0);
        } else if (event.url.includes('/teams')) {
          return (this.selectedTabIndex = 1);
        } else if (event.url.includes('/all-users')) {
          return (this.selectedTabIndex = 2);
        } else {
          return (this.selectedTabIndex = 3);
        }
      }
    });
  }

  ngOnInit(): void {
    this.userStore.dispatch(new LoadUserRoles());
    this.teamStore.dispatch(new LoadTeams({}));
  }

  onTabClick(event: MatTabChangeEvent): Promise<boolean> {
    const url = event.tab.textLabel.toLowerCase().replace(' ', '-');
    return this.router.navigate([`/settings/${url}`]);
  }
}
