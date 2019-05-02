import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
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
  }

  ngOnInit() {
    this.workpackageEntities$ = this.store.pipe(select(getWorkPackageEntities));
  }

}
