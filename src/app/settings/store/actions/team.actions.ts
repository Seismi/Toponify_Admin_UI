import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import {
  AddTeamApiResponse,
  GetTeamApiResponse,
  GetTeamEntitiesApiResponse,
  TeamDetails,
  TeamEntitiesHttpParams,
  UpdateTeamApiResponse,
  MembersEntity
} from '../models/team.model';

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
  DeleteTeamFailure = '[Team] Delete Team entity Failure',

  AddMember = '[Team] Add Member',
  AddMemberSuccess = '[Team] Add Member Success',
  AddMemberFailure = '[Team] Add Member Failure',

  DeleteMember = '[Team] Delete Member',
  DeleteMemberSuccess = '[Team] Delete Member Success',
  DeleteMemberFailure = '[Team] Delete Member Failure',

  DisableTeam = '[Team] Disable Team',
  DisableTeamSuccess = '[Team] Disable Team Success',
  DisableTeamFailure = '[Team] Disable Team Failure',

  EnableTeam = '[Team] Enable Team',
  EnableTeamSuccess = '[Team] Enable Team Success',
  EnableTeamFailure = '[Team] Enable Team Failure'
}

export class LoadTeams implements Action {
  readonly type = TeamActionTypes.LoadTeams;
  constructor(public payload: TeamEntitiesHttpParams) {}
}

export class LoadTeamsSuccess implements Action {
  readonly type = TeamActionTypes.LoadTeamsSuccess;
  constructor(public payload: GetTeamEntitiesApiResponse) {}
}

export class LoadTeamsFailure implements Action {
  readonly type = TeamActionTypes.LoadTeamsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadTeam implements Action {
  readonly type = TeamActionTypes.LoadTeam;
  constructor(public payload: string) {}
}

export class LoadTeamSuccess implements Action {
  readonly type = TeamActionTypes.LoadTeamSuccess;
  constructor(public payload: GetTeamApiResponse) {}
}

export class LoadTeamFailure implements Action {
  readonly type = TeamActionTypes.LoadTeamFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddTeam implements Action {
  readonly type = TeamActionTypes.AddTeam;
  constructor(public payload: TeamDetails) {}
}

export class AddTeamSuccess implements Action {
  readonly type = TeamActionTypes.AddTeamSuccess;
  constructor(public payload: AddTeamApiResponse) {}
}

export class AddTeamFailure implements Action {
  readonly type = TeamActionTypes.AddTeamFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateTeam implements Action {
  readonly type = TeamActionTypes.UpdateTeam;
  constructor(public payload: { id: string; data: TeamDetails }) {}
}

export class UpdateTeamSuccess implements Action {
  readonly type = TeamActionTypes.UpdateTeamSuccess;
  constructor(public payload: UpdateTeamApiResponse) {}
}

export class UpdateTeamFailure implements Action {
  readonly type = TeamActionTypes.UpdateTeamFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
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

export class AddMember implements Action {
  readonly type = TeamActionTypes.AddMember;
  constructor(public payload: { data: MembersEntity; teamId: string; userId: string }) {}
}

export class AddMemberSuccess implements Action {
  readonly type = TeamActionTypes.AddMemberSuccess;
  constructor(public payload: any) {}
}

export class AddMemberFailure implements Action {
  readonly type = TeamActionTypes.AddMemberFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteMember implements Action {
  readonly type = TeamActionTypes.DeleteMember;
  constructor(public payload: { teamId: string; userId: string }) {}
}

export class DeleteMemberSuccess implements Action {
  readonly type = TeamActionTypes.DeleteMemberSuccess;
  constructor(public payload: any) {}
}

export class DeleteMemberFailure implements Action {
  readonly type = TeamActionTypes.DeleteMemberFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DisableTeam implements Action {
  readonly type = TeamActionTypes.DisableTeam;
  constructor(public payload: { teamId: string }) {}
}

export class DisableTeamSuccess implements Action {
  readonly type = TeamActionTypes.DisableTeamSuccess;
  constructor(public payload: TeamDetails) {}
}

export class DisableTeamFailure implements Action {
  readonly type = TeamActionTypes.DisableTeamFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class EnableTeam implements Action {
  readonly type = TeamActionTypes.EnableTeam;
  constructor(public payload: { teamId: string }) {}
}

export class EnableTeamSuccess implements Action {
  readonly type = TeamActionTypes.EnableTeamSuccess;
  constructor(public payload: TeamDetails) {}
}

export class EnableTeamFailure implements Action {
  readonly type = TeamActionTypes.EnableTeamFailure;
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
  | AddMember
  | AddMemberSuccess
  | AddMemberFailure
  | DeleteMember
  | DeleteMemberSuccess
  | DeleteMemberFailure
  | DisableTeam
  | DisableTeamSuccess
  | DisableTeamFailure
  | EnableTeam
  | EnableTeamSuccess
  | EnableTeamFailure;
