import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { ScopesDetailService } from '@app/scopes-and-layouts/components/scopes-detail/services/scopes-detail.service';
import { ScopesValidatorService } from '@app/scopes-and-layouts/components/scopes-detail/services/scopes-detail-validator.service';
import { ScopeEntity } from '@app/scope/store/models/scope.model';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/scope.selector';
import { ScopeService } from '@app/scope/services/scope.service';
import { Actions, ofType } from '@ngrx/effects';
import { ScopeActionTypes, AddScope } from '@app/scope/store/actions/scope.actions';


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
  selectedOwners = [];
  selectedViewers = [];

  constructor(
    private actions: Actions,
    private scopeService: ScopeService,
    private scopeStore: Store<ScopeState>,
    private store: Store<TeamState>,
    private scopesDetailService: ScopesDetailService,
    public dialogRef: MatDialogRef<ScopeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.store.dispatch(new LoadTeams({}))
    this.teams$ = this.store.pipe(select(getTeamEntities));
  }

  get scopesDetailForm(): FormGroup {
    return this.scopesDetailService.scopesDetailForm;
  }

  onSave() {
    this.scopeStore.dispatch(new AddScope({
      id: null,
      name: this.scopesDetailForm.value.name,
      owners: this.selectedOwners,
      viewers: this.selectedViewers,
      layerFilter: 'system'
    }))

    // Error
    this.actions.pipe(ofType(ScopeActionTypes.AddScopeFailure)).subscribe((error: any) => {
      this.error = error.payload;
    });

    // Success
    this.actions.pipe(ofType(ScopeActionTypes.AddScopeSuccess)).subscribe(() => {
      this.dialogRef.close();
    });

    this.selectedOwners = [];
    this.selectedViewers = [];
  }

  onCancel() {
    this.dialogRef.close();
    this.selectedOwners = [];
    this.selectedViewers = [];
  }
}