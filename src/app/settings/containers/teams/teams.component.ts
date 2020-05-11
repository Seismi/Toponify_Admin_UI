import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadTeams, AddTeam, TeamActionTypes } from '@app/settings/store/actions/team.actions';
import { Observable, Subscription } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '../../store/reducers/team.reducer';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { MatDialog, MatSlideToggleChange } from '@angular/material';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { Router } from '@angular/router';
import { Roles } from '@app/core/directives/by-role.directive';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'smi-teams',
  templateUrl: 'teams.component.html',
  styleUrls: ['teams.component.scss']
})
export class TeamsComponent implements OnInit, OnDestroy {
  public teams$: Observable<TeamEntity[]>;
  private subscription: Subscription;
  public Roles = Roles;
  private showDisabled: boolean;

  constructor(
    private actions: Actions,
    private router: Router,
    private store: Store<TeamState>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDisabledTeams(false);
    this.teams$ = this.store.pipe(select(getTeamEntities));

    this.subscription = this.actions.pipe(ofType(TeamActionTypes.EnableTeamSuccess, TeamActionTypes.DisableTeamSuccess)).subscribe(_ => {
      if (this.showDisabled) {
        return;
      }
      this.router.navigate(['/settings/teams']);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelectTeam(team: TeamEntity): void {
    this.router.navigate([`/settings/teams/${team.id}`]);
  }

  onAddTeam(): void {
    const dialogRef = this.dialog.open(TeamModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new AddTeam(data.team));
      }
    });
  }

  getDisabledTeams(checked: boolean): void {
    const queryParams = {
      includeDisabled: checked
    };
    this.store.dispatch(new LoadTeams(queryParams));
  }

  onShowDisabledTeams($event: MatSlideToggleChange): void {
    this.showDisabled = $event.checked;
    this.getDisabledTeams($event.checked);
  }
}
