import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State as RadioState } from '../../store/reducers/radio.reducer';
import { Observable, Subscription } from 'rxjs';
import { RadioDetail, RelatesTo } from '@app/radio/store/models/radio.model';
import {
  AddReply,
  AssociateRadio,
  DeleteRadioProperty,
  DissociateRadio,
  LoadRadio,
  UpdateRadioProperty,
  DeleteRadioEntity,
  LoadRadioTags,
  AddRadioTags,
  DeleteRadioTags
} from '@app/radio/store/actions/radio.actions';
import { getSelectedRadio, getRadioAvailableTags, getRadioLoadingStatus } from '@app/radio/store/selectors/radio.selector';
import { FormGroup } from '@angular/forms';
import { RadioDetailService } from '@app/radio/components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '@app/radio/components/radio-detail/services/radio-detail-validator.service';
import { MatDialog } from '@angular/material';
import { ReplyModalComponent } from '../reply-modal/reply-modal.component';
import { User } from '@app/settings/store/models/user.model';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { getUsers } from '@app/settings/store/selectors/user.selector';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';
import { DeleteRadioPropertyModalComponent } from '../delete-property-modal/delete-property-modal.component';
import { ConfirmModalComponent } from '@app/radio/components/confirm-modal/confirm-modal.component';
import { AssociateModalComponent } from '@app/radio/components/associate-modal/associate-modal.component';
import { take } from 'rxjs/operators';
import { Tag, LoadingStatus } from '@app/architecture/store/models/node.model';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';
import { CreateTag } from '@app/architecture/store/actions/node.actions';
import { Actions, ofType } from '@ngrx/effects';
import { NodeActionTypes } from '@app/architecture/store/actions/node.actions';

@Component({
  selector: 'app-radio-details',
  templateUrl: './radio-details.component.html',
  styleUrls: ['./radio-details.component.scss'],
  providers: [RadioDetailService, RadioValidatorService]
})
export class RadioDetailsComponent implements OnInit, OnDestroy {
  public loadingStatus = LoadingStatus;
  public users$: Observable<User[]>;
  public radio: RadioDetail;
  public radioId: string;
  public subscriptions: Subscription[] = [];
  public isEditable = false;
  public modalMode = false;
  public availableTags$: Observable<Tag[]>;

  constructor(
    private userStore: Store<UserState>,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<RadioState>,
    private radioDetailService: RadioDetailService,
    private dialog: MatDialog,
    private actions: Actions
  ) {}

  ngOnInit() {
    this.availableTags$ = this.store.select(getRadioAvailableTags);
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const radioId = params['radioId'];
        this.radioId = radioId;
        this.store.dispatch(new LoadRadio(radioId));
        this.users$ = this.userStore.pipe(select(getUsers));
      })
    );
    this.subscriptions.push(
      this.store.pipe(select(getSelectedRadio)).subscribe(radio => {
        this.radio = radio;
        if (radio) {
          this.radioDetailService.radioDetailsForm.patchValue({
            title: radio.title,
            actionBy: radio.actionBy,
            assignedTo: radio.assignedTo,
            category: radio.category,
            reference: radio.reference,
            status: radio.status,
            mitigation: radio.mitigation,
            description: radio.description,
            severity: radio.severity,
            frequency: radio.frequency,
            raisedBy: `${radio.author.firstName} ${radio.author.lastName}`,
            createdOn: new Date(radio.createdOn).toLocaleDateString(),
            lastUpdatedOn: new Date(radio.lastUpdatedOn).toLocaleDateString()
          });
        }
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(NodeActionTypes.CreateTagSuccess)).subscribe((action: { payload: { tag: Tag }}) => {
        if (action.payload.tag) {
          this.store.dispatch(
            new AddRadioTags({
              radioId: this.radioId,
              tagIds: [{ id: action.payload.tag.id }]
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get radioDetailsForm(): FormGroup {
    return this.radioDetailService.radioDetailsForm;
  }

  get isLoading$(): Observable<LoadingStatus> {
    return this.store.select(getRadioLoadingStatus);
  }

  onCancel(): void {
    this.radioDetailService.radioDetailsForm.patchValue({...this.radio});
  }

  onSaveRadio(): void {
    const dialogRef = this.dialog.open(ReplyModalComponent, {
      disableClose: false,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        this.store.dispatch(
          new AddReply({
            id: this.radioId,
            entity: {
              data: {
                replyText: data.radio.replyText,
                changes: this.radioDetailsForm.value
              }
            }
          })
        );
      } else {
        this.onCancel();
      }
    });
  }

  onArchiveRadio(): void {
    const dialogRef = this.dialog.open(ReplyModalComponent, {
      disableClose: false,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(
          new AddReply({
            id: this.radioId,
            entity: {
              data: {
                replyText: data.radio.replyText,
                changes: { status: 'closed' }
              }
            }
          })
        );
      }
    });
  }

  onSendReply(): void {
    this.store.dispatch(
      new AddReply({
        id: this.radioId,
        entity: {
          data: {
            replyText: this.radioDetailsForm.value.replyText,
            changes: this.radioDetailsForm.value
          }
        }
      })
    );
    this.radioDetailsForm.patchValue({ replyText: '' });
  }

  onSaveProperty(data: { propertyId: string, value: string }): void {
    this.store.dispatch(
      new UpdateRadioProperty({
        radioId: this.radioId,
        customPropertyId: data.propertyId,
        data: { data: data.value }
      })
    );
  }

  onDeleteProperty(property: CustomPropertiesEntity): void {
    const dialogRef = this.dialog.open(DeleteRadioPropertyModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: property.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(new DeleteRadioProperty({ radioId: this.radioId, customPropertyId: property.propertyId }));
      }
    });
  }

  onUnlinkRelatesTo(relatesTo: RelatesTo) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      maxWidth: '500px',
      width: 'auto',
      data: {
        title: `Confirm you want to disassociate this RADIO ${this.radio.title}
        from ${relatesTo.workPackage.name} ${relatesTo.item.itemType} ${relatesTo.item.name}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(
          new DissociateRadio({
            workpackageId: relatesTo.workPackage.id,
            radioId: this.radio.id,
            nodeId: relatesTo.item.id
          })
        );
      }
    });
  }

  onAddRelatesTo() {
    const dialogRef = this.dialog.open(AssociateModalComponent, {
      disableClose: true,
      width: 'auto',
      data: {
        title: `Associate to RADIO ${this.radio.title} to`
      }
    });
    dialogRef.afterClosed().subscribe((result: { workpackageId: string; nodeId: string }) => {
      if (result) {
        this.store.dispatch(
          new AssociateRadio({ workpackageId: result.workpackageId, nodeId: result.nodeId, radio: this.radio })
        );
      }
    });
  }

  onDeleteRadio(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: 'Are you sure you want to delete?'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new DeleteRadioEntity(this.radioId));
        this.router.navigate(['/radio'], { queryParamsHandling: 'preserve' });
      }
    });
  }

  onCreateTag(tag: Tag): void {
    this.store.dispatch(new CreateTag({ tag }));
  }

  onUpdateAvailableTags(): void {
    this.store.pipe(select(getRadioAvailableTags), take(1)).subscribe(tags => {
      this.store.dispatch(new LoadRadioTags({radioId: this.radioId}));
    });
  }

  onAddTag(tagId: string): void {
    this.store.dispatch(
      new AddRadioTags({
        radioId: this.radioId,
        tagIds: [{ id: tagId }]
      })
    )
  }

  onRemoveTag(tag: Tag): void {
    this.store.dispatch(
      new DeleteRadioTags({
        radioId: this.radioId,
        tagId: tag.id
      })
    )
  }
}
