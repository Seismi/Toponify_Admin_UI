import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {
  AddObjective,
  AddOwner,
  AddRadio,
  ApproveWorkpackage,
  DeleteObjective,
  DeleteOwner,
  DeleteRadio,
  DeleteWorkPackageEntity,
  LoadWorkPackage,
  MergeWorkpackage,
  RejectWorkpackage,
  ResetWorkpackage,
  SubmitWorkpackage,
  SupersedeWorkpackage,
  UpdateWorkPackageEntity,
  UpdateCustomProperty,
  DeleteCustomProperty,
  CreateObjective,
  ArchiveWorkPackage,
  LoadWorkPackageBaselineAvailability,
  AddWorkPackageBaseline,
  DeleteWorkPackageBaseline,
  LoadWorkPackages,
  LoadWorkPackagesActive,
  LoadWorkPackagesActiveSuccess
} from '@app/workpackage/store/actions/workpackage.actions';
import { select, Store } from '@ngrx/store';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import {
  getSelectedWorkPackage,
  getWorkPackageBaselineAvailability,
  getAllWorkPackages,
  workpackageDetailsLoading,
  getWorkPackagesActive
} from '@app/workpackage/store/selectors/workpackage.selector';
import { Subscription } from 'rxjs';
import { WorkPackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import {
  Objective,
  OwnersEntityOrApproversEntity,
  TeamEntityOrOwnersEntityOrApproversEntity,
  WorkPackageDetail,
  WorkPackageEntity,
  Baseline,
  currentArchitecturePackageId,
  WorkPackagesActive
} from '@app/workpackage/store/models/workpackage.models';
import { WorkPackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { RadioListModalComponent } from '../radio-list-modal/radio-list-modal.component';
import { AddRadioEntity, RadioActionTypes } from '@app/radio/store/actions/radio.actions';
import { RadioModalComponent } from '@app/radio/containers/radio-modal/radio-modal.component';
import { Actions, ofType } from '@ngrx/effects';
import { RadioEntity, RadioDetail } from '@app/radio/store/models/radio.model';
import { RadioDetailModalComponent } from '@app/workpackage/containers/radio-detail-modal/radio-detail-modal.component';
import { CustomPropertyValuesEntity } from '@app/architecture/store/models/node.model';
import { DeleteRadioPropertyModalComponent } from '@app/radio/containers/delete-property-modal/delete-property-modal.component';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { getWorkPackagesQueryParams } from '@app/core/store/selectors/route.selectors';
import { map, take } from 'rxjs/operators';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { AddObjectiveModalComponent } from '@app/workpackage/components/add-objective-modal/add-objective-modal.component';
import { MoveObjectiveModalComponent } from '@app/workpackage/components/move-objective-modal/move-objective-modal.component';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';
import { SelectModalComponent } from '@app/core/layout/components/select-modal/select-modal.component';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { Roles } from '@app/core/directives/by-role.directive';
import { SingleSelectModalComponent } from '@app/core/layout/components/single-select-modal/single-select-modal.component';

@Component({
  selector: 'app-workpackage-details',
  templateUrl: './workpackage-details.component.html',
  styleUrls: ['./workpackage-details.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService]
})
export class WorkpackageDetailsComponent implements OnInit, OnDestroy {
  public Roles = Roles;
  public currentState = currentArchitecturePackageId;
  public workpackage: WorkPackageDetail;
  public subscriptions: Subscription[] = [];
  public workpackageId: string;
  public owner: OwnersEntityOrApproversEntity;
  public isEditable = false;
  public workPackageColour: string;
  public workPackageStatus: string;
  public isLoading: boolean;

  constructor(
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    private router: Router,
    private actions: Actions,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private teamStore: Store<TeamState>,
    private store: Store<WorkPackageState>,
    private workPackageDetailService: WorkPackageDetailService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(workpackageDetailsLoading)).subscribe((loading) => this.isLoading = loading)
    );
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const workpackageId = params['workpackageId'];
        this.workpackageId = workpackageId;
        this.store.dispatch(new LoadWorkPackage(workpackageId));
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(RadioActionTypes.AddReplySuccess)).subscribe(_ => {
        this.store.dispatch(new LoadWorkPackage(this.workpackageId));
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getSelectedWorkPackage)).subscribe(workpackage => {
        if (workpackage) {
          this.workpackage = workpackage;
          this.workPackageDetailService.workPackageDetailForm.patchValue({ ...workpackage });
          this.workPackageStatus = workpackage.status;
          this.isEditable = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get workPackageDetailForm(): FormGroup {
    return this.workPackageDetailService.workPackageDetailForm;
  }

  onSaveWorkpackage(): void {
    this.store.dispatch(
      new UpdateWorkPackageEntity({
        entityId: this.workpackageId,
        workPackage: {
          data: {
            id: this.workpackageId,
            name: this.workPackageDetailForm.value.name,
            description: this.workPackageDetailForm.value.description,
            displayColour: this.workPackageColour
          }
        }
      })
    );
    this.isEditable = false;
  }

  onEditWorkPackage(): void {
    this.isEditable = true;
  }

  onCancel(): void {
    this.isEditable = false;
  }

  onDeleteWorkpackage(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: `Are your sure you want to delete "${this.workpackage.name}" workpackage?`
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new DeleteWorkPackageEntity(this.workpackageId));
        this.router.navigate(['work-packages'], { queryParamsHandling: 'preserve' });
      }
    });
  }

  onAddOwner(): void {
    const ids = new Set(this.workpackage.owners.map(({ id }) => id));
    this.teamStore.dispatch(new LoadTeams({}));
    const dialogRef = this.dialog.open(SingleSelectModalComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '400px',
      data: {
        title: 'Select owner to add to owners',
        label: 'Owners',
        options$: this.teamStore.pipe(select(getTeamEntities)).pipe(map(data => data.filter(({ id }) => !ids.has(id))))
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.store.dispatch(
          new AddOwner({
            workPackageId: this.workpackageId,
            ownerId: data.value.id,
            owners: data.value
          })
        );
      }
    });
  }

  onDeleteOwner(owner: TeamEntityOrOwnersEntityOrApproversEntity): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: `Are your sure you want to delete "${owner.name}" owner?`
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new DeleteOwner({ workPackageId: this.workpackageId, ownerId: owner.id }));
      }
    });
  }

  onAddObjectiveOrRadio(value): void {
    const dialogRef = this.dialog.open(RadioListModalComponent, {
      disableClose: false,
      width: '650px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        if (value.objective) {
          this.store.dispatch(
            new AddObjective({
              workPackageId: this.workpackageId,
              objectiveId: data.radio.id,
              data: data.radio
            })
          );
        } else {
          this.store.dispatch(
            new AddRadio({
              workPackageId: this.workpackageId,
              radioId: data.radio.id,
              data: data.radio
            })
          );
        }
      }
    });

    // Create new radio
    dialogRef.componentInstance.addNewRadio.subscribe(() => {
      const dialogRef2 = this.dialog.open(RadioModalComponent, {
        disableClose: false,
        width: '800px',
        data: {
          selectedNode: null
        }
      });

      dialogRef2.afterClosed().subscribe(data => {
        if (data && data.radio) {
          this.store.dispatch(
            new AddRadioEntity({
              data: {
                title: data.radio.title,
                description: data.radio.description,
                status: data.radio.status,
                category: data.radio.category,
                author: data.radio.author,
                assignedTo: data.radio.assignedTo,
                actionBy: data.radio.actionBy,
                mitigation: data.radio.mitigation,
                frequency: data.radio.frequency,
                severity: data.radio.severity,
                relatesTo: [{ workPackage: { id: this.workpackageId } }]
              }
            })
          );
          this.store.dispatch(new LoadWorkPackage(this.workpackageId));
        }
      });
    });
  }

  onDeleteObjectiveOrRadio(radio: RadioEntity | Objective, value): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: `Are your sure you want to delete "${radio.title}" RADIO?`
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        value.objective
          ? this.store.dispatch(new DeleteObjective({ workPackageId: this.workpackageId, objectiveId: radio.id }))
          : this.store.dispatch(new DeleteRadio({ workPackageId: this.workpackageId, radioId: radio.id }));
      }
    });
  }

  onEditRadio(radio: WorkPackageDetail): void {
    this.dialog.open(RadioDetailModalComponent, {
      disableClose: false,
      width: '900px',
      height: '950px',
      data: {
        radio: radio
      }
    });
  }

  onSaveProperties(data: { propertyId: string; value: string }): void {
    this.store.dispatch(
      new UpdateCustomProperty({
        workPackageId: this.workpackageId,
        customPropertyId: data.propertyId,
        data: data.value
      })
    );
  }

  onDeleteProperties(customProperty: CustomPropertyValuesEntity): void {
    const dialogRef = this.dialog.open(DeleteRadioPropertyModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: customProperty.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(
          new DeleteCustomProperty({
            workPackageId: this.workpackageId,
            customPropertyId: customProperty.propertyId
          })
        );
      }
    });
  }

  onOpenWorkPackage(): void {
    this.router.navigate(['/topology'], { queryParamsHandling: 'preserve' }).then(() => {
      this.routerStore
        .select(getWorkPackagesQueryParams)
        .pipe(take(1))
        .subscribe(workpackages => {
          let urlWorkpackages: string[];
          let params: Params;
          if (typeof workpackages === 'string') {
            urlWorkpackages = [workpackages];
          } else {
            urlWorkpackages = workpackages ? [...workpackages] : [];
          }
          const index = urlWorkpackages.findIndex(id => id === this.workpackage.id);
          if (this.workpackage) {
            if (index === -1) {
              params = { workpackages: [...urlWorkpackages, this.workpackage.id] };
            } else {
              params = { workpackages: [...urlWorkpackages] };
            }
          } else {
            if (index !== -1) {
              urlWorkpackages.splice(index, 1);
            }
            params = { workpackages: [...urlWorkpackages] };
          }
          this.routerStore.dispatch(new UpdateQueryParams(params));
        });
    });
  }

  submitWorkpackage(): void {
    this.store.dispatch(new SubmitWorkpackage(this.workpackageId));
  }

  approveWorkpackage(): void {
    this.store.dispatch(new ApproveWorkpackage(this.workpackageId));
  }

  rejectWorkpackage(): void {
    this.store.dispatch(new RejectWorkpackage(this.workpackageId));
  }

  mergeWorkpackage(): void {
    this.store.dispatch(new MergeWorkpackage(this.workpackageId));
  }

  resetWorkpackage(): void {
    this.store.dispatch(new ResetWorkpackage(this.workpackageId));
  }

  supersedeWorkpackage(): void {
    this.store.dispatch(new SupersedeWorkpackage(this.workpackageId));
  }

  onSelectWorkPackageColour(colour: string): void {
    this.workPackageColour = colour;
  }

  onAddObjective() {
    const dialogRef = this.dialog.open(AddObjectiveModalComponent, {
      disableClose: false,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new CreateObjective({ data: data, workPackageId: this.workpackageId }));
      }
    });
  }

  onMoveObjective(objective: Objective) {
    const dialogRef = this.dialog.open(MoveObjectiveModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((selectedWorkpackage: WorkPackagesActive) => {
      if (selectedWorkpackage) {
        this.store.dispatch(
          new AddObjective({ data: objective, workPackageId: selectedWorkpackage.id, objectiveId: objective.id })
        );
        this.store.dispatch(new DeleteObjective({ workPackageId: this.workpackageId, objectiveId: objective.id }));
      }
    });
  }

  onArchiveWorkPackage(): void {
    this.store.dispatch(
      new ArchiveWorkPackage({
        workPackageId: this.workpackageId,
        archived: this.workpackage.archived ? false : true
      })
    );
  }

  onAddBaseline(): void {
    this.store.dispatch(new LoadWorkPackageBaselineAvailability({ workPackageId: this.workpackageId }));
    const dialogRef = this.dialog.open(SingleSelectModalComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '400px',
      data: {
        title: 'Select work package to add to baseline',
        label: 'Work Packages',
        options$: this.store.pipe(select(getWorkPackageBaselineAvailability))
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.store.dispatch(
          new AddWorkPackageBaseline({
            workPackageId: this.workpackageId,
            baselineId: data.value.id
          })
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  onDeleteBaseline(baseline: Baseline): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure you want to remove the work package from the baseline?',
        confirmBtn: 'Yes',
        cancelBtn: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(
          new DeleteWorkPackageBaseline({
            workPackageId: this.workpackageId,
            baselineId: baseline.id
          })
        );
      }
    });
  }
}
