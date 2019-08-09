import { Component, OnInit } from '@angular/core';
import { RadioDetailService } from '../../components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '../../components/radio-detail/services/radio-detail-validator.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RadioEntity } from '../../store/models/radio.model';
import { State as RadioState} from '../../store/reducers/radio.reducer';
import { LoadRadios, AddRadioEntity } from '../../store/actions/radio.actions';
import { getRadioEntities } from '../../store/selectors/radio.selector';
import { RadioModalComponent } from '../radio-modal/radio-modal.component';
import { Router } from '@angular/router';
import { State as SearchState } from '@app/core/store/reducers/search.reducer';
import { Search } from '@app/core/store/actions/search.actions';
import { getSearchResults } from '@app/core/store/selectors/search.selectors';
import { SearchEntity } from '@app/core/store/models/search.models';

@Component({
    selector: 'smi-radio',
    templateUrl: 'radio.component.html',
    styleUrls: ['radio.component.scss'],
    providers: [RadioDetailService, RadioValidatorService]
})
export class RadioComponent implements OnInit {

    search$: Observable<SearchEntity[]>;
    radio$: Observable<RadioEntity[]>;
    loading$: Observable<boolean>;
    radioId: string;

    constructor(
        private searchStore: Store<SearchState>,
        private store: Store<RadioState>,
        public dialog: MatDialog,
        private router: Router) { }

    ngOnInit() {
        this.store.dispatch(new LoadRadios({}));
        this.radio$ = this.store.pipe(select(getRadioEntities));
    }

    onSelectRadio(row) {
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


    onSearch(query: string) {
        this.search(query);
    }
    
    search(text: string) {
        const queryParams = {
          text: text
        };

        this.searchStore.dispatch(new Search(queryParams));
        this.search$ = this.searchStore.pipe(select(getSearchResults));
    }
}