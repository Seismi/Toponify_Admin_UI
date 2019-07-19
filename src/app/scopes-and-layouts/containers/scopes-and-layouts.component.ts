import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScopeEntity } from '@app/scope/store/models/scope.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { LoadScopes } from '@app/scope/store/actions/scope.actions';
import { getScopeEntities } from '@app/scope/store/selectors/scope.selector';
import { ScopeModalComponent } from './scope-modal/scope-modal.component';
import { MatDialog } from '@angular/material';
import { LayoutsDetailService } from '../components/layouts-detail/services/layouts-detail.service';
import { LayoutsValidatorService } from '../components/layouts-detail/services/layouts-detail-validator.service';

@Component({
  selector: 'smi-scopes-and-layouts-component',
  templateUrl: 'scopes-and-layouts.component.html',
  styleUrls: ['scopes-and-layouts.component.scss'],
  providers: [LayoutsDetailService, LayoutsValidatorService]
})

export class ScopesAndLayoutsComponent implements OnInit {

  scopeSelected: boolean;
  layoutSelected: boolean;
  scopes$: Observable<ScopeEntity[]>;

  constructor(
    private layoutsDetailService: LayoutsDetailService,
    private store: Store<ScopeState>,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.store.dispatch(new LoadScopes({}));
    this.scopes$ = this.store.pipe(select(getScopeEntities));
  }

  onScopeSelect(row: any) {
    this.layoutsDetailService.scopeId = row.id;
    this.layoutsDetailService.scopeName = row.name;
    this.router.navigate(['scopes-and-layouts', row.id]);
  }

  onSearchVersion(evt: any) {}

  onAddScope() {
    this.dialog.open(ScopeModalComponent, { disableClose: false, width: '500px' });
  }

}
