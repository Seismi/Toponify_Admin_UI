import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { ReportLibraryDetailService } from '@app/report-library/components/report-library-detail/services/report-library.service';
import { ReportLibraryDetailValidatorService } from '@app/report-library/components/report-library-detail/services/report-library-detail-validator.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
  providers: [ReportLibraryDetailService, ReportLibraryDetailValidatorService]
})

export class ReportModalComponent implements OnInit {

  owners$: Observable<TeamEntity[]>;

  constructor(
    private reportLibraryDetailService: ReportLibraryDetailService,
    public dialogRef: MatDialogRef<ReportModalComponent>,
    private teamStore: Store<TeamState>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  get reportDetailForm(): FormGroup {
    return this.reportLibraryDetailService.reportDetailForm;
  }

  ngOnInit() { 
    this.teamStore.dispatch(new LoadTeams({}));
    this.owners$ = this.teamStore.pipe(select(getTeamEntities));
  }

  onSubmit() {
    if (!this.reportLibraryDetailService.isValid) {
      return;
    }
    
    this.dialogRef.close({ report: this.reportDetailForm.value })
  }

  onCancel() {
    this.dialogRef.close();
  }

}