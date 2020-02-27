import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'smi-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onLogOut() {
    this.authService.logout();
  }
}
