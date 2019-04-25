import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss']
})
export class ProfileActionsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  userSettings() {
    console.log('user settings');
  }

  logout() {
    console.log('logout');
  }
}
