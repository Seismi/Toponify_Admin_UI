import { Component, OnInit } from '@angular/core';
import { LoadTeams, AddTeam } from '@app/settings/store/actions/team.actions';
import { Observable } from 'rxjs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '../../store/reducers/team.reducer';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { MatDialog } from '@angular/material';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { Router } from '@angular/router';
import { Roles } from '@app/core/directives/by-role.directive';

@Component({
  selector: 'smi-teams',
  templateUrl: 'teams.component.html',
  styleUrls: ['teams.component.scss']
})
export class TeamsComponent implements OnInit {
  public teams$: Observable<TeamEntity[]>;

  public Roles = Roles;

  constructor(private router: Router, private store: Store<TeamState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadTeams({}));
    this.teams$ = this.store.pipe(select(getTeamEntities));
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
}
