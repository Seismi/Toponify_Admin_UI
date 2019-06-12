import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TeamService } from '../../services/team.service';
import * as TeamActions from '../actions/team.actions';
import { TeamActionTypes } from '../actions/team.actions';
import { AddTeamApiResponse, GetTeamApiResponse, GetTeamEntitiesApiResponse,
  TeamDetails, TeamEntitiesHttpParams, UpdateTeamApiResponse } from '../models/team.model';


@Injectable()
export class TeamEffects {
  constructor(
    private actions$: Actions,
    private teamService: TeamService
  ) {}

  @Effect()
  loadTeams$ = this.actions$.pipe(
    ofType<TeamActions.LoadTeams>(TeamActionTypes.LoadTeams),
    map(action => action.payload),
    switchMap((payload: TeamEntitiesHttpParams) => {
      return this.teamService.getTeams(payload).pipe(
        switchMap((resp: GetTeamEntitiesApiResponse) => [new TeamActions.LoadTeamsSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new TeamActions.LoadTeamsFailure(error)))
      );
    })
  );

  @Effect()
  loadTeam$ = this.actions$.pipe(
    ofType<TeamActions.LoadTeam>(TeamActionTypes.LoadTeam),
    map(action => action.payload),
    switchMap((payload: string) => {
      return this.teamService.getTeam(payload).pipe(
        switchMap((resp: GetTeamApiResponse) => [new TeamActions.LoadTeamSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new TeamActions.LoadTeamFailure(error)))
      );
    })
  );

  @Effect()
  addTeam$ = this.actions$.pipe(
    ofType<TeamActions.AddTeam>(TeamActionTypes.AddTeam),
    map(action => action.payload),
    switchMap((payload: TeamDetails) => {
      return this.teamService.addTeam(payload).pipe(
        switchMap((resp: AddTeamApiResponse) => [new TeamActions.AddTeamSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new TeamActions.AddTeamFailure(error)))
      );
    })
  );

  @Effect()
  updateTeam$ = this.actions$.pipe(
    ofType<TeamActions.UpdateTeam>(TeamActionTypes.UpdateTeam),
    map(action => action.payload),
    switchMap((payload: {id: string, data: TeamDetails}) => {
      return this.teamService.updateTeam(payload.id, payload.data).pipe(
        switchMap((resp: UpdateTeamApiResponse) => [new TeamActions.UpdateTeamSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new TeamActions.UpdateTeamFailure(error)))
      );
    })
  );

  @Effect()
  deleteTeam$ = this.actions$.pipe(
    ofType<TeamActions.DeleteTeam>(TeamActionTypes.DeleteTeam),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.teamService.deleteTeam(id).pipe(
        switchMap(_ => [new TeamActions.DeleteTeamSuccess(id)]),
        catchError((error: HttpErrorResponse) => of(new TeamActions.DeleteTeamFailure(error)))
      );
    })
  );
}
