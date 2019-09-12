import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { User } from '@app/settings/store/models/user.model';
import { Store, select } from '@ngrx/store';
import { State as UserState} from '../../store/reducers/user.reducer';
import { getUsers } from '@app/settings/store/selectors/user.selector';
import { MembersEntity } from '@app/settings/store/models/team.model';

@Component({
  selector: 'smi-member-modal',
  templateUrl: './member-modal.component.html',
  styleUrls: ['./member-modal.component.scss'],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class MemberModalComponent implements OnInit {

  users$: Observable<User[]>;
  member: MembersEntity;

  constructor(
    public dialogRef: MatDialogRef<MemberModalComponent>,
    private userStore: Store<UserState>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.member = data.member;
    }

  ngOnInit() {
    this.users$ = this.userStore.pipe(select(getUsers));
  }

  onSelectMember(row: MembersEntity) {
    this.member = row;
  }

  onAdd() {
    this.dialogRef.close({ member: this.member });
  }

  onCancel() {
    this.dialogRef.close();
  }

}