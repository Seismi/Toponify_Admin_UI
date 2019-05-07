import { Component, OnInit } from '@angular/core';
import { LoadWorkPackage, LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss']
})
export class WorkPackageComponent implements OnInit {

  public workpackageEntities$: Observable<WorkPackageEntity[]>;
  public workpackageSelected: boolean;

  constructor(private store: Store<any>) {
    this.store.dispatch(new LoadWorkPackages({}));
    this.store.dispatch(new LoadWorkPackage('c288392e-6cf5-11e9-a923-1681be663d3e'));
  }

  ngOnInit() {
  }

  onSelectWorkpackage(row) {
    this.workpackageSelected = true;
  }

}
