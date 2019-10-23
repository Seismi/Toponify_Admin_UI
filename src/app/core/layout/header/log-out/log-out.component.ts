import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'smi-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss']
})
export class LogOutComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  onLogOut() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnInit() { }

}