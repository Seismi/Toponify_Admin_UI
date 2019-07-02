import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { LayoutState } from '../../../layout/store/reducers/layout.reducer';
import { LoadLayout } from '@app/layout/store/actions/layout.actions';
import { getLayoutSelected } from '@app/layout/store/selectors/layout.selector';

@Component({
  selector: 'app-layout-details',
  templateUrl: './layout-details.component.html',
  styleUrls: ['./layout-details.component.css']
})
export class LayoutDetailsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  layout: LayoutDetails;

  constructor(
    private route: ActivatedRoute,
    private store: Store<LayoutState>
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const id = params['layoutId'];
      if (!this.layout || this.layout.id !== id) {
        this.store.dispatch(new LoadLayout(id));
      }
    }));
    this.subscriptions.push(this.store.pipe(select(getLayoutSelected)).subscribe(layout => this.layout = layout));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}