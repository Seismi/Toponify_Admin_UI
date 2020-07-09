import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { WorkPackageEntity, WorkPackageEntitiesHttpParams } from '@app/workpackage/store/models/workpackage.models';
import { WorkPackageDetailService } from '../../components/workpackage-detail/services/workpackage-detail.service';
import { WorkPackageValidatorService } from '../../components/workpackage-detail/services/workpackage-detail-validator.service';
import { Observable, Subject } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { select, Store } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { State as WorkPackageState } from '../../store/reducers/workpackage.reducer';
import { getAllWorkPackages, getWorkPackagesPage, workpackageLoading } from '@app/workpackage/store/selectors/workpackage.selector';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageDetailComponent } from '@app/workpackage/components/workpackage-detail/workpackage-detail.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  public modalMode = true;
  public isEditable = true;
  loading$: Observable<boolean>;
  search$ = new Subject<string>();
  page$: Observable<any>;
  private workPackageParams: WorkPackageEntitiesHttpParams = {
    textFilter: '',
    page: 0,
    size: 10,
    includeArchived: false
  };

  @ViewChild(WorkPackageDetailComponent) wpComponent: WorkPackageDetailComponent;

  constructor(
    private teamStore: Store<TeamState>,
    private workPackageStore: Store<WorkPackageState>,
    private workPackageDetailService: WorkPackageDetailService,
    public dialogRef: MatDialogRef<WorkPackageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.workPackageStore.dispatch(new LoadWorkPackages(this.workPackageParams));
    this.teamStore.dispatch(new LoadTeams({}));
    this.owners$ = this.teamStore.pipe(select(getTeamEntities));
    this.baseline$ = this.workPackageStore.pipe(select(getAllWorkPackages));
    this.loading$ = this.workPackageStore.pipe(select(workpackageLoading));

    this.search$
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(textFilter => {
      this.workPackageParams = {
        textFilter: textFilter,
        page: 0,
        size: this.workPackageParams.size,
        includeArchived: this.workPackageParams.includeArchived
      };
      this.workPackageStore.dispatch(new LoadWorkPackages(this.workPackageParams));
    });

    this.page$ = this.workPackageStore.pipe(select(getWorkPackagesPage));
  }

  get workPackageDetailForm(): FormGroup {
    return this.workPackageDetailService.workPackageDetailForm;
  }

  onSubmit(): void {
    const baseline = this.wpComponent.selectionTable.selection.selected;
    if (!this.workPackageDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ workpackage: this.workPackageDetailForm.value, baseline });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSearch(textFilter: string): void {
    this.search$.next(textFilter);
  }

  onPageChange(page) {
    this.workPackageParams = {
      textFilter: this.workPackageParams.textFilter,
      page: page.pageIndex,
      size: page.pageSize,
      includeArchived: this.workPackageParams.includeArchived
    };
    this.workPackageStore.dispatch(new LoadWorkPackages(this.workPackageParams));
  }
}
