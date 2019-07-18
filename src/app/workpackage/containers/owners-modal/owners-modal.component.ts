import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/scope.selector';
import { OwnersEntityOrApproversEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-owners-modal',
  templateUrl: './owners-modal.component.html',
  styleUrls: ['./owners-modal.component.scss'],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class OwnersModalComponent implements OnInit {

  owners$: Observable<TeamEntity[]>;
  owner: OwnersEntityOrApproversEntity;

  constructor(
    private store: Store<TeamState>,
    public dialogRef: MatDialogRef<OwnersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.owner = data.owner;
    }

  ngOnInit() {
    this.store.dispatch(new LoadTeams({}));
    this.owners$ = this.store.pipe(select(getTeamEntities));
  }

  onSubmit() {
    this.dialogRef.close({ owner: this.owner });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSelectOwner(row) {
    this.owner = row;
  }
}