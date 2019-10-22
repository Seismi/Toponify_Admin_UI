import { Component, OnInit } from '@angular/core';
import { RadioDetailService } from '../../components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '../../components/radio-detail/services/radio-detail-validator.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RadioEntity } from '../../store/models/radio.model';
import { State as RadioState } from '../../store/reducers/radio.reducer';
import { LoadRadios, AddRadioEntity } from '../../store/actions/radio.actions';
import { getRadioEntities } from '../../store/selectors/radio.selector';
import { RadioModalComponent } from '../radio-modal/radio-modal.component';
import { Router, NavigationEnd } from '@angular/router';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { LoadUsers } from '@app/settings/store/actions/user.actions';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

@Component({
  selector: 'smi-radio',
  templateUrl: 'radio.component.html',
  styleUrls: ['radio.component.scss'],
  providers: [RadioDetailService, RadioValidatorService]
})
export class RadioComponent implements OnInit {

  public radio$: Observable<RadioEntity[]>;
  public loading$: Observable<boolean>;
  public radioSelected: boolean;

  constructor(
    private userStore: Store<UserState>,
    private store: Store<RadioState>,
    public dialog: MatDialog,
    private router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        (event.url.length > 7) ? this.radioSelected = true : this.radioSelected = false;
      }
    });
  }

  ngOnInit() {
    this.userStore.dispatch(new LoadUsers({}));
    
    this.store.dispatch(new LoadRadios({}));
    this.radio$ = this.store.pipe(select(getRadioEntities));
  }

  onSelectRadio(row: RadioEntity) {
    this.router.navigate(['radio', row.id]);
  }

  onAddRadio() {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.radio) {
        this.store.dispatch(new AddRadioEntity({ data: data.radio }));
      }
    });
  }

  onFilter() {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((data) => {});
  }

}