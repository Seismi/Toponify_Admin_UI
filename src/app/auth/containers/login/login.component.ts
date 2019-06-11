import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Authenticate } from '@app/auth/store/models/user.model';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../store/reducers';
import * as AuthActions from '../../store/actions/auth.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  loading = false;
  submitted = false;
  error: string;

  constructor(
    private store: Store<fromAuth.State>,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

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
  }

}
