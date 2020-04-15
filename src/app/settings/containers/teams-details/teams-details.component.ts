import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamDetailService } from '@app/settings/components/team-detail/services/team-detail.service';
import { TeamValidatorService } from '@app/settings/components/team-detail/services/team-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MemberModalComponent } from '../member-modal/member-modal.component';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { UpdateTeam, AddMember, DeleteMember, DeleteTeam, LoadTeam } from '@app/settings/store/actions/team.actions';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { getTeamSelected } from '@app/settings/store/selectors/team.selector';
import { TeamEntity } from '@app/settings/store/models/user.model';
import { MembersEntity } from '@app/settings/store/models/team.model';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';

@Component({
  selector: 'smi-teams-details',
  templateUrl: 'teams-details.component.html',
  styleUrls: ['teams-details.component.scss'],
  providers: [TeamDetailService, TeamValidatorService]
})
export class TeamsDetailsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public team: TeamEntity;
  public isEditable: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<TeamState>,
    private teamDetailService: TeamDetailService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const teamId = params['teamId'];
        this.store.dispatch(new LoadTeam(teamId));
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getTeamSelected)).subscribe(data => {
        this.team = data;
        if (data) {
          this.teamDetailService.teamDetailForm.patchValue({ ...data });
          this.isEditable = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get teamDetailForm(): FormGroup {
    return this.teamDetailService.teamDetailForm;
  }

  onEditTeam(): void {
    this.isEditable = true;
  }

  onCancelEdit(): void {
    this.isEditable = false;
  }

  onSaveTeam(): void {
    this.store.dispatch(
      new UpdateTeam({
        id: this.team.id,
        data: { id: this.team.id, ...this.teamDetailForm.value }
      })
    );
    this.isEditable = false;
  }

  onDeleteTeam(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: `Are you sure you want to disable user "${this.team.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new DeleteTeam(this.team.id));
        this.router.navigate(['/settings/teams']);
      }
    });
  }

  onAddMember(): void {
    const dialogRef = this.dialog.open(MemberModalComponent, {
      disableClose: false,
      width: '600px',
      height: '590px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.member) {
        this.store.dispatch(
          new AddMember({
            data: data.member,
            teamId: this.team.id,
            userId: data.member.id
          })
        );
      }
    });
  }

  onDeleteMember(member: MembersEntity): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: `Are you sure you want to delete "${member.firstName} ${member.lastName}"?`
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new DeleteMember({ teamId: this.team.id, userId: member.id }));
      }
    });
  }
}
