import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScopeEntity } from '@app/scope/store/models/scope.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { LoadScopes, AddScope } from '@app/scope/store/actions/scope.actions';
import { getScopeEntities } from '@app/scope/store/selectors/scope.selector';
import { ScopeAndLayoutModalComponent } from './scope-and-layout-modal/scope-and-layout-modal.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'smi-scopes-and-layouts-component',
  templateUrl: 'scopes-and-layouts.component.html',
  styleUrls: ['scopes-and-layouts.component.scss']
})
export class ScopesAndLayoutsComponent implements OnInit {
  public scopes$: Observable<ScopeEntity[]>;
  public selectedLeftTab: number | string;

  @ViewChild('drawer') drawer;

  constructor(private store: Store<ScopeState>, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadScopes({}));
    this.scopes$ = this.store.pipe(select(getScopeEntities));
  }

  onScopeSelect(row: ScopeEntity): void {
    this.router.navigate(['scopes-and-layouts', row.id], { queryParamsHandling: 'preserve' });
  }

  onAddScope(): void {
    const dialogRef = this.dialog.open(ScopeAndLayoutModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Scope'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.scopeAndLayout) {
        this.store.dispatch(
          new AddScope({
            id: data.scopeAndLayout.id,
            name: data.scopeAndLayout.name,
            layerFilter: 'system'
          })
        );
      }
    });
  }

  openLeftTab(tab: number | string): void {
    (this.drawer.opened && this.selectedLeftTab === tab) ? this.drawer.close() : this.drawer.open();
    (typeof tab !== 'string') ? this.selectedLeftTab = tab : this.selectedLeftTab = 'menu';
    if (!this.drawer.opened) {
      this.selectedLeftTab = 'menu';
    }
  }
}
