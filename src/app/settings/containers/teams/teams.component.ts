import { Component, OnInit } from '@angular/core';
import { LoadTeams, LoadTeam, AddTeam, DeleteTeam, UpdateTeam, AddMember, DeleteMember } from '@app/settings/store/actions/team.actions';
import { Observable } from 'rxjs';
import { TeamEntity, TeamDetails } from '@app/settings/store/models/team.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '../../store/reducers/team.reducer';
import { getTeamEntities, getTeamSelected } from '@app/settings/store/selectors/team.selector';
import { TeamDetailService } from '@app/settings/components/team-detail/services/team-detail.service';
import { TeamValidatorService } from '@app/settings/components/team-detail/services/team-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { DeleteTeamAndMemberModalComponent } from '../delete-modal/delete-modal.component';
import { MemberModalComponent } from '../member-modal/member-modal.component';

@Component({
  selector: 'smi-teams',
  templateUrl: 'teams.component.html',
  styleUrls: ['teams.component.scss'],
  providers: [TeamDetailService, TeamValidatorService]
})
export class TeamsComponent implements OnInit {

  public teams$: Observable<TeamEntity[]>;
  public teamSelected: boolean = false;
  public isTeamEditable: boolean = false;
  public teamId: string;
  public selectedTeam: TeamDetails;

  constructor(
    private store: Store<TeamState>,
    private teamDetailService: TeamDetailService,
    private dialog: MatDialog
  ) { }

  ngOnInit() { 
    this.store.dispatch(new LoadTeams({}));
    this.teams$ = this.store.pipe(select(getTeamEntities));
  }

  get teamDetailForm(): FormGroup {
    return this.teamDetailService.teamDetailForm;
  }

  onSelectTeam(row) {
    this.teamSelected = true;
    this.teamId = row.id;

    this.store.dispatch(new LoadTeam(this.teamId));
    this.store.pipe(select(getTeamSelected)).subscribe(team => {
      this.selectedTeam = team;
      if (this.selectedTeam) {
        this.teamDetailService.teamDetailForm.patchValue({
          name: this.selectedTeam.name,
          description: this.selectedTeam.description
        });
      }
    });
  }

  onSaveTeam() {
    this.isTeamEditable = false;
    this.store.dispatch(
      new UpdateTeam({
        id: this.teamId,
        data: {
          id: this.teamId,
          name: this.teamDetailForm.value.name,
          description: this.teamDetailForm.value.description,
          type: 'team'
        }
      })
    );
  }


  onNewTeam() {
    const dialogRef = this.dialog.open(TeamModalComponent, {
      disableClose: false,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new AddTeam(data.team));
      }
    });
  }

  onEditTeam() {
    this.isTeamEditable = true;
  }

  onAddMember() {
    const dialogRef = this.dialog.open(MemberModalComponent, {
      disableClose: false,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.member) {
        this.store.dispatch(
          new AddMember({
            data: data.member,
            teamId: this.teamId,
            userId: data.member.id
          })
        );
      }
    });
  }

  onDeleteTeam() {
    const dialogRef = this.dialog.open(DeleteTeamAndMemberModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(new DeleteTeam(this.teamId));
      }
      this.teamSelected = false;
    });
  }

  onDeleteMember(memberId) {
    const dialogRef = this.dialog.open(DeleteTeamAndMemberModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(new DeleteMember({ teamId: this.teamId, userId: memberId }));
      }
    });
  }

  onCancelEdit() {
    this.isTeamEditable = false;
  }

}