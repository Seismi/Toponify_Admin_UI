import { Component, OnInit, ViewChild } from '@angular/core';
import { MyUserFormService } from '@app/settings/components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '@app/settings/components/my-user-form/services/my-user-form-validator.service';
import { Observable, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { UsersTableComponent } from '@app/settings/components/users-table/users-table.component';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { State as UserState} from '../../store/reducers/user.reducer'
import { User,  } from '@app/settings/store/models/user.model';
import { LoadUsers, UpdateUser, AddUser } from '@app/settings/store/actions/user.actions';
import { getUsers, getUserSelected, getLoading } from '@app/settings/store/selectors/user.selector';
import { LoadTeams } from '@app/settings/store/actions/team.actions';

@Component({
    selector: 'smi-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss'],
    providers: [MyUserFormService, MyUserFormValidatorService]
})

export class SettingsComponent implements OnInit {
    loading$: Observable<boolean>;
    users$: Observable<User[]>;
    userSubscription: Subscription;
    user: User;
    showButtons = true;

    get myUserForm(): FormGroup {
        return this.myUserFormService.myUserForm;
    }

    constructor(private store: Store<UserState>,
                private myUserFormService: MyUserFormService,
                public dialog: MatDialog) {}

    ngOnInit() {
        this.store.dispatch(new LoadUsers({}));
        this.store.dispatch(new LoadTeams({}));
        this.loading$ = this.store.pipe(select(getLoading));
        this.users$ = this.store.pipe(select(getUsers));
    }

    ngOnDestroy() {
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
    }

    @ViewChild(UsersTableComponent) AllUsersTableComponent: UsersTableComponent;

    onSearchUser(filterValue: string){
        this.AllUsersTableComponent.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onEditUser(id: string){
        this.userSubscription = this.store.pipe(select(getUserSelected, {id: id})).subscribe(value => {
            this.user = value;
        });

        const dialogRef = this.dialog.open(UserModalComponent, {
            disableClose: false,
            width: 'auto',
            data: {
              mode: 'edit',
              user: { ...this.user[0] }
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.user) {
              this.store.dispatch(new UpdateUser(data.user));
            }
        });
    }

    onAddUser(){
        const dialogRef = this.dialog.open(UserModalComponent, {
            disableClose: false,
            width: 'auto',
            data: {
                mode: 'add'
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.user) {
              this.store.dispatch(new AddUser(data.user));
            }
        });
    }
}
