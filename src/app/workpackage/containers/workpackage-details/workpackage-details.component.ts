import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadWorkPackage } from '@app/workpackage/store/actions/workpackage.actions';
import { Store, select } from '@ngrx/store';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkPackage } from '@app/workpackage/store/selectors/workpackage.selector';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workpackage-details',
  templateUrl: './workpackage-details.component.html',
  styleUrls: ['./workpackage-details.component.css']
})
export class WorkpackageDetailsComponent implements OnInit, OnDestroy {

  @Output() selectWorkpackage = new EventEmitter();

  workpackage: any;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<WorkPackageState>
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const workpackageId = params['workpackageId'];
      this.store.dispatch(new LoadWorkPackage(workpackageId));
    }));
    this.subscriptions.push(this.store.pipe(select(getSelectedWorkPackage)).subscribe(workpackage => this.workpackage = workpackage));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
