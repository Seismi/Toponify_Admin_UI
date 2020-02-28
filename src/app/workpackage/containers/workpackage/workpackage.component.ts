import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSlideToggleChange } from '@angular/material';
import { Router } from '@angular/router';
import { WorkPackageValidatorService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail-validator.service';
import { WorkPackageDetailService } from '@app/workpackage/components/workpackage-detail/services/workpackage-detail.service';
import { LoadWorkPackages, WorkPackageActionTypes, UpdateWorkPackageEntity, AddWorkPackageEntity } from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageDetail, WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State as WorkPackageState } from '../../../workpackage/store/reducers/workpackage.reducer';
import * as fromWorkPackagesEntities from '../../store/selectors/workpackage.selector';
import { WorkPackageModalComponent } from '../workpackage-modal/workpackage.component';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-workpackage',
  templateUrl: './workpackage.component.html',
  styleUrls: ['./workpackage.component.scss'],
  providers: [WorkPackageDetailService, WorkPackageValidatorService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkPackageComponent implements OnInit {
  public workpackageEntities$: Observable<WorkPackageEntity[]>;
  public selectedRowIndex: string | number;
  public workpackage: WorkPackageDetail;
  public checked: boolean;
  public selectedLeftTab: number | string;

  @ViewChild('drawer') drawer;

  constructor(
    private actions: Actions, 
    private store: Store<WorkPackageState>, 
    private router: Router, 
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadWorkPackages({}));
    this.workpackageEntities$ = this.store.pipe(select(fromWorkPackagesEntities.getAllWorkPackages));

    this.store.pipe(select(fromWorkPackagesEntities.getSelectedWorkPackage)).subscribe((workpackage: WorkPackageDetail) => {
      if (workpackage) {
        this.workpackage = workpackage;
        this.selectedRowIndex = workpackage.id;
      }
    });

    this.actions.pipe(ofType(WorkPackageActionTypes.ArchiveWorkPackage)).subscribe((action: any) => {
      if (action) {
        this.store.dispatch(new UpdateWorkPackageEntity({
          entityId: this.workpackage.id,
          workPackage: {
            data: {
              id: action.payload.workPackageId,
              archived: action.payload.archived
            }
          }
        }));
        
        this.actions.pipe(ofType(WorkPackageActionTypes.UpdateWorkPackageSuccess)).subscribe(_ => {
          this.getArchivedWorkPackages(this.checked);
        });
      }
    })

    this.actions.pipe(ofType(WorkPackageActionTypes.AddWorkPackageSuccess)).subscribe((action: any) => {
      this.selectedRowIndex = action.payload.id;
      this.onSelectWorkpackage(action.payload);
    })
  }

  onSelectWorkpackage(row: WorkPackageDetail): void {
    if (!row) {
      this.router.navigate(['work-packages'], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['work-packages', row.id], { queryParamsHandling: 'preserve' });
    }
  }

  onAddWorkPackage(): void {
    const dialogRef = this.dialog.open(WorkPackageModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.workpackage) {
        this.store.dispatch(new AddWorkPackageEntity({data: { ...data.workpackage }}));
      }
    });
  }

  showArchivedWorkPackages($event: MatSlideToggleChange): void {
    this.checked = $event.checked;
    this.getArchivedWorkPackages($event.checked);
  }

  getArchivedWorkPackages(checked: boolean): void {
    const queryParams = {
      includeArchived: (checked) ? true : false
    }
    this.store.dispatch(new LoadWorkPackages(queryParams));
  }

  openLeftTab(tab: number | string): void {
    (this.drawer.opened && this.selectedLeftTab === tab) ? this.drawer.close() : this.drawer.open();
    (typeof tab !== 'string') ? this.selectedLeftTab = tab : this.selectedLeftTab = 'menu';
    if (!this.drawer.opened) {
      this.selectedLeftTab = 'menu';
    }
  }
}
