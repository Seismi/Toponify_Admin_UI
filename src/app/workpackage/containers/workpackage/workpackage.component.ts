import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoadWorkPackages, LoadWorkPackage } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';
import { Observable } from 'rxjs';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.css']
})
export class WorkPackageComponent implements OnInit {

  workpackageEntities$: Observable<WorkPackageEntity[]>;

  constructor(private store: Store<any>) {
    this.store.dispatch(new LoadWorkPackages({}));
    this.store.dispatch(new LoadWorkPackage('c288392e-6cf5-11e9-a923-1681be663d3e'));
  }

  ngOnInit() {
  }

}
