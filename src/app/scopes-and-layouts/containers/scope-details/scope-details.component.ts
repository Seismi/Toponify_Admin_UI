import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { Subscription } from 'rxjs';
import { LoadScope, DeleteScope, UpdateScope } from '@app/scope/store/actions/scope.actions';
import { getScopeSelected, getScopeById } from '@app/scope/store/selectors/scope.selector';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
import { ScopesDetailService } from '@app/scopes-and-layouts/components/scopes-detail/services/scopes-detail.service';
import { ScopesValidatorService } from '@app/scopes-and-layouts/components/scopes-detail/services/scopes-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { DeleteScopesAndLayoutsModalComponent } from '../delete-modal/delete-scopes-and-layouts.component';
import { MatDialog } from '@angular/material';
import { LayoutModalComponent } from '../layout-modal/layout-modal.component';

@Component({
  selector: 'app-scope-details',
  templateUrl: './scope-details.component.html',
  styleUrls: ['./scope-details.component.scss'],
  providers: [ScopesDetailService, ScopesValidatorService]
})
export class ScopeDetailsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  scope: ScopeDetails;
  scopeId: string;
  scopeName: string;

  selectedScope$: Subscription;
  selecetedScope: ScopeDetails;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<ScopeState>,
    private scopesDetailService: ScopesDetailService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const id = params['scopeId'];
      this.scopeId = id;
      if (!this.scope || id !== this.scope.id) {
        this.store.dispatch(new LoadScope(id));
      }
    }));
    this.subscriptions.push(this.store.pipe(select(getScopeSelected)).subscribe(scope => {
      if (scope) {
        this.scope = scope;
        this.scopesDetailService.scopesDetailForm.patchValue({
          name: scope.name,
          owners: scope.owners,
          viewers: scope.viewers,
          layerFilter: scope.layerFilter
        });
      }
    }));
  }

  get scopesDetailForm(): FormGroup {
    return this.scopesDetailService.scopesDetailForm;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onLayoutSelect(row: any) {
    this.scopeName = row.name;
    this.router.navigate(['scopes-and-layouts', this.scope.id, row.id]);
  }

  onSaveScope() {
    this.store.dispatch(new UpdateScope({
      id: this.scopeId,
      data: {
        id: this.scopeId,
        name: this.scopesDetailForm.value.name,
        layerFilter: this.scopesDetailForm.value.layerFilter,
        owners: this.scope.owners
      }
    }))
  }

  onDeleteScope() {
    const dialogRef = this.dialog.open(DeleteScopesAndLayoutsModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.mode === 'delete') {
        this.store.dispatch(new DeleteScope(this.scopeId));
      }
    });
  }

  onAddLayout() {
    this.dialog.open(LayoutModalComponent, { 
      disableClose: false, 
      width: '500px',
      data: {
        scope: {
          id: this.scopeId,
          name: this.scopeName
        }
      }
    });
  }
}
