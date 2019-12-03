import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { State as ReportState } from '../../store/reducers/report.reducer';
import { select, Store } from '@ngrx/store';
import {
  LoadReport,
  DeleteReport,
  UpdateReport,
  AddOwner,
  DeleteOwner
} from '@app/report-library/store/actions/report.actions';
import { getReportSelected } from '@app/report-library/store/selecrtors/report.selectors';
import { ReportLibraryDetailService } from '@app/report-library/components/report-library-detail/services/report-library.service';
import { FormGroup } from '@angular/forms';
import { Report } from '@app/report-library/store/models/report.model';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkpackages, getEditWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { MatDialog } from '@angular/material';
import { ReportDeleteModalComponent } from '../report-delete-modal/report-delete-modal.component';
import { OwnersModalComponent } from '@app/workpackage/containers/owners-modal/owners-modal.component';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-report-library--details-component',
  templateUrl: 'report-library-details.component.html',
  styleUrls: ['report-library-details.component.scss'],
  providers: [ReportLibraryDetailService]
})
export class ReportLibraryDetailsComponent implements OnInit, OnDestroy {
  public report: Report;
  public selectedRightTab: number;
  public showOrHideRightPane = false;

  private subscriptions: Subscription[] = [];
  private reportId: string;

  workPackageIsEditable: boolean;
  workpackageId: string;
  isEditable: boolean = false;
  selectedOwner: boolean = false;
  ownerId: string;
  ownerName: string;
  selectedOwnerIndex: any = -1;

  constructor(
    private workPackageStore: Store<WorkPackageState>,
    private route: ActivatedRoute,
    private store: Store<ReportState>,
    private reportLibraryDetailService: ReportLibraryDetailService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.reportId = params['reportId'];
        this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
          const workPackageIds = workpackages.map(item => item.id);
          this.setWorkPackage(workPackageIds);
        });
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getReportSelected)).subscribe(report => {
        this.report = report;
        if (report) {
          this.reportLibraryDetailService.reportDetailForm.patchValue({
            name: report.name,
            description: report.description
          });
          this.isEditable = false;
        }
      })
    );

    this.subscriptions.push(
      this.workPackageStore.pipe(select(getEditWorkpackages)).subscribe(workpackages => {
        const edit = workpackages.map(item => item.edit);
        const workPackageId = workpackages.map(item => item.id);
        this.workpackageId = workPackageId[0];
        edit.length ? (this.workPackageIsEditable = true) : (this.workPackageIsEditable = false);
      })
    );
  }

  setWorkPackage(workpackageIds: string[] = []) {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.store.dispatch(new LoadReport({ id: this.reportId, queryParams: queryParams }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get reportDetailForm(): FormGroup {
    return this.reportLibraryDetailService.reportDetailForm;
  }

  openRightTab(index: number) {
    this.selectedRightTab = index;
    if (this.selectedRightTab === index) {
      this.showOrHideRightPane = false;
    }
  }

  onHideRightPane() {
    this.showOrHideRightPane = true;
  }

  onSaveReport() {
    this.isEditable = false;
    this.selectedOwnerIndex = null;
    this.selectedOwner = false;
    this.store.dispatch(
      new UpdateReport({
        workPackageId: this.workpackageId,
        reportId: this.reportId,
        request: {
          data: {
            id: this.reportId,
            name: this.reportDetailForm.value.name,
            description: this.reportDetailForm.value.description
          }
        }
      })
    );
  }

  onEditReport() {
    this.isEditable = true;
  }

  onCancel() {
    this.isEditable = false;
    this.selectedOwner = false;
    this.selectedOwnerIndex = null;
  }

  onDeleteReport() {
    const dialogRef = this.dialog.open(ReportDeleteModalComponent, {
      disableClose: false,
      data: {
        mode: 'delete',
        name: this.report.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(
          new DeleteReport({
            workPackageId: this.workpackageId,
            reportId: this.reportId
          })
        );
      }
    });
  }

  onAddOwner() {
    const dialogRef = this.dialog.open(OwnersModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.owner) {
        this.store.dispatch(
          new AddOwner({
            workPackageId: this.workpackageId,
            reportId: this.reportId,
            ownerId: data.owner.id
          })
        );
      }
      this.isEditable = true;
    });
  }

  onSelectOwner(owner: OwnersEntityOrTeamEntityOrApproversEntity) {
    this.ownerId = owner.id;
    this.ownerName = owner.name;
    this.selectedOwner = true;
    this.selectedOwnerIndex = owner.id;
  }

  onDeleteOwner() {
    const dialogRef = this.dialog.open(ReportDeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: this.ownerName
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(
          new DeleteOwner({
            workPackageId: this.workpackageId,
            reportId: this.reportId,
            ownerId: this.ownerId
          })
        );
        this.selectedOwner = false;
        this.isEditable = true;
      }
    });
  }
}
