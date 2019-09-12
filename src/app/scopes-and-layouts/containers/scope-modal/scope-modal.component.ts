import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { ScopesDetailService } from '@app/scopes-and-layouts/components/scopes-detail/services/scopes-detail.service';
import { ScopesValidatorService } from '@app/scopes-and-layouts/components/scopes-detail/services/scopes-detail-validator.service';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { Actions, ofType } from '@ngrx/effects';
import { ScopeActionTypes } from '@app/scope/store/actions/scope.actions';

@Component({
  selector: 'smi-scope-modal',
  templateUrl: './scope-modal.component.html',
  styleUrls: ['./scope-modal.component.scss'],
  providers: [ScopesDetailService, ScopesValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class ScopeModalComponent implements OnInit {

  isEditable = true;
  modalMode = true;
  teams$: Observable<TeamEntity[]>;
  error: string;

  constructor(
    private actions: Actions,
    private store: Store<TeamState>,
    private scopesDetailService: ScopesDetailService,
    public dialogRef: MatDialogRef<ScopeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.store.dispatch(new LoadTeams({}));
    this.teams$ = this.store.pipe(select(getTeamEntities));
  }

  get scopesDetailForm(): FormGroup {
    return this.scopesDetailService.scopesDetailForm;
  }

  onSave() {
    this.actions.pipe(ofType(ScopeActionTypes.AddScopeFailure)).subscribe((error: any) => {
      alert('ERROR: ' + error.payload);
    })
    
    this.dialogRef.close({ scope: this.scopesDetailForm.value });
  }

  onCancel() {
    this.dialogRef.close();
  }
}