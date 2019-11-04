import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as ReportState } from '../store/reducers/report.reducer';
import { LoadReports, AddReport } from '../store/actions/report.actions';
import { Observable, Subscription } from 'rxjs';
import { ReportLibrary } from '../store/models/report.model';
import { getReportEntities } from '../store/selecrtors/report.selectors';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages, SetWorkpackageSelected, SetWorkpackageEditMode, SetWorkpackageDisplayColour } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities, getSelectedWorkpackages, getEditWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ReportModalComponent } from './report-modal/report-modal.component';
import { SharedService } from '@app/services/shared-service';

@Component({
  selector: 'smi-report-library-component',
  templateUrl: 'report-library.component.html',
  styleUrls: ['report-library.component.scss']
})
export class ReportLibraryComponent implements OnInit, OnDestroy {
  public reportEntities$: Observable<ReportLibrary[]>;
  public workpackage$: Observable<WorkPackageEntity[]>;
  public selectedLeftTab: number;
  public showOrHidePane = false;
  public hideTab = true;
  public canSelectWorkpackage: boolean = true;
  public workpackageId: string;
  public workPackageIsEditable: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    private sharedService: SharedService,
    private store: Store<ReportState>,
    private workPackageStore: Store<WorkPackageState>,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.workPackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
    this.subscriptions.push(
      this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
        const workPackageIds = workpackages.map(item => item.id);
        this.setWorkPackage(workPackageIds);
      })
    );

    this.subscriptions.push(this.workPackageStore.pipe(select(getEditWorkpackages))
      .subscribe(workpackages => {
        const edit = workpackages.map(item => item.edit);
        (!edit.length) ? this.workPackageIsEditable = true : this.workPackageIsEditable = false;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setWorkPackage(workpackageIds: string[] = []) {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.store.dispatch(new LoadReports(queryParams));
    this.reportEntities$ = this.store.pipe(select(getReportEntities));
  }

  onSelectReport(row: ReportLibrary) {
    this.router.navigate(['report-library', row.id]);
  }

  openLeftTab(index: number) {
    this.selectedLeftTab = index;
    if (this.selectedLeftTab === index) {
      this.showOrHidePane = true;
    }
  }

  hideLeftPane() {
    this.showOrHidePane = false;
  }

  onSelectWorkPackage(id: string) {
    this.workPackageStore.dispatch(new SetWorkpackageSelected({ workpackageId: id }));
  }

  onSelectEditWorkpackage(workpackage: any) {
    this.workpackageId = workpackage.id;
    this.workPackageStore.dispatch(new SetWorkpackageEditMode({ id: workpackage.id }));
  }

  onAddReport() {
    const dialogRef = this.dialog.open(ReportModalComponent, {
      disableClose: false, 
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if(data && data.report) {
        this.store.dispatch(new AddReport({
          workPackageId: this.workpackageId, 
          request: { 
            data: { ...data.report }
          }
        }))
      }
    });
  }

}
