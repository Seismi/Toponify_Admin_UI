import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { State as ReportState } from '../../store/reducers/report.reducer';
import { select, Store } from '@ngrx/store';
import {
  AddDataSetsToReport,
  AddOwner,
  AddReportingConcepts,
  DeleteOwner,
  DeleteReport,
  DeleteReportingConcept,
  LoadReport,
  RemoveDataSetsFromReport,
  SetDimensionFilter,
  UpdateReport,
  UpdateReportProperty,
  DeleteReportProperty,
  ReportActionTypes,
  AddReportTags,
  LoadReportTags,
  DeleteReportTags,
  AddReportRadio,
  LoadReports,
  LoadDataNodes
} from '@app/report-library/store/actions/report.actions';
import { getReportSelected, getReportAvailableTags, getReportDataNodes, getReportsDetailsLoading } from '@app/report-library/store/selecrtors/report.selectors';
import { ReportLibraryDetailService } from '@app/report-library/components/report-library-detail/services/report-library.service';
import { FormGroup } from '@angular/forms';
import { Dimension, Report } from '@app/report-library/store/models/report.model';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import {
  getEditWorkpackage,
  getEditWorkpackages,
  getSelectedWorkpackages
} from '@app/workpackage/store/selectors/workpackage.selector';
import { MatDialog, MatTabGroup } from '@angular/material';
import { ReportDeleteModalComponent } from '../report-delete-modal/report-delete-modal.component';
import { OwnersModalComponent } from '@app/workpackage/containers/owners-modal/owners-modal.component';
import { OwnersEntityOrTeamEntityOrApproversEntity, Tag } from '@app/architecture/store/models/node.model';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { getNodeEntitiesBy } from '@app/architecture/store/selectors/node.selector';
import { Level } from '@app/architecture/services/diagram-level.service';
import { map, take } from 'rxjs/operators';
import { LoadNodes } from '@app/architecture/store/actions/node.actions';
import { ReportService } from '@app/report-library/services/report.service';
import { ReportingConceptFilterModalComponent } from '@app/report-library/components/reporting-concept-filter-modal/reporting-concept-filter-modal.component';
import {currentArchitecturePackageId, CustomPropertiesEntity} from '@app/workpackage/store/models/workpackage.models';
import { DeleteRadioPropertyModalComponent } from '@app/radio/containers/delete-property-modal/delete-property-modal.component';
import { SelectModalComponent } from '@app/core/layout/components/select-modal/select-modal.component';
import { Actions, ofType } from '@ngrx/effects';
import { getScopeSelected } from '@app/scope/store/selectors/scope.selector';
import { ScopeEntity } from '@app/scope/store/models/scope.model';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';
import { RadioModalComponent } from '@app/radio/containers/radio-modal/radio-modal.component';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { AddRadioEntity, RadioActionTypes } from '@app/radio/store/actions/radio.actions';
import { RadioListModalComponent } from '@app/workpackage/containers/radio-list-modal/radio-list-modal.component';

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
  public systems$: Observable<Node[]>;

  private subscriptions: Subscription[] = [];
  private reportId: string;

  workPackageIsEditable: boolean;
  workpackageId: string;
  isEditable = false;
  selectedOwner = false;
  ownerId: string;
  ownerName: string;
  selectedOwnerIndex: any = -1;
  availableTags$: Observable<Tag[]>;
  scope: ScopeEntity;
  workPackageStore$: Subscription;
  isLoading: boolean;

  constructor(
    private radioStore: Store<RadioState>,
    private teamStore: Store<TeamState>,
    private actions: Actions,
    private workPackageStore: Store<WorkPackageState>,
    private route: ActivatedRoute,
    private store: Store<ReportState>,
    private reportLibraryDetailService: ReportLibraryDetailService,
    private dialog: MatDialog,
    private nodeStore: Store<NodeState>,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.pipe(select(getReportsDetailsLoading)).subscribe(loading => this.isLoading = loading);
    this.availableTags$ = this.store.select(getReportAvailableTags);
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.reportId = params['reportId'];
        this.workPackageStore$ = this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
          const workPackageIds = workpackages.map(item => item.id);
          this.getReport(workPackageIds);
        });
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getReportSelected)).subscribe(report => {
        if (report) {
          this.report = report;
          this.reportLibraryDetailService.updateForm({...report});
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

    this.subscriptions.push(
      this.store.pipe(select(getScopeSelected)).subscribe(scope => this.scope = scope)
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(
        ReportActionTypes.AddReportTagsSuccess,
        ReportActionTypes.DeleteReportTagsSuccess
      )).subscribe(_ => {
        const queryParams = {
          workPackageQuery: [this.workpackageId],
          scopeQuery: this.scope.id
        };
        this.store.dispatch(new LoadReports(queryParams));
      })
    );
  }

  getReport(workpackageIds: string[] = []) {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.store.dispatch(new LoadReport({ id: this.reportId, queryParams: queryParams }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.workPackageStore$.unsubscribe();
  }

  get reportDetailForm(): FormGroup {
    return this.reportLibraryDetailService.reportDetailForm;
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
        this.actions.pipe(ofType(ReportActionTypes.DeleteReportSuccess)).subscribe(_ => {
          this.router.navigate(['report-library'], { queryParamsHandling: 'preserve' });
        });
      }
    });
  }

  onAddOwner() {
    const ids = new Set(this.report.owners.map(({ id }) => id));
    this.teamStore.dispatch(new LoadTeams({}));
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: `Select owner to add to owners`,
        placeholder: 'Owners',
        options$: this.teamStore.pipe(select(getTeamEntities)).pipe(
          map(data => data.filter(({ id }) => !ids.has(id)))
        ),
        selectedIds: []
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.store.dispatch(
          new AddOwner({
            workPackageId: this.workpackageId,
            reportId: this.reportId,
            ownerId: data.value[0].id
          })
        );
      }
    });
  }

  onDeleteOwner(ownerId: string) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title:
         'Are you sure you want to un-associate? Neither owners will be deleted but they will no longer be associated.'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(
          new DeleteOwner({
            workPackageId: this.workpackageId,
            reportId: this.reportId,
            ownerId: ownerId
          })
        );
      }
    });
  }

  onSaveProperties(data: { propertyId: string, value: string }): void {
    this.store.dispatch(
      new UpdateReportProperty({
        workPackageId: this.workpackageId,
        reportId: this.reportId,
        customPropertyId: data.propertyId,
        data: data.value
      })
    );
  }

  onDeleteProperties(property: CustomPropertiesEntity): void {
    const dialogRef = this.dialog.open(DeleteRadioPropertyModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: property.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(new DeleteReportProperty({
          workPackageId: this.workpackageId,
          reportId: this.reportId,
          customPropertyId: property.propertyId
        }))
      }
    });
  }

  onEditSourceSystem() {
    this.getNodesWithWorkPackageQuery(this.workpackageId);
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: 'auto',
      minWidth: '400px',
      data: {
        title: 'Select source system',
        placeholder: 'Components',
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

  getNodesWithWorkPackageQuery(workPackageId: string): void {
    const queryParams = {
      workPackageQuery: [workPackageId],
      scopeQuery: this.scope.id
    };
    this.nodeStore.dispatch(new LoadNodes(queryParams));
  }

  onAddDataSets(reportId: string) {
    this.store.dispatch(new LoadDataNodes({ workPackageId: this.workpackageId, reportId: reportId }));
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: 'auto',
      minWidth: '400px',
      data: {
        title: 'Select source data',
        placeholder: 'Components',
        multi: true,
        options$: this.store.pipe(select(getReportDataNodes)),
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

  onRemoveDataSet(dataSetId: string) {
    this.store.dispatch(
      new RemoveDataSetsFromReport({
        workPackageId: this.workpackageId,
        reportId: this.reportId,
        dataSetId: dataSetId
      })
    );
  }

  onDimensionEdit(dimension: Dimension, reportId: string) {
    const dialogRef = this.dialog.open(ReportingConceptFilterModalComponent, {
      disableClose: false,
      width: 'auto',
      minWidth: '600px',
      data: {
        title: 'Select source data nodes',
        workpackageId: this.workpackageId,
        dimension,
        reportId
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.filter) {
        this.store.dispatch(
          new SetDimensionFilter({
            workPackageId: this.workpackageId,
            reportId,
            dimensionId: dimension.id,
            filter: data.filter
          })
        );
        if (data.filter === 'selected') {
          data.unlinked.forEach(concept =>
            this.store.dispatch(
              new DeleteReportingConcept({
                workPackageId: this.workpackageId,
                reportId,
                dimensionId: dimension.id,
                conceptId: concept.id
              })
            )
          );
          this.store.dispatch(
            new AddReportingConcepts({
              workPackageId: this.workpackageId,
              reportId,
              dimensionId: dimension.id,
              concepts: data.added.map(conept => ({ id: conept.id }))
            })
          );
        }
      }
    });
  }

  onUpdateAvailableTags(): void {
    this.store
      .pipe(
        select(getReportAvailableTags),
        take(1)
      )
      .subscribe(tags => {
        if (!this.workpackageId) {
          return;
        }
        this.store.dispatch(
          new LoadReportTags({
            workPackageId: this.workpackageId,
            reportId: this.reportId
          })
        );
      });
  }

  onAddTag(tagId: string): void {
    this.store.dispatch(
      new AddReportTags({
        workPackageId: this.workpackageId,
        reportId: this.report.id,
        tagIds: [{ id: tagId }]
      })
    );
  }

  onRemoveTag(tag: Tag): void {
    this.store.dispatch(
      new DeleteReportTags({
        workPackageId: this.workpackageId,
        reportId: this.report.id,
        tagId: tag.id
      })
    );
  }

  onRaiseNew(): void {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false,
      width: '800px',
      data: {
        selectedNode: this.report,
        selectWorkPackages: true,
        message: `This RADIO will be associated to the following work packages:`
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if ((data && data.radio) || data && data.selectedWorkPackages) {
        this.radioStore.dispatch(new AddRadioEntity({ data: { ...data.radio } }));
        this.actions.pipe(ofType(RadioActionTypes.AddRadioSuccess)).subscribe((action: any) => {
          const radioId = action.payload.id;
          if (action) {
            data.selectedWorkPackages.forEach(workpackage => {
              this.store.dispatch(
                new AddReportRadio({
                  workPackageId: workpackage.id,
                  reportId: this.reportId,
                  radioId: radioId
                })
              );
            });
          }
        });
      }
    });
  }

  onAssignRadio(): void {
    const dialogRef = this.dialog.open(RadioListModalComponent, {
      disableClose: false,
      width: '650px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        this.store.dispatch(
          new AddReportRadio({
            workPackageId: (this.workpackageId) ? this.workpackageId : currentArchitecturePackageId,
            reportId: this.reportId,
            radioId: data.radio.id
          })
        );
      }
    });

    dialogRef.componentInstance.addNewRadio.subscribe(() => {
      this.onRaiseNew();
    });
  }

}
