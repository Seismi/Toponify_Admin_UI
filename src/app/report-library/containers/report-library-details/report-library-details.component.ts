import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { State as ReportState } from '../../store/reducers/report.reducer';
import { select, Store } from '@ngrx/store';
import {
  AddDataSetsToReport,
  AddOwner,
  DeleteOwner,
  DeleteReport,
  LoadReport, RemoveDataSetsFromReport,
  UpdateReport
} from '@app/report-library/store/actions/report.actions';
import { getReportSelected } from '@app/report-library/store/selecrtors/report.selectors';
import { ReportLibraryDetailService } from '@app/report-library/components/report-library-detail/services/report-library.service';
import { FormGroup } from '@angular/forms';
import { Report } from '@app/report-library/store/models/report.model';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import {
  getEditWorkpackage,
  getEditWorkpackages,
  getSelectedWorkpackages
} from '@app/workpackage/store/selectors/workpackage.selector';
import { MatDialog } from '@angular/material';
import { ReportDeleteModalComponent } from '../report-delete-modal/report-delete-modal.component';
import { OwnersModalComponent } from '@app/workpackage/containers/owners-modal/owners-modal.component';
import { OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node.model';
import { SelectModalComponent } from '@app/report-library/components/select-modal/select-modal.component';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { getNodeEntitiesBy } from '@app/architecture/store/selectors/node.selector';
import { Level } from '@app/architecture/services/diagram-level.service';
import { map, take } from 'rxjs/operators';
import { LoadNodes } from '@app/architecture/store/actions/node.actions';
import { ReportService } from '@app/report-library/services/report.service';

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
  isEditable = false;
  selectedOwner = false;
  ownerId: string;
  ownerName: string;
  selectedOwnerIndex: any = -1;

  constructor(
    private workPackageStore: Store<WorkPackageState>,
    private route: ActivatedRoute,
    private store: Store<ReportState>,
    private reportLibraryDetailService: ReportLibraryDetailService,
    private dialog: MatDialog,
    private nodeStore: Store<NodeState>,
    private reportService: ReportService
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

  onEditSourceSystem() {
    this.nodeStore.dispatch(new LoadNodes());
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: 'auto',
      minWidth: '400px',
      data: {
        title: 'Select source system',
        options$: this.nodeStore.pipe(select(getNodeEntitiesBy, { layer: Level.system })),
        selectedIds: this.report.system ? [this.report.system.id] : []
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.workPackageStore
          .select(getEditWorkpackage)
          .pipe(take(1))
          .subscribe(editWpId => {
            this.store.dispatch(
              new UpdateReport({
                workPackageId: editWpId,
                reportId: this.report.id,
                request: { data: { ...this.report, system: data.value[0] } }
              })
            );
          });
      }
    });
  }

  onAddDataSets(reportId: string) {
    // this.reportService
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: 'auto',
      minWidth: '400px',
      data: {
        title: 'Select source data sets',
        multi: true,
        options$: this.reportService.getDataSets(this.workpackageId, reportId).pipe(
          take(1),
          map(data => data.data.filter(dataSet => !this.report.dataSets.some(ds => ds.id === dataSet.id)))
        ),
        selectedIds: []
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.store.dispatch(
          new AddDataSetsToReport({
            workPackageId: this.workpackageId,
            reportId: this.report.id,
            ids: data.value
          })
        );
      }
    });
  }

  onRemoveDataSet(dataSetId: string, reportId: string) {
    this.store.dispatch(
      new RemoveDataSetsFromReport({
        workPackageId: this.workpackageId,
        reportId: reportId,
        dataSetId: dataSetId
      })
    );
  }
}
