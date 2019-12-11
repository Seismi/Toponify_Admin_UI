import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { User } from '@app/settings/store/models/user.model';
import { Store, select } from '@ngrx/store';
import { State as UserState } from '../../store/reducers/user.reducer';
import { getUsers } from '@app/settings/store/selectors/user.selector';
import { MembersEntity } from '@app/settings/store/models/team.model';
import { LoadUsers } from '@app/settings/store/actions/user.actions';

@Component({
  selector: 'smi-member-modal',
  templateUrl: './member-modal.component.html',
  styleUrls: ['./member-modal.component.scss'],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class MemberModalComponent implements OnInit {
  public users$: Observable<User[]>;
  public member: MembersEntity;

  constructor(
    public dialogRef: MatDialogRef<MemberModalComponent>,
    private store: Store<UserState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.member = data.member;
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadUsers({}));
    this.users$ = this.store.pipe(select(getUsers));
  }

  onSelectMember(user: User): void {
    this.member = user;
  }

  onSave(): void {
    this.dialogRef.close({ member: this.member });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
