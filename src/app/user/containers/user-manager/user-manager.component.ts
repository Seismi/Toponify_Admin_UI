import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AllUsersTableComponent } from './all-users/all-users-table/all-users-table.component';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User } from '../../store/models/user.model';
import * as fromUser from '../../store/reducers';
import * as UserActions from '../../store/actions/user.actions';
import { MyUserFormService } from './my-user/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from './my-user/my-user-form/services/my-user-form-validator.service';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { EditUsersModalComponent } from './all-users/edit-users-modal/edit-users-modal.component';

@Component({
    selector: 'app-my-manager',
    templateUrl: 'user-manager.component.html',
    styleUrls: ['user-manager.component.scss'],
    providers: [MyUserFormService, MyUserFormValidatorService]
})
export class UserManagerComponent implements OnInit, OnDestroy {

    loading$: Observable<boolean>;
    users$: Observable<User[]>;
    userSubscription: Subscription;
    user: User[];
    showButtons = true;

    get myUserForm(): FormGroup {
        return this.myUserFormService.myUserForm;
    }

    constructor(private store: Store<fromUser.UserState>, 
                private myUserFormService: MyUserFormService,
                public dialog: MatDialog) {}

    ngOnInit() {
        this.store.dispatch(new UserActions.LoadUsers());
        this.loading$ = this.store.pipe(select(fromUser.getLoading));
        this.users$ = this.store.pipe(select(fromUser.getUsers));
    }

    ngOnDestroy() {
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
    }

    @ViewChild(AllUsersTableComponent) AllUsersTableComponent: AllUsersTableComponent;

    onSearchUser(filterValue: string){
        this.AllUsersTableComponent.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onEditUser(id: string){
        this.userSubscription = this.store.pipe(select(fromUser.getUserById(id))).subscribe(value => {
            this.user = value;
        });

        const dialogRef = this.dialog.open(EditUsersModalComponent, {
            disableClose: false,
            width: 'auto',
            data: {
              mode: 'edit',
              user: { ...this.user[0] }
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.user) {
              this.store.dispatch(new UserActions.UpdateUser({ data: data.user }));
            }
        });
    }

    onAddUser(){
        const dialogRef = this.dialog.open(EditUsersModalComponent, {
            disableClose: false,
            width: 'auto',
            data: {
                mode: 'add'
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.user) {
              this.store.dispatch(new UserActions.AddUser({ data: data.user }));
            }
        });
    }

}
