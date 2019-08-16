import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as HomePageState } from '../store/reducers/home.reducers';
import { LoadMyWorkPackages, LoadMyRadios, LoadMyLayouts } from '../store/actions/home.actions';
import { Observable } from 'rxjs';
import { getMyWorkPackages, getMyRadios, getMyLayouts } from '../store/selectors/home.selectors';
import { Router } from '@angular/router';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { LayoutEntity } from '@app/layout/store/models/layout.model';

@Component({
  selector: 'smi-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {

  myWorkPackages$: Observable<WorkPackageEntity[]>;
  myRadios$: Observable<RadioEntity[]>;
  myLayouts$: Observable<LayoutEntity[]>;

  constructor(
    private router: Router,
    private store: Store<HomePageState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadMyWorkPackages({}));
    this.myWorkPackages$ = this.store.pipe(select(getMyWorkPackages));

    this.store.dispatch(new LoadMyRadios({}));
    this.myRadios$ = this.store.pipe(select(getMyRadios));

    this.store.dispatch(new LoadMyLayouts({}));
    this.myLayouts$ = this.store.pipe(select(getMyLayouts));
  }

  onOpenWorkPackage(id) {
    this.router.navigate(['/architecture']);
  }

  onOpenLayout() {
    this.router.navigate(['/architecture']);
  }
  
}