import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TeamService } from '../../services/team.service';
import * as TeamActions from '../actions/team.actions';
import { TeamActionTypes } from '../actions/team.actions';
import { AddTeamApiResponse, GetTeamApiResponse, GetTeamEntitiesApiResponse,
  TeamDetails, TeamEntitiesHttpParams, UpdateTeamApiResponse, MembersEntity } from '../models/team.model';


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

  @Effect()
  addMember$ = this.actions$.pipe(
    ofType<TeamActions.AddMember>(TeamActionTypes.AddMember),
    map(action => action.payload),
    switchMap((payload: {data: MembersEntity, teamId: string, userId: string}) => {
      return this.teamService.addMembers(payload.data, payload.teamId, payload.userId).pipe(
        switchMap((response: any) => [new TeamActions.AddMemberSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new TeamActions.DeleteMemberFailure(error)))
      );
    })
  );

  @Effect()
  deleteMember$ = this.actions$.pipe(
    ofType<TeamActions.DeleteMember>(TeamActionTypes.DeleteMember),
    map(action => action.payload),
    switchMap((payload: {teamId: string, userId: string}) => {
      return this.teamService.deleteMembers(payload.teamId, payload.userId).pipe(
        switchMap((response: any) => [new TeamActions.DeleteMemberSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new TeamActions.DeleteMemberFailure(error)))
      );
    })
  );
}