import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { LoadUser, UpdateUser, LoadUserRoles } from '@app/settings/store/actions/user.actions';
import { FormGroup } from '@angular/forms';
import { MyUserFormService } from '@app/settings/components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '@app/settings/components/my-user-form/services/my-user-form-validator.service';
import { getUserSelected, getUserRolesEntities } from '@app/settings/store/selectors/user.selector';
import { User, RolesEntity } from '@app/settings/store/models/user.model';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';

@Component({
  selector: 'app-all-users-details',
  templateUrl: './all-users-details.component.html',
  styleUrls: ['./all-users-details.component.scss'],
  providers: [MyUserFormService, MyUserFormValidatorService]
})
export class AllUsersDetailsComponent implements OnInit, OnDestroy {

  public team: TeamEntity[];
  public role: RolesEntity[];
  public subscriptions: Subscription[] = [];
  public user: User;
  public isEditable: boolean = false;

  constructor(
    private myUserFormService: MyUserFormService,
    private route: ActivatedRoute,
    private store: Store<UserState>
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const userId = params['userId'];
        this.store.dispatch(new LoadUser(userId));
        this.store.dispatch(new LoadUserRoles());
      })
    );
 
    this.subscriptions.push(
      this.store.pipe(select(getTeamEntities)).subscribe(team => this.team = team)
    )

    this.subscriptions.push(
      this.store.pipe(select(getUserRolesEntities)).subscribe(role => this.role = role)
    )

    this.subscriptions.push(
      this.store.pipe(select(getUserSelected)).subscribe(data => {
        this.user = data;
        if (data) {
          this.myUserFormService.myUserForm.patchValue({...data});
          this.isEditable = false;
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get myUserForm(): FormGroup {
    return this.myUserFormService.myUserForm;
  }

  onEditUser(): void {
    this.isEditable = true;
  }

  onSaveUser(): void {
    if (this.myUserForm.invalid) {
      return;
    }
    this.store.dispatch(new UpdateUser({id: this.user.id, data: this.myUserForm.value}));
    this.isEditable = false;
  }

  onCancelEdit(): void {
    this.isEditable = false;
  }

}