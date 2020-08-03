import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State as HomePageState } from '../store/reducers/home.reducers';
import { LoadMyLayouts, LoadMyRadios, LoadMyWorkPackages, LoadMyProfile, HomePageActionTypes, LoadMyFavourites } from '../store/actions/home.actions';
import { Observable, Subscription } from 'rxjs';
import { getMyLayouts, getMyRadios, getMyWorkPackages, getHomePageLoadingStatus, getMyFavourites } from '../store/selectors/home.selectors';
import { Router } from '@angular/router';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { Actions, ofType } from '@ngrx/effects';
import { UpdateUser } from '@app/settings/store/actions/user.actions';
import { HomeTabs } from '../components/home-tabs/home-tabs.model';
import { NotificationState } from '@app/core/store/reducers/notification.reducer';
import { getNewNotificationCount } from '@app/core/store/selectors/notification.selectors';
import { LoadingStatus } from '@app/architecture/store/models/node.model';
import { Favourites } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  public myWorkPackages$: Observable<WorkPackageEntity[]>;
  public myRadios$: Observable<RadioEntity[]>;
  public myLayouts$: Observable<LayoutDetails[]>;
  public favourites$: Observable<Favourites[]>;
  public subscriptions: Subscription[] = [];
  public selectedTab: HomeTabs = HomeTabs.Favourites;
  public HomeTabs = HomeTabs;
  public notificationsLength: number;
  public loadingStatus: LoadingStatus;

  constructor(
    private router: Router,
    private store: Store<HomePageState>,
    private actions: Actions,
    private notificationStore: Store<NotificationState>,
  ) { }

  get isLoading$(): Observable<boolean> {
    return this.store.select(getHomePageLoadingStatus);
  }

  ngOnInit() {
    this.notificationStore.pipe(select(getNewNotificationCount)).subscribe(count => (this.notificationsLength = count));

    this.store.dispatch(new LoadMyFavourites());
    this.favourites$ = this.store.pipe(select(getMyFavourites));

    this.store.dispatch(new LoadMyWorkPackages({}));
    this.myWorkPackages$ = this.store.pipe(select(getMyWorkPackages));

    this.store.dispatch(new LoadMyRadios({}));
    this.myRadios$ = this.store.pipe(select(getMyRadios));

    // this.store.dispatch(new LoadMyLayouts({}));
    // this.myLayouts$ = this.store.pipe(select(getMyLayouts));

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

  onOpenWorkPackage(workPackageId: string): void {
    this.router.navigate(['/topology']);
  }

  onOpenLayout() {
    this.router.navigate(['/architecture'], { queryParamsHandling: 'preserve' });
  }

  onTabChange(index: HomeTabs): void {
    this.selectedTab = index;
  }

  onOpenRadio(radio: RadioEntity): void {
    this.router.navigate([`/radio/${radio.id}`]);
  }
}
