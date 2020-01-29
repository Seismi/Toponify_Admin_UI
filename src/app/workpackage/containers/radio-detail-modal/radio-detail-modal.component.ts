import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { RadioDetailService } from '@app/radio/components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '@app/radio/components/radio-detail/services/radio-detail-validator.service';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getSelectedRadio } from '@app/radio/store/selectors/radio.selector';
import { LoadRadio, AddReply, UpdateRadioProperty, DeleteRadioProperty } from '@app/radio/store/actions/radio.actions';
import { ReplyModalComponent } from '@app/radio/containers/reply-modal/reply-modal.component';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';
import { DeleteRadioPropertyModalComponent } from '@app/radio/containers/delete-property-modal/delete-property-modal.component';
import { User } from '@app/settings/store/models/user.model';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { getUsers } from '@app/settings/store/selectors/user.selector';
import { LoadUsers } from '@app/settings/store/actions/user.actions';

@Component({
  selector: 'smi-radio-detail-modal',
  templateUrl: './radio-detail-modal.component.html',
  styleUrls: ['./radio-detail-modal.component.scss'],
  providers: [RadioDetailService, RadioValidatorService]
})
export class RadioDetailModalComponent implements OnInit, OnDestroy {
  public users$: Observable<User[]>;
  public radio: RadioDetail;
  public subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private userStore: Store<UserState>,
    private store: Store<RadioState>,
    private radioDetailService: RadioDetailService,
    public dialogRef: MatDialogRef<RadioDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.radio = data.radio;
  }

  ngOnInit() {
    this.userStore.dispatch(new LoadUsers({}));
    this.users$ = this.userStore.pipe(select(getUsers));
    this.store.dispatch(new LoadRadio(this.radio.id));

    this.subscriptions.push(
      this.store.pipe(select(getSelectedRadio)).subscribe(radio => {
        this.radio = radio;
        if (radio) {
          this.radioDetailService.radioDetailsForm.patchValue({
            title: radio.title,
            actionBy: radio.actionBy,
            assignedTo: radio.assignedTo,
            category: radio.category,
            status: radio.status,
            reference: radio.reference,
            mitigation: radio.mitigation,
            description: radio.description
          });
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

  onClose() {
    this.dialogRef.close();
  }

  onSaveRadio() {
    const dialogRef = this.dialog.open(ReplyModalComponent, {
      disableClose: false,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(
          new AddReply({
            id: this.radio.id,
            entity: {
              data: {
                replyText: data.radio.replyText,
                changes: this.radioDetailsForm.value
              }
            }
          })
        );
      }
    });
  }

  onArchiveRadio() {
    const dialogRef = this.dialog.open(ReplyModalComponent, {
      disableClose: false,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(
          new AddReply({
            id: this.radio.id,
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

  onSendReply() {
    this.store.dispatch(
      new AddReply({
        id: this.radio.id,
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

  onSaveProperty(data: {propertyId: string, value: string}): void {
    this.store.dispatch(
      new UpdateRadioProperty({
        radioId: this.radio.id,
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
        this.store.dispatch(new DeleteRadioProperty({ radioId: this.radio.id, customPropertyId: property.propertyId }));
      }
    });
  }
}
