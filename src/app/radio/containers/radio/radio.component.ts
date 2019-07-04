import { Component, OnInit } from '@angular/core';
import { RadioDetailService } from '../../components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '../../components/radio-detail/services/radio-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RadioEntity } from '../../store/models/radio.model';
import { State as RadioState} from '../../store/reducers/radio.reducer';
import { LoadRadios, LoadRadio, AddRadioEntity, AddReply } from '../../store/actions/radio.actions';
import { getRadioEntities, getRadioById } from '../../store/selectors/radio.selector';
import { RadioModalComponent } from '../radio-modal/radio-modal.component';
import { ReplyModalComponent } from '../reply-modal/reply-modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'smi-radio',
    templateUrl: 'radio.component.html',
    styleUrls: ['radio.component.scss'],
    providers: [RadioDetailService, RadioValidatorService]
})
export class RadioComponent implements OnInit {

    radio$: Observable<RadioEntity[]>;
    loading$: Observable<boolean>;
    selectedRadio$: Subscription;
    selecetedRadio: any;
    disableButton = true;
    isEditable = false;
    addRadio = true;
    radioId: string;
    modalMode = false;

    constructor(private store: Store<RadioState>,
                private radioDetailService: RadioDetailService,
                public dialog: MatDialog,
                private router: Router) { }

    ngOnInit() {
        this.store.dispatch(new LoadRadios({}));
        this.radio$ = this.store.pipe(select(getRadioEntities));
    }

    get radioDetailsForm(): FormGroup {
        return this.radioDetailService.radioDetailsForm;
    }

    onSelectRadio(row) {
        this.radioId = row.id;
        this.addRadio = true;
        this.disableButton = false;
        this.modalMode = true;
        this.radioDetailService.radioDetailsForm.patchValue({
            title: row.title,
            category: row.category,
            status: row.status,
            description: row.description
        })

        this.store.dispatch(new LoadRadio(this.radioId));
        this.selectedRadio$ = this.store.pipe(select(getRadioById(this.radioId))).subscribe((data)=> {
            this.selecetedRadio = {...data[0]};
        });
        
        this.router.navigate(['radio', row.id]);
    }

    onAddRadio() {
        const dialogRef = this.dialog.open(RadioModalComponent, {
            disableClose: false,
            width: '500px'
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.radio) {
                this.store.dispatch(new AddRadioEntity({
                    data: {
                        title: data.radio.title,
                        description: data.radio.description,
                        status: data.radio.status,
                        category: data.radio.category,
                        author: {id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0'}
                    }
                }));
            }
        });
    }

    onSaveRadio() {
        const dialogRef = this.dialog.open(ReplyModalComponent, {
            disableClose: false,
            width: '400px'
        });
      
        dialogRef.afterClosed().subscribe((data) => {
            if(data) {
                this.store.dispatch(new AddReply({
                    id: this.radioId,
                    entity: {
                      data: {
                        replyText: data.radio.replyText,
                        changes: this.radioDetailsForm.value,
                        author: {id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0'}
                    }
                }}))
            }
        })
    }

    onArchiveRadio() {
        const dialogRef = this.dialog.open(ReplyModalComponent, {
            disableClose: false,
            width: '400px'
        });
      
        dialogRef.afterClosed().subscribe((data) => {
            if(data) {
                this.store.dispatch(new AddReply({
                    id: this.radioId,
                    entity: {
                      data: {
                        replyText: data.radio.replyText,
                        author: { id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0' },
                        changes: { status: 'closed' }
                      }
                }}))
            }
        })
    }
}