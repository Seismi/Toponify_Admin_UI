import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { WorkPackageDetailService } from '../../components/workpackage-detail/services/workpackage-detail.service';
import { WorkPackageValidatorService } from '../../components/workpackage-detail/services/workpackage-detail-validator.service';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { select, Store } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { State as WorkPackageState } from '../../store/reducers/workpackage.reducer';
import { getAllWorkPackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';

@Component({
  selector: 'smi-workpackage-modal',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService]
})
export class WorkPackageModalComponent implements OnInit {
  public owners$: Observable<TeamEntity[]>;
  public baseline$: Observable<WorkPackageEntity[]>;
  public workpackage: WorkPackageEntity;
  public modalMode: boolean = true;
  public isEditable: boolean = true;

  constructor(
    private teamStore: Store<TeamState>,
    private workPackageStore: Store<WorkPackageState>,
    private workPackageDetailService: WorkPackageDetailService,
    public dialogRef: MatDialogRef<WorkPackageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.teamStore.dispatch(new LoadTeams({}));
    this.owners$ = this.teamStore.pipe(select(getTeamEntities));
    this.baseline$ = this.workPackageStore.pipe(select(getAllWorkPackages));
  }

  get workPackageDetailForm(): FormGroup {
    return this.workPackageDetailService.workPackageDetailForm;
  }

  onSubmit(): void {
    if (!this.workPackageDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ workpackage: this.workPackageDetailForm.value });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
