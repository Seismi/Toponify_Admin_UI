import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { getNodeLoadingStatus } from '@app/architecture/store/selectors/node.selector';
import { LoadingStatus } from '@app/architecture/store/models/node.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit {

  loadingStatus = LoadingStatus;
  isLoading$: Observable<LoadingStatus>;

  constructor(private store: Store<NodeState>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getNodeLoadingStatus);
  }
}
