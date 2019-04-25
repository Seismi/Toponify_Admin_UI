import { LinkType } from '@app/version/services/diagram-link.service';
import { Action } from '@ngrx/store';

export enum VersionLinkActionTypes {
  DeleteLink = '[Link] Delete Link',
  DeleteLinkSuccess = '[Link] Delete Link Success',
  DeleteLinkFailure = '[Link] Delete Link Fail',
  LoadLinkDescendants = '[Version] Load Link descendants',
  LoadLinkDescendantsSuccess = '[Version] Load Link descendants success',
  LoadLinkDescendantsFailure = '[Version] Load Link descendants failure'
}

// TODO: consider to move seperately link actions. for ex. link.actions.ts
export class LoadLinkDescendants implements Action {
  readonly type = VersionLinkActionTypes.LoadLinkDescendants;
  constructor(public payload: {versionId: string, linkId: string, linkType: LinkType}) {}
}

export class LoadLinkDescendantsSuccess implements Action {
  readonly type = VersionLinkActionTypes.LoadLinkDescendantsSuccess;
  constructor(public payload: any) {}
}

export class LoadLinkDescendantsFailure implements Action {
  readonly type = VersionLinkActionTypes.LoadLinkDescendantsFailure;
  constructor(public payload: any) {}
}

export class DeleteLink implements Action {
  readonly type = VersionLinkActionTypes.DeleteLink;
  constructor(public payload: {versionId: string, linkId: string, linkType: LinkType}) {}
}

export class DeleteLinkSuccess implements Action {
  readonly type = VersionLinkActionTypes.DeleteLinkSuccess;
  constructor(public payload: any) {}
}

export class DeleteLinkFailure implements Action {
  readonly type = VersionLinkActionTypes.DeleteLinkFailure;
  constructor(public payload: any) {}
}


export type VersionLinkActionsUnion =
  | LoadLinkDescendants
  | LoadLinkDescendantsSuccess
  | LoadLinkDescendantsFailure
  | DeleteLink
  | DeleteLinkSuccess
  | DeleteLinkFailure;
