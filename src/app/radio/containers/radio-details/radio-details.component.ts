import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State as RadioState } from '../../store/reducers/radio.reducer';
import { Subscription, Observable } from 'rxjs';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { LoadRadio, AddReply } from '@app/radio/store/actions/radio.actions';
import { getSelectedRadio } from '@app/radio/store/selectors/radio.selector';
import { FormGroup } from '@angular/forms';
import { RadioDetailService } from '@app/radio/components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '@app/radio/components/radio-detail/services/radio-detail-validator.service';
import { MatDialog } from '@angular/material';
import { ReplyModalComponent } from '../reply-modal/reply-modal.component';
import { User } from '@app/settings/store/models/user.model';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { getUsers } from '@app/settings/store/selectors/user.selector';

@Component({
  selector: 'app-radio-details',
  templateUrl: './radio-details.component.html',
  styleUrls: ['./radio-details.component.scss'],
  providers: [RadioDetailService, RadioValidatorService]
})
export class RadioDetailsComponent implements OnInit, OnDestroy {

  users$: Observable<User[]>;
  radio: RadioDetail;
  radioId: string;
  subscriptions: Subscription[] = [];
  isEditable = false;
  modalMode = false;
  showOrHideRightPane = false;
  selectedRightTab: number;

  constructor(
    private userStore: Store<UserState>,
    private route: ActivatedRoute,
    private store: Store<RadioState>,
    private radioDetailService: RadioDetailService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const radioId = params['radioId'];
      this.radioId = radioId;
      this.store.dispatch(new LoadRadio(radioId));
      this.users$ = this.userStore.pipe(select(getUsers));
    }));
    this.subscriptions.push(this.store.pipe(select(getSelectedRadio)).subscribe(radio => {
      this.radio = radio;
      if(radio) {
        this.radioDetailService.radioDetailsForm.patchValue({
          title: radio.title,
          actionBy: radio.actionBy,
          assignedTo: (radio.assignedTo.firstName) ? `${radio.assignedTo.firstName} ${radio.assignedTo.lastName}` : '',
          category: radio.category,
          status: radio.status,
          mitigation: radio.mitigation,
          description: radio.description
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get radioDetailsForm(): FormGroup {
    return this.radioDetailService.radioDetailsForm;
  }

  openRightTab(index: number) {
    this.selectedRightTab = index;
    if(this.selectedRightTab === index) {
      this.showOrHideRightPane = false;
    }
  }

  onHideRightPane() {
    this.showOrHideRightPane = true;
  }

  onSaveRadio() {
    const dialogRef = this.dialog.open(ReplyModalComponent, {
      disableClose: false,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.store.dispatch(new AddReply({
          id: this.radioId,
          entity: {
            data: {
              replyText: data.radio.replyText,
              changes: this.radioDetailsForm.value
            }
          }
        }))
      }
    })
  }

  onArchiveRadio() {
    const dialogRef = this.dialog.open(ReplyModalComponent, {
      disableClose: false,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.store.dispatch(new AddReply({
          id: this.radioId,
          entity: {
            data: {
              replyText: data.radio.replyText,
              changes: { status: 'closed' }
            }
          }
        }))
      }
    })
  }

  onSendReply() {
    this.store.dispatch(new AddReply({
      id: this.radioId,
      entity: {
        data: {
          replyText: this.radioDetailsForm.value.replyText,
          changes: this.radioDetailsForm.value
        }
      },
    }))
    this.radioDetailsForm.patchValue({ replyText: '' });
  }

}