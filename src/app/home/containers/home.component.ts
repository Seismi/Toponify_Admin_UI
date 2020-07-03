import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State as HomePageState } from '../store/reducers/home.reducers';
import { LoadMyLayouts, LoadMyRadios, LoadMyWorkPackages, LoadMyProfile, HomePageActionTypes } from '../store/actions/home.actions';
import { Observable, Subscription } from 'rxjs';
import { getMyLayouts, getMyRadios, getMyWorkPackages } from '../store/selectors/home.selectors';
import { Router } from '@angular/router';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { Actions, ofType } from '@ngrx/effects';
import { UpdateUser } from '@app/settings/store/actions/user.actions';

@Component({
  selector: 'smi-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  public myWorkPackages$: Observable<WorkPackageEntity[]>;
  public myRadios$: Observable<RadioEntity[]>;
  public myLayouts$: Observable<LayoutDetails[]>;
  public selectedLeftTab: number | string;
  public subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store<HomePageState>,
    private actions: Actions
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadMyWorkPackages({}));
    this.myWorkPackages$ = this.store.pipe(select(getMyWorkPackages));

    this.store.dispatch(new LoadMyRadios({}));
    this.myRadios$ = this.store.pipe(select(getMyRadios));

    this.store.dispatch(new LoadMyLayouts({}));
    this.myLayouts$ = this.store.pipe(select(getMyLayouts));

    this.store.dispatch(new LoadMyProfile());
    this.actions.pipe(ofType(HomePageActionTypes.LoadMyProfileSuccess)).subscribe((action: any) => {
      const settings = action.payload.data.settings;
      if (!settings.hasOwnProperty('summarySettings')) {
        this.store.dispatch(
          new UpdateUser(
            {
              id: action.payload.data.id,
              data: {
                id: action.payload.data.id,
                settings: {
                  summarySettings: {
                    frequency: 'None',
                    day: 1
                  }
                }
              }
            })
          );
      }
    });
  }

  onOpenWorkPackage(id) {
    this.router.navigate(['/architecture'], { queryParamsHandling: 'preserve' });
  }

  onOpenLayout() {
    this.router.navigate(['/architecture'], { queryParamsHandling: 'preserve' });
  }
}
