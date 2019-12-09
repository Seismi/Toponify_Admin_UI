import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'smi-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public selectedTabIndex: number;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        switch(event.url) {
          case '/settings':
            return this.router.navigate(['/settings/my-user']);
          case '/settings/my-user':
            return this.selectedTabIndex = 0;
          case '/settings/teams':
            return this.selectedTabIndex = 1;
          case '/settings/all-users':
            return this.selectedTabIndex = 2;
          case '/settings/organisation':
            return this.selectedTabIndex = 3;
        }
      }
    });
  }

  ngOnInit(): void { }

  onTabClick(event: MatTabChangeEvent): Promise<boolean> {
    const url = event.tab.textLabel.toLowerCase().replace(" ", "-");
    return this.router.navigate([`/settings/${url}`]);
  }

}
