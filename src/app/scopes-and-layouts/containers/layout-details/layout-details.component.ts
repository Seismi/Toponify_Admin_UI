import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import { LoadLayout, DeleteLayout, UpdateLayout } from '@app/layout/store/actions/layout.actions';
import { getLayoutSelected } from '@app/layout/store/selectors/layout.selector';
import { FormGroup } from '@angular/forms';
import { LayoutsDetailService } from '@app/scopes-and-layouts/components/layouts-detail/services/layouts-detail.service';
import { LayoutsValidatorService } from '@app/scopes-and-layouts/components/layouts-detail/services/layouts-detail-validator.service';
import { DeleteScopesAndLayoutsModalComponent } from '../delete-modal/delete-scopes-and-layouts.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-layout-details',
  templateUrl: './layout-details.component.html',
  styleUrls: ['./layout-details.component.scss'],
  providers: [LayoutsDetailService, LayoutsValidatorService]
})
export class LayoutDetailsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  layout: LayoutDetails;
  layoutId: string;

  constructor(
    private dialog: MatDialog,
    private layoutsDetailService: LayoutsDetailService,
    private route: ActivatedRoute,
    private store: Store<LayoutState>
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const id = params['layoutId'];
      this.layoutId = id;
      if (!this.layout || this.layout.id !== id) {
        this.store.dispatch(new LoadLayout(id));
      }
    }));
    this.subscriptions.push(this.store.pipe(select(getLayoutSelected)).subscribe(layout => {
      if(layout) {
        this.layout = layout;
        this.layoutsDetailService.layoutsDetailForm.patchValue({
          name: layout.name,
          owners: layout.owners,
          viewers: layout.viewers
        });
      }
    }))
  }

  get layoutsDetailForm(): FormGroup {
    return this.layoutsDetailService.layoutsDetailForm;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSaveLayout() {
    this.store.dispatch(new UpdateLayout({
      id: this.layoutId,
      data: {
        id: this.layoutId,
        name: this.layoutsDetailForm.value.name,
        scope: [{
          id: this.layoutsDetailService.scopeId,
          name: this.layoutsDetailService.scopeName
        }]
      }
    }))
  }

  onDeleteLayout() {
    const dialogRef = this.dialog.open(DeleteScopesAndLayoutsModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.mode === 'delete') {
        this.store.dispatch(new DeleteLayout(this.layoutId));
      }
    });
  }
}
