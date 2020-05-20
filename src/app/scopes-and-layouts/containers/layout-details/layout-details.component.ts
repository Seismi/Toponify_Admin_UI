import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import { LoadLayout, DeleteLayout, UpdateLayout } from '@app/layout/store/actions/layout.actions';
import { getLayoutSelected } from '@app/layout/store/selectors/layout.selector';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ScopesAndLayoutsDetailService } from '@app/scopes-and-layouts/components/scopes-and-layouts-detail/services/scopes-and-layouts-detail.service';
import { ScopesAndLayoutsValidatorService } from '@app/scopes-and-layouts/components/scopes-and-layouts-detail/services/scopes-and-layouts-detail-validator.service';
import { UpdateScope } from '@app/scope/store/actions/scope.actions';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-layout-details',
  templateUrl: './layout-details.component.html',
  styleUrls: ['./layout-details.component.scss'],
  providers: [ScopesAndLayoutsDetailService, ScopesAndLayoutsValidatorService]
})
export class LayoutDetailsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public layout: LayoutDetails;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private scopesAndLayoutsDetailService: ScopesAndLayoutsDetailService,
    private route: ActivatedRoute,
    private store: Store<LayoutState>
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const id = params['layoutId'];
        if (!this.layout || this.layout.id !== id) {
          this.store.dispatch(new LoadLayout(id));
        }
      })
    );
    this.subscriptions.push(
      this.store.pipe(select(getLayoutSelected)).subscribe(layout => {
        if (layout) {
          this.layout = layout;
          this.scopesAndLayoutsDetailService.scopesAndLayoutsDetailForm.patchValue({ name: layout.name });
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

  onSaveLayout(): void {
    this.store.dispatch(
      new UpdateLayout({
        id: this.layout.id,
        data: {
          id: this.layout.id,
          name: this.scopesAndLayoutsDetailForm.value.name,
          scope: this.layout.scope
        }
      })
    );
  }

  onDeleteLayout(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: 'Are you sure you want to delete this?'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new DeleteLayout(this.layout.id));
        this.store.dispatch(
          new UpdateScope({
            id: this.layout.scope.id,
            data: {
              id: this.layout.scope.id,
              name: this.layout.scope.name
            }
          })
        );
        this.router.navigate(['/scopes-and-layouts/' + this.layout.scope.id]);
      }
    });
  }
}
