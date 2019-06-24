import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { User } from '@app/settings/store/models/user.model';
import { Store, select } from '@ngrx/store';
import { State as UserState} from '../../store/reducers/user.reducer';
import { LoadUsers } from '@app/settings/store/actions/user.actions';
import { getUsers } from '@app/settings/store/selectors/user.selector';

@Component({
  selector: 'smi-member-modal',
  templateUrl: './member-modal.component.html',
  styleUrls: ['./member-modal.component.scss']
})
export class MemberModalComponent implements OnInit {

  users$: Observable<User[]>;

  constructor(
    public dialogRef: MatDialogRef<MemberModalComponent>,
    private userStore: Store<UserState>) {}

  ngOnInit() {
    this.userStore.dispatch(new LoadUsers({}));
    this.users$ = this.userStore.pipe(select(getUsers));
  }

  onCancel() {
    this.dialogRef.close();
  }

}