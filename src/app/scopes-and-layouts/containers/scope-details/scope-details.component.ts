import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { Subscription } from 'rxjs';
import { LoadScope, DeleteScope, UpdateScope } from '@app/scope/store/actions/scope.actions';
import { getScopeSelected } from '@app/scope/store/selectors/scope.selector';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
import { ScopesAndLayoutsDetailService } from '@app/scopes-and-layouts/components/scopes-and-layouts-detail/services/scopes-and-layouts-detail.service';
import { ScopesAndLayoutsValidatorService } from '@app/scopes-and-layouts/components/scopes-and-layouts-detail/services/scopes-and-layouts-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { DeleteScopesAndLayoutsModalComponent } from '../delete-modal/delete-scopes-and-layouts.component';
import { MatDialog } from '@angular/material';
import { AddLayout } from '@app/layout/store/actions/layout.actions';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { ScopeAndLayoutModalComponent } from '../scope-and-layout-modal/scope-and-layout-modal.component';
import { LayoutEntity } from '@app/layout/store/models/layout.model';

@Component({
  selector: 'app-scope-details',
  templateUrl: './scope-details.component.html',
  styleUrls: ['./scope-details.component.scss'],
  providers: [ScopesAndLayoutsDetailService, ScopesAndLayoutsValidatorService]
})
export class ScopeDetailsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public scope: ScopeDetails;
  public selectedScope: ScopeDetails;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<ScopeState>,
    private scopesAndLayoutsDetailService: ScopesAndLayoutsDetailService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const id = params['scopeId'];
        if (!this.scope || id !== this.scope.id) {
          this.store.dispatch(new LoadScope(id));
          this.store.dispatch(new UpdateQueryParams({ scope: id }));
        }
      })
    );
    this.subscriptions.push(
      this.store.pipe(select(getScopeSelected)).subscribe(scope => {
        if (scope) {
          this.scope = scope;
          this.scopesAndLayoutsDetailService.scopesAndLayoutsDetailForm.patchValue({
            name: scope.name,
            layerFilter: scope.layerFilter
          });
        }
      })
    );
  }

  get scopesAndLayoutsDetailForm(): FormGroup {
    return this.scopesAndLayoutsDetailService.scopesAndLayoutsDetailForm;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onLayoutSelect(row: LayoutEntity): void {
    this.router.navigate(['scopes-and-layouts', this.scope.id, row.id], { queryParamsHandling: 'preserve' });
  }

  onSaveScope(): void {
    this.store.dispatch(
      new UpdateScope({
        id: this.scope.id,
        data: {
          id: this.scope.id,
          name: this.scopesAndLayoutsDetailForm.value.name,
          layerFilter: this.scopesAndLayoutsDetailForm.value.layerFilter
        }
      })
    );
  }

  onDeleteScope(): void {
    const dialogRef = this.dialog.open(DeleteScopesAndLayoutsModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data.mode === 'delete') {
        this.store.dispatch(new DeleteScope(this.scope.id));
        this.store.dispatch(new UpdateQueryParams({ scope: null }));
        this.router.navigate(['/scopes-and-layouts']);
      }
    });
  }

  onAddLayout(): void {
    const dialogRef = this.dialog.open(ScopeAndLayoutModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Layout'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.scopeAndLayout) {
        this.store.dispatch(
          new AddLayout({
            layoutDetails: {
              name: data.scopeAndLayout.name,
              scope: this.scope
            },
            positionDetails: {
              workPackages: [],
              positions: {
                nodes: [],
                nodeLinks: []
              }
            }
          })
        );
      }
    });
  }

  onSetFavoriteLayout(id: string) {
    this.store.dispatch(new UpdateScope({ id: this.scope.id, data: { ...this.scope, defaultLayout: id } }));
  }

  onOpen(): void {
    this.router.navigate(['topology'], { queryParamsHandling: 'preserve' });
  }
}
