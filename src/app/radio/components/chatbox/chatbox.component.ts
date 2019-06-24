import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RadioDetailService } from '../radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '../radio-detail/services/radio-detail-validator.service';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { Store } from '@ngrx/store';
import { State as RadioState} from '../../store/reducers/radio.reducer';
import { AddReply } from '@app/radio/store/actions/radio.actions';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'smi-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  providers: [RadioDetailService, RadioValidatorService]
})
export class ChatBoxComponent {

  @Input() disableButton = true;
  @Input() group: FormGroup;
  @Input() radioId: string;

  constructor(private radioDetailService: RadioDetailService,
    private store: Store<RadioState>) {}

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['title'];
  public dataSource: MatTableDataSource<RadioDetail>;

  get radioDetailsForm(): FormGroup {
    return this.radioDetailService.radioDetailsForm;
  }

  onSend() {
    this.store.dispatch(new AddReply({
      id: this.radioId,
      entity: {
        data: {
          replyText: this.radioDetailsForm.value.replyText,
          author: {
            id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0'
          },
          changes: {
            title: this.radioDetailsForm.value.title,
            category: this.radioDetailsForm.value.category,
            status: this.radioDetailsForm.value.status,
            description: this.radioDetailsForm.value.description,
            author: {
              id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0'
            }
          }
        }
      },
    }))
    this.radioDetailsForm.patchValue({ replyText: '' });
  }
}