import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { WorkPackageDetailService } from '../../components/workpackage-detail/services/workpackage-detail.service';
import { WorkPackageValidatorService } from '../../components/workpackage-detail/services/workpackage-detail-validator.service';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { State as WorkPackageState } from '../../store/reducers/workpackage.reducer';
import { AddWorkPackageEntity } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';

@Component({
  selector: 'smi-workpackage-modal',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class WorkPackageModalComponent implements OnInit {

  public owners$: Observable<TeamEntity[]>;
  public baseline$: Observable<WorkPackageEntity[]>;
  public workpackage: WorkPackageEntity;
  public modalMode: boolean = true;
  public isEditable: boolean = true;
  public selectedOwners = [];
  public selectedBaseline = [];

  constructor(
    private teamStore: Store<TeamState>,
    private workPackageStore: Store<WorkPackageState>,
    private WorkPackageDetailService: WorkPackageDetailService,
    public dialogRef: MatDialogRef<WorkPackageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.workpackage = data.workpackage;
    }

  ngOnInit() {
    this.teamStore.dispatch(new LoadTeams({}));
    this.owners$ = this.teamStore.pipe(select(getTeamEntities));
    this.baseline$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
  }

  get workPackageDetailForm(): FormGroup {
    return this.WorkPackageDetailService.workPackageDetailForm;
  }

  onSubmit(): void {
    if (!this.WorkPackageDetailService.isValid) {
      return;
    }
    
    this.dialogRef.close(        
    this.workPackageStore.dispatch(new AddWorkPackageEntity({
      data: {
        id: null,
        name: this.workPackageDetailForm.value.name,
        description: this.workPackageDetailForm.value.description,
        status: this.workPackageDetailForm.value.status,
        owners: this.selectedOwners,
        baseline: this.selectedBaseline
      }
    })));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
