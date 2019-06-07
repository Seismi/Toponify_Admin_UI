import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { AddTeamApiResponse, GetTeamApiResponse, GetTeamEntitiesApiResponse,
  TeamDetails, TeamEntitiesHttpParams, UpdateTeamApiResponse } from '../models/team.model';


export enum TeamActionTypes {
  LoadTeams = '[Team] Load Teams',
  LoadTeamsSuccess = '[Team] Load Teams Success',
  LoadTeamsFailure = '[Team] Load Teams Fail',

  LoadTeam = '[Team] Load Team',
  LoadTeamSuccess = '[Team] Load Team Success',
  LoadTeamFailure = '[Team] Load Team Fail',

  AddTeam = '[Team] Add Team entity',
  AddTeamSuccess = '[Team] Add Team entity Success',
  AddTeamFailure = '[Team] Add Team entity Failure',

  UpdateTeam = '[Team] Update Team entity',
  UpdateTeamSuccess = '[Team] Update Team entity Success',
  UpdateTeamFailure = '[Team] Update Team entity Failure',

  DeleteTeam = '[Team] Delete Team entity',
  DeleteTeamSuccess = '[Team] Delete Team entity Success',
  DeleteTeamFailure = '[Team] Delete Team entity Failure'
}

export class LoadTeams implements Action {
  readonly type = TeamActionTypes.LoadTeams;
  constructor(public payload: TeamEntitiesHttpParams) { }
}

export class LoadTeamsSuccess implements Action {
  readonly type = TeamActionTypes.LoadTeamsSuccess;
  constructor(public payload: GetTeamEntitiesApiResponse) { }
}

export class LoadTeamsFailure implements Action {
  readonly type = TeamActionTypes.LoadTeamsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class LoadTeam implements Action {
  readonly type = TeamActionTypes.LoadTeam;
  constructor(public payload: string) { }
}

export class LoadTeamSuccess implements Action {
  readonly type = TeamActionTypes.LoadTeamSuccess;
  constructor(public payload: GetTeamApiResponse) { }
}

export class LoadTeamFailure implements Action {
  readonly type = TeamActionTypes.LoadTeamFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class AddTeam implements Action {
  readonly type = TeamActionTypes.AddTeam;
  constructor(public payload: TeamDetails) { }
}

export class AddTeamSuccess implements Action {
  readonly type = TeamActionTypes.AddTeamSuccess;
  constructor(public payload: AddTeamApiResponse) { }
}

export class AddTeamFailure implements Action {
  readonly type = TeamActionTypes.AddTeamFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class UpdateTeam implements Action {
  readonly type = TeamActionTypes.UpdateTeam;
  constructor(public payload: {id: string, data: TeamDetails}) { }
}

export class UpdateTeamSuccess implements Action {
  readonly type = TeamActionTypes.UpdateTeamSuccess;
  constructor(public payload: UpdateTeamApiResponse) { }
}

export class UpdateTeamFailure implements Action {
  readonly type = TeamActionTypes.UpdateTeamFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class DeleteTeam implements Action {
  readonly type = TeamActionTypes.DeleteTeam;
  constructor(public payload: string) {}
}

export class DeleteTeamSuccess implements Action {
  readonly type = TeamActionTypes.DeleteTeamSuccess;
  constructor(public payload: any) {}
}

export class DeleteTeamFailure implements Action {
  readonly type = TeamActionTypes.DeleteTeamFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type TeamActionsUnion =
  | LoadTeams
  | LoadTeamsSuccess
  | LoadTeamsFailure
  | LoadTeam
  | LoadTeamSuccess
  | LoadTeamFailure
  | AddTeam
  | AddTeamSuccess
  | AddTeamFailure
  | UpdateTeam
  | UpdateTeamSuccess
  | UpdateTeamFailure
  | DeleteTeam
  | DeleteTeamSuccess
  | DeleteTeamFailure
  ;
