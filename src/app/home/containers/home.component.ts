import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State as HomePageState } from '../store/reducers/home.reducers';
import { LoadMyLayouts, LoadMyRadios, LoadMyWorkPackages } from '../store/actions/home.actions';
import { Observable } from 'rxjs';
import { getMyLayouts, getMyRadios, getMyWorkPackages } from '../store/selectors/home.selectors';
import { Router } from '@angular/router';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { LayoutDetails } from '@app/layout/store/models/layout.model';

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

  @ViewChild('drawer') drawer;

  constructor(private router: Router, private store: Store<HomePageState>) {}

  ngOnInit() {
    this.store.dispatch(new LoadMyWorkPackages({}));
    this.myWorkPackages$ = this.store.pipe(select(getMyWorkPackages));

    this.store.dispatch(new LoadMyRadios({}));
    this.myRadios$ = this.store.pipe(select(getMyRadios));

    this.store.dispatch(new LoadMyLayouts({}));
    this.myLayouts$ = this.store.pipe(select(getMyLayouts));
  }

  onOpenWorkPackage(id) {
    this.router.navigate(['/architecture'], { queryParamsHandling: 'preserve' });
  }

  onOpenLayout() {
    this.router.navigate(['/architecture'], { queryParamsHandling: 'preserve' });
  }

  openLeftTab(tab: number | string): void {
    (this.drawer.opened && this.selectedLeftTab === tab) ? this.drawer.close() : this.drawer.open();
    (typeof tab !== 'string') ? this.selectedLeftTab = tab : this.selectedLeftTab = 'menu';
  }
}
