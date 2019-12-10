import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  WorkPackageActionTypes
} from '@app/workpackage/store/actions/workpackage.actions';
import { select, Store } from '@ngrx/store';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkPackage } from '@app/workpackage/store/selectors/workpackage.selector';
import { Subscription } from 'rxjs';
import { WorkPackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import {
  OwnersEntityOrApproversEntity,
  TeamEntityOrOwnersEntityOrApproversEntity,
  WorkPackageDetail
} from '@app/workpackage/store/models/workpackage.models';
import { WorkPackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { DeleteWorkPackageModalComponent } from '../delete-workpackage-modal/delete-workpackage.component';
import { MatDialog } from '@angular/material';
import { OwnersModalComponent } from '../owners-modal/owners-modal.component';
import { RadioListModalComponent } from '../radio-list-modal/radio-list-modal.component';
import { AddRadioEntity, RadioActionTypes } from '@app/radio/store/actions/radio.actions';
import { RadioModalComponent } from '@app/radio/containers/radio-modal/radio-modal.component';
import { RadioEffects } from '@app/radio/store/effects/radio.effects';
import { Actions, ofType } from '@ngrx/effects';
import { RadioEntity } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'app-workpackage-details',
  templateUrl: './workpackage-details.component.html',
  styleUrls: ['./workpackage-details.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService]
})
export class WorkpackageDetailsComponent implements OnInit, OnDestroy {
  public workpackage: WorkPackageDetail;
  public subscriptions: Subscription[] = [];
  public workpackageId: string;
  public owner: OwnersEntityOrApproversEntity;
  public statusDraft: boolean;
  public isEditable = false;
  public workpackageActionSubmit: boolean;
  public workpackageActionApprove: boolean;
  public workpackageActionReject: boolean;
  public workpackageActionMerge: boolean;
  public workpackageActionReset: boolean;
  public workpackageActionSupersede: boolean;

  constructor(
    private router: Router,
    private actions: Actions,
    private radioEffects: RadioEffects,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store<WorkPackageState>,
    private workPackageDetailService: WorkPackageDetailService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const workpackageId = params['workpackageId'];
        this.workpackageId = workpackageId;
        this.store.dispatch(new LoadWorkPackage(workpackageId));
      })
    );
    this.subscriptions.push(
      this.store.pipe(select(getSelectedWorkPackage)).subscribe(workpackage => {
        this.workpackage = workpackage;
        if (workpackage) {
          this.workPackageDetailService.workPackageDetailForm.patchValue({
            name: workpackage.name,
            description: workpackage.description
          });
          // Show edit button if work package status is draft
          workpackage.status === 'draft' ? (this.statusDraft = true) : (this.statusDraft = false);
          this.isEditable = false;

          workpackage.availableActions.merge
            ? (this.workpackageActionMerge = true)
            : (this.workpackageActionMerge = false);
          workpackage.availableActions.reset
            ? (this.workpackageActionReset = true)
            : (this.workpackageActionReset = false);
          workpackage.availableActions.reject
            ? (this.workpackageActionReject = true)
            : (this.workpackageActionReject = false);
          workpackage.availableActions.submit
            ? (this.workpackageActionSubmit = true)
            : (this.workpackageActionSubmit = false);
          workpackage.availableActions.approve
            ? (this.workpackageActionApprove = true)
            : (this.workpackageActionApprove = false);
          workpackage.availableActions.supersede
            ? (this.workpackageActionSupersede = true)
            : (this.workpackageActionSupersede = false);
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
            description: this.workPackageDetailForm.value.description
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
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: this.workpackage.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(new DeleteWorkPackageEntity(this.workpackageId));
        this.router.navigate(['work-packages'], { queryParamsHandling: 'preserve' });
      }
    });
  }

  onAddOwner(): void {
    const dialogRef = this.dialog.open(OwnersModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.owner) {
        this.store.dispatch(
          new AddOwner({
            workPackageId: this.workpackageId,
            ownerId: data.owner.id,
            owners: data.owner
          })
        );
      }
    });
  }

  onDeleteOwner(owner: TeamEntityOrOwnersEntityOrApproversEntity): void {
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: owner.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(new DeleteOwner({ workPackageId: this.workpackageId, ownerId: owner.id }));
      }
    });
  }

  onAddObjectiveOrRadio(value): void {
    const dialogRef = this.dialog.open(RadioListModalComponent, {
      disableClose: false,
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        if (value.objective) {
          this.store.dispatch(
            new AddObjective({
              workPackageId: this.workpackageId,
              radioId: data.radio.id,
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
        disableClose: false
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
                relatesTo: [{ workPackage: { id: this.workpackageId } }]
              }
            })
          );

          // Add objective or radio to workpackage after new radio is created
          this.subscriptions.push(
            this.actions.pipe(ofType(RadioActionTypes.AddRadioSuccess)).subscribe(() => {
              if (value.objective) {
                this.store.dispatch(
                  new AddObjective({
                    workPackageId: this.workpackageId,
                    radioId: this.radioEffects.radioId,
                    data: data.radio
                  })
                );
              } else {
                this.store.dispatch(
                  new AddRadio({
                    workPackageId: this.workpackageId,
                    radioId: this.radioEffects.radioId,
                    data: data.radio
                  })
                );
              }
            })
          );
        }
      });
    });
  }

  onDeleteObjectiveOrRadio(radio: RadioEntity, value): void {
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: radio.title
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        value.objective
          ? this.store.dispatch(new DeleteObjective({ workPackageId: this.workpackageId, radioId: radio.id }))
          : this.store.dispatch(new DeleteRadio({ workPackageId: this.workpackageId, radioId: radio.id }));
      }
    });
  }

  submitWorkpackage(): void {
    this.actions.pipe(ofType(WorkPackageActionTypes.SubmitWorkpackageFailure)).subscribe((error: any) => {
      alert('ERROR: ' + error.payload);
    });
    this.store.dispatch(new SubmitWorkpackage(this.workpackageId));
  }

  approveWorkpackage(): void {
    this.actions.pipe(ofType(WorkPackageActionTypes.ApproveWorkpackageFailure)).subscribe((error: any) => {
      alert('ERROR: ' + error.payload);
    });
    this.store.dispatch(new ApproveWorkpackage(this.workpackageId));
  }

  rejectWorkpackage(): void {
    this.actions.pipe(ofType(WorkPackageActionTypes.RejectWorkpackageFailure)).subscribe((error: any) => {
      alert('ERROR: ' + error.payload);
    });
    this.store.dispatch(new RejectWorkpackage(this.workpackageId));
  }

  mergeWorkpackage(): void {
    this.actions.pipe(ofType(WorkPackageActionTypes.MergeWorkpackageFailure)).subscribe((error: any) => {
      alert('ERROR: ' + error.payload);
    });
    this.store.dispatch(new MergeWorkpackage(this.workpackageId));
  }

  resetWorkpackage(): void {
    this.actions.pipe(ofType(WorkPackageActionTypes.ResetWorkpackageFailure)).subscribe((error: any) => {
      alert('ERROR: ' + error.payload);
    });
    this.store.dispatch(new ResetWorkpackage(this.workpackageId));
  }

  supersedeWorkpackage(): void {
    this.actions.pipe(ofType(WorkPackageActionTypes.SupersedeWorkpackageFailure)).subscribe((error: any) => {
      alert('ERROR: ' + error.payload);
    });
    this.store.dispatch(new SupersedeWorkpackage(this.workpackageId));
  }
}
