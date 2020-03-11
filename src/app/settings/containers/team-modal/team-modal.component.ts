import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TeamValidatorService } from '@app/settings/components/team-detail/services/team-detail-validator.service';
import { TeamDetailService } from '@app/settings/components/team-detail/services/team-detail.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TeamDetails } from '@app/settings/store/models/team.model';

@Component({
  selector: 'smi-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.scss'],
  providers: [TeamDetailService, TeamValidatorService]
})
export class TeamModalComponent {
  public modalMode: boolean = true;
  public isEditable: boolean = true;
  public team: TeamDetails;

  constructor(
    public dialogRef: MatDialogRef<TeamModalComponent>,
    private teamDetailService: TeamDetailService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.team = data;
  }

  get teamDetailForm(): FormGroup {
    return this.teamDetailService.teamDetailForm;
  }
  
  onSave(): void {
    if (!this.teamDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ team: this.teamDetailForm.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
