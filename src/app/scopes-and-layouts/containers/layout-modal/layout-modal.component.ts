import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { FormGroup } from '@angular/forms';
import { LayoutsDetailService } from '@app/scopes-and-layouts/components/layouts-detail/services/layouts-detail.service';
import { LayoutsValidatorService } from '@app/scopes-and-layouts/components/layouts-detail/services/layouts-detail-validator.service';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { AddLayout, LayoutActionTypes } from '@app/layout/store/actions/layout.actions';
import { SharedService } from '@app/services/shared-service';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'smi-layout-modal',
  templateUrl: './layout-modal.component.html',
  styleUrls: ['./layout-modal.component.scss'],
  providers: [LayoutsDetailService, LayoutsValidatorService]
})
export class LayoutModalComponent implements OnInit {
  isEditable = true;
  modalMode = true;
  teams$: Observable<TeamEntity[]>;
  error: string;
  scope: any;

  constructor(
    private sharedService: SharedService,
    private actions: Actions,
    private layoutsDetailService: LayoutsDetailService,
    private store: Store<TeamState>,
    public dialogRef: MatDialogRef<LayoutModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.scope = data.scope;
  }

  ngOnInit() {
    this.store.dispatch(new LoadTeams({}));
    this.teams$ = this.store.pipe(select(getTeamEntities));
  }

  get layoutsDetailForm(): FormGroup {
    return this.layoutsDetailService.layoutsDetailForm;
  }

  onSave() {
    this.store.dispatch(
      new AddLayout({
        id: null,
        name: this.layoutsDetailForm.value.name,
        owners: this.sharedService.selectedOwners,
        viewers: this.sharedService.selectedViewers,
        scope: this.scope
      })
    );

    // Error
    this.actions.pipe(ofType(LayoutActionTypes.AddLayoutFailure)).subscribe((error: any) => {
      this.error = error.payload;
    });

    // Success
    this.actions.pipe(ofType(LayoutActionTypes.AddLayoutSuccess)).subscribe(() => {
      this.dialogRef.close();
    });

    this.sharedService.selectedOwners = [];
    this.sharedService.selectedViewers = [];
  }

  onCancel() {
    this.dialogRef.close();
    this.sharedService.selectedOwners = [];
    this.sharedService.selectedViewers = [];
  }
}
