import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { WorkPackageEntity, WorkPackagesActive, currentArchitecturePackageId } from '@app/workpackage/store/models/workpackage.models';
import { WorkPackageDetailService } from '../../components/workpackage-detail/services/workpackage-detail.service';
import { WorkPackageValidatorService } from '../../components/workpackage-detail/services/workpackage-detail-validator.service';
import { Observable, Subscription } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { select, Store } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { State as WorkPackageState } from '../../store/reducers/workpackage.reducer';
import { getAllWorkPackages, workpackageLoading, getWorkPackagesActive } from '@app/workpackage/store/selectors/workpackage.selector';
import { LoadWorkPackagesActive } from '@app/workpackage/store/actions/workpackage.actions';
import { map } from 'rxjs/operators';
import { SelectModalComponent } from '@app/core/layout/components/select-modal/select-modal.component';
import { State as HomeState } from '@app/home/store/reducers/home.reducers';
import { LoadMyProfile } from '@app/home/store/actions/home.actions';
import { getMyProfile } from '@app/home/store/selectors/home.selectors';

const CurrentStateWorkPackage = [
  {
    id: currentArchitecturePackageId,
    name: 'Current State'
  }
];

@Component({
  selector: 'smi-workpackage-modal',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService]
})
export class WorkPackageModalComponent implements OnInit, OnDestroy {
  public baselineData: WorkPackagesActive[] = CurrentStateWorkPackage;
  public owners$: Observable<TeamEntity[]>;
  public baseline$: Observable<WorkPackageEntity[]>;
  public workpackage: WorkPackageEntity;
  public modalMode = true;
  public isEditable = true;
  public newBaselineData = [];
  loading$: Observable<boolean>;
  public subscription: Subscription;
  public defaultTeams: TeamEntity[];

  constructor(
    private homeStore: Store<HomeState>,
    private dialog: MatDialog,
    private teamStore: Store<TeamState>,
    private workPackageStore: Store<WorkPackageState>,
    private workPackageDetailService: WorkPackageDetailService,
    public dialogRef: MatDialogRef<WorkPackageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.homeStore.dispatch(new LoadMyProfile());
    this.teamStore.dispatch(new LoadTeams({}));
    this.owners$ = this.teamStore.pipe(select(getTeamEntities));
    this.baseline$ = this.workPackageStore.pipe(select(getAllWorkPackages));
    this.loading$ = this.workPackageStore.pipe(select(workpackageLoading));

    this.subscription = this.homeStore.pipe(select(getMyProfile)).subscribe(profile =>
      this.defaultTeams = profile.team.filter(team => !team.disabled)
    );
    this.workPackageDetailService.workPackageDetailForm.controls['owners'].setValue(this.defaultTeams ? this.defaultTeams : null);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get workPackageDetailForm(): FormGroup {
    return this.workPackageDetailService.workPackageDetailForm;
  }

  onSubmit(): void {
    const baseline = this.baselineData;
    if (!this.workPackageDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ workpackage: this.workPackageDetailForm.value, baseline });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddBaseline(): void {
    this.workPackageStore.dispatch(new LoadWorkPackagesActive());
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '400px',
      data: {
        title: 'Select work package to add to baseline',
        placeholder: 'Work Packages',
        options$: this.workPackageStore.pipe(select(getWorkPackagesActive))
          .pipe(
            map(workpackages =>
              workpackages.filter(wp => !this.baselineData.map(b => b.id).includes(wp.id))
            )
          ),
        selectedIds: this.baselineData ? this.baselineData.map(baseline => baseline.id) : []
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        data.value.forEach(element => this.newBaselineData.push(element));
        const newData = this.baselineData.concat(this.newBaselineData);
        return this.baselineData = newData.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i);
      }
    });
  }

  onDeleteBaseline(baseline: WorkPackagesActive): WorkPackagesActive[] {
    const index = this.baselineData.findIndex(obj => obj.id === baseline.id);
    const newData = [...this.baselineData.slice(0, index), ...this.baselineData.slice(index + 1)];
    return this.baselineData = newData;
  }

}
