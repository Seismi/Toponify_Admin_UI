import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { select, Store } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { ReportLibraryDetailService } from '@app/report-library/components/report-library-detail/services/report-library.service';
import { ReportLibraryDetailValidatorService } from '@app/report-library/components/report-library-detail/services/report-library-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { Node } from '@app/architecture/store/models/node.model';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { getNodeEntitiesBy } from '@app/architecture/store/selectors/node.selector';
import { Level } from '@app/architecture/services/diagram-level.service';
import { LoadNodes } from '@app/architecture/store/actions/node.actions';

@Component({
  selector: 'smi-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
  providers: [ReportLibraryDetailService, ReportLibraryDetailValidatorService]
})
export class ReportModalComponent implements OnInit {
  public owners$: Observable<TeamEntity[]>;
  public systems$: Observable<Node[]>;

  constructor(
    private nodeStore: Store<NodeState>,
    private reportLibraryDetailService: ReportLibraryDetailService,
    public dialogRef: MatDialogRef<ReportModalComponent>,
    private teamStore: Store<TeamState>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  get reportDetailForm(): FormGroup {
    return this.reportLibraryDetailService.reportDetailForm;
  }

  ngOnInit() {
    this.nodeStore.dispatch(new LoadNodes());
    this.teamStore.dispatch(new LoadTeams({}));
    this.owners$ = this.teamStore.pipe(select(getTeamEntities));
    this.systems$ = this.nodeStore.pipe(select(getNodeEntitiesBy, { layer: Level.system }));
  }

  onSubmit() {
    if (!this.reportLibraryDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ report: this.reportDetailForm.value });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
