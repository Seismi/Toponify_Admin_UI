import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State as ScopeState } from '../../../scope/store/reducers/scope.reducer';
import { Subscription } from 'rxjs';
import { LoadScope } from '@app/scope/store/actions/scope.actions';
import { getScopeSelected } from '@app/scope/store/selectors/scope.selector';
import { ScopeDetails } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'app-scope-details',
  templateUrl: './scope-details.component.html',
  styleUrls: ['./scope-details.component.css']
})
export class ScopeDetailsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  scope: ScopeDetails;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<ScopeState>
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const id = params['scopeId'];
      if (!this.scope || id !== this.scope.id) {
        this.store.dispatch(new LoadScope(id));
      }
    }));
    this.subscriptions.push(this.store.pipe(select(getScopeSelected)).subscribe(scope => {
      this.scope = scope;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onLayoutSelect(row: any) {
    this.router.navigate(['scopes-and-layouts', this.scope.id, row.id]);
  }
}
