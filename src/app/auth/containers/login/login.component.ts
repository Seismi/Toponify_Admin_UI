import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Authenticate } from '@app/auth/store/models/user.model';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../store/reducers';
import * as AuthActions from '../../store/actions/auth.actions';
import { getLoginPageError } from '@app/auth/store/reducers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error: any;

  constructor(private store: Store<fromAuth.State>, private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const returnUrl: string = this.route.snapshot.queryParams['returnUrl'] || '/home';
    const authenticate: Authenticate = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value,
      returnUrl: decodeURI(returnUrl)
    };
    this.store.dispatch(new AuthActions.Login(authenticate));
    this.error = this.store.select(getLoginPageError);
  }
}
