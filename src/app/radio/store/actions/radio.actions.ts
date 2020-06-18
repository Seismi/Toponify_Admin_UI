import { Action } from '@ngrx/store';
import {
  RadioEntitiesHttpParams,
  RadioEntitiesResponse,
  RadioDetail,
  RadioApiRequest,
  RadioEntity,
  ReplyApiRequest,
  AdvancedSearchApiRequest,
  RadiosAdvancedSearch
} from '../models/radio.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Tag } from '@app/architecture/store/models/node.model';

export enum RadioActionTypes {
  LoadRadios = '[Radio] Load Radio entities',
  LoadRadiosSuccess = '[Radio] Load Radio entities Success',
  LoadRadiosFailure = '[Radio] Load Radio entities Fail',

  LoadRadio = '[Radio] Load Radio',
  LoadRadioSuccess = '[Radio] Load Radio Success',
  LoadRadioFailure = '[Radio] Load Radio Fail',

  AddRadio = '[Radio] Add Radio entity',
  AddRadioSuccess = '[Radio] Add Radio entity Success',
  AddRadioFailure = '[Radio] Add Radio entity Failure',

  AddReply = '[Radio] Add Reply',
  AddReplySuccess = '[Radio] Add Reply Success',
  AddReplyFailure = '[Radio] Add Reply Failure',

  UpdateRadioProperty = '[Radio] Update Radio Property',
  UpdateRadioPropertySuccess = '[Radio] Update Radio Property Success',
  UpdateRadioPropertyFailure = 'Update Radio Property Failure',

  DeleteRadioProperty = '[Radio] Delete Radio Property',
  DeleteRadioPropertySuccess = '[Radio] Delete Radio Property Success',
  DeleteRadioPropertyFailure = '[Radio] Delete Radio Property Failure',

  SearchRadio = '[Radio] Search Radio',
  SearchRadioSuccess = '[Radio] Search Radio Success',
  SearchRadioFailure = '[Radio] Search Radio Failure',

  RadioFilter = '[Radio] Load Radio Filter Data',
  SetRadioAnalysisFilter = '[Radio] Set Radio analysis filter',
  SetRadioMatrixFilter = '[Radio] Set Radio matrix filter',

  AssociateRadio = '[Radio] Associate Radio entity',
  AssociateRadioSuccess = '[Radio] Associate Radio entity Success',
  AssociateRadioFailure = '[Radio] Associate Radio entity Failure',

  DissociateRadio = '[Radio] Dissociate Radio entity',
  DissociateRadioSuccess = '[Radio] Dissociate Radio entity Success',
  DissociateRadioFailure = '[Radio] Dissociate Radio entity Failure',

  DeleteRadioEntity = '[Radio] Delete Radio Entity',
  DeleteRadioEntitySuccess = '[Radio] Delete Radio Entity Success',
  DeleteRadioEntityFailure = '[Radio] Delete Radio Entity Failure',

  LoadRadioTags = '[Radio] Load Radio Tags',
  LoadRadioTagsSuccess = '[Radio] Load Radio Tags Success',
  LoadRadioTagsFail = '[Radio] Load Radio Tags Fail',

  AddRadioTags = '[Radio] Add Radio Tags',
  AddRadioTagsSuccess = '[Radio] Add Radio Tags Success',
  AddRadioTagsFail = '[Radio] Add Radio Tags Fail',

  DeleteRadioTags = '[Radio] Delete Radio Tags',
  DeleteRadioTagsSuccess = '[Radio] Delete Radio Tags Success',
  DeleteRadioTagsFail = '[Radio] Delete Radio Tags Fail',

  CreateRadioView = '[Radio] Create radio view',
  CreateRadioViewSuccess = '[Radio] Create radio view Success',
  CreateRadioViewFail = '[Radio] Create radio view Fail',

  UpdateRadioView = '[Radio] Update radio view',
  UpdateRadioViewSuccess = '[Radio] Update radio view Success',
  UpdateRadioViewFail = '[Radio] Update radio view Fail',

  DeleteRadioView = '[Radio] Delete radio view',
  DeleteRadioViewSuccess = '[Radio] Delete radio view Success',
  DeleteRadioViewFail = '[Radio] Delete radio view Fail',

  GetRadioViews = '[Radio] get radio views',
  GetRadioViewsSuccess = '[Radio] get radio views success',
  GetRadioViewsFail = '[Radio] get radio views Fail',

  GetRadioView = '[Radio] get radio view',
  GetRadioViewSuccess = '[Radio] get radio view success',
  GetRadioViewFail = '[Radio] get radio view Fail',

  SetRadioViewAsFavourite = '[Radio] set radio view as favourite',
  SetRadioViewAsFavouriteSuccess = '[Radio] set radio view as favourite success',
  SetRadioViewAsFavouriteFail = '[Radio] set radio view as favourite fail',

  UnsetRadioViewAsFavourite = '[Radio] unset radio view as favourite',
  UnsetRadioViewAsFavouriteSuccess = '[Radio] unset radio view as favourite success',
  UnsetRadioViewAsFavouriteFail = '[Radio] unset radio view as favourite fail',

  GetRadioMatrix = '[Radio] Get matrix',
  GetRadioMatrixSuccess = '[Radio] Get matrix success',
  GetRadioMatrixFailure = '[Radio] Get matrix failure',

  GetRadioAnalysis = '[Radio] Get analysis',
  GetRadioAnalysisSuccess = '[Radio] Get analysis success',
  GetRadioAnalysisFailure = '[Radio] Get analysis failure'
}

export class SetRadioViewAsFavourite implements Action {
  readonly type = RadioActionTypes.SetRadioViewAsFavourite;
  constructor(public payload: string) {}
}

export class SetRadioViewAsFavouriteSuccess implements Action {
  readonly type = RadioActionTypes.SetRadioViewAsFavouriteSuccess;
  constructor(public payload: string) {}
}

export class SetRadioViewAsFavouriteFail implements Action {
  readonly type = RadioActionTypes.SetRadioViewAsFavouriteFail;
  constructor(public payload: any) {}
}

export class UnsetRadioViewAsFavourite implements Action {
  readonly type = RadioActionTypes.UnsetRadioViewAsFavourite;
  constructor(public payload: string) {}
}

export class UnsetRadioViewAsFavouriteSuccess implements Action {
  readonly type = RadioActionTypes.UnsetRadioViewAsFavouriteSuccess;
  constructor(public payload: string) {}
}

export class UnsetRadioViewAsFavouriteFail implements Action {
  readonly type = RadioActionTypes.UnsetRadioViewAsFavouriteFail;
  constructor(public payload: any) {}
}

export class CreateRadioView implements Action {
  readonly type = RadioActionTypes.CreateRadioView;
  constructor(public payload: any) {}
}

export class CreateRadioViewSuccess implements Action {
  readonly type = RadioActionTypes.CreateRadioViewSuccess;
  constructor(public payload: any) {}
}

export class CreateRadioViewFail implements Action {
  readonly type = RadioActionTypes.CreateRadioViewFail;
  constructor(public payload: any) {}
}

export class UpdateRadioView implements Action {
  readonly type = RadioActionTypes.UpdateRadioView;
  constructor(public payload: { radioViewId: string; radioViewData: any }) {}
}

export class UpdateRadioViewSuccess implements Action {
  readonly type = RadioActionTypes.UpdateRadioViewSuccess;
  constructor(public payload: any) {}
}

export class UpdateRadioViewFail implements Action {
  readonly type = RadioActionTypes.UpdateRadioViewFail;
  constructor(public payload: any) {}
}

export class DeleteRadioView implements Action {
  readonly type = RadioActionTypes.DeleteRadioView;
  constructor(public payload: any) {}
}

export class DeleteRadioViewSuccess implements Action {
  readonly type = RadioActionTypes.DeleteRadioViewSuccess;
  constructor(public payload: any) {}
}

export class DeleteRadioViewFail implements Action {
  readonly type = RadioActionTypes.DeleteRadioViewFail;
  constructor(public payload: any) {}
}

export class GetRadioViews implements Action {
  readonly type = RadioActionTypes.GetRadioViews;
}

export class GetRadioViewsSuccess implements Action {
  readonly type = RadioActionTypes.GetRadioViewsSuccess;
  constructor(public payload: any) {}
}

export class GetRadioViewsFail implements Action {
  readonly type = RadioActionTypes.GetRadioViewsFail;
  constructor(public payload: any) {}
}

export class GetRadioView implements Action {
  readonly type = RadioActionTypes.GetRadioView;
  constructor(public payload: any) {}
}

export class GetRadioViewSuccess implements Action {
  readonly type = RadioActionTypes.GetRadioViewSuccess;
  constructor(public payload: any) {}
}

export class GetRadioViewFail implements Action {
  readonly type = RadioActionTypes.GetRadioViewFail;
  constructor(public payload: any) {}
}

export class LoadRadios implements Action {
  readonly type = RadioActionTypes.LoadRadios;
  constructor(public payload: RadioEntitiesHttpParams) {}
}

export class LoadRadiosSuccess implements Action {
  readonly type = RadioActionTypes.LoadRadiosSuccess;
  constructor(public payload: RadioEntitiesResponse) {}
}

export class LoadRadiosFailure implements Action {
  readonly type = RadioActionTypes.LoadRadiosFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadRadio implements Action {
  readonly type = RadioActionTypes.LoadRadio;
  constructor(public payload: string) {}
}

export class LoadRadioSuccess implements Action {
  readonly type = RadioActionTypes.LoadRadioSuccess;
  constructor(public payload: RadioDetail) {}
}

export class LoadRadioFailure implements Action {
  readonly type = RadioActionTypes.LoadRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddRadioEntity implements Action {
  readonly type = RadioActionTypes.AddRadio;
  constructor(public payload: RadioApiRequest) {}
}

export class AddRadioEntitySuccess implements Action {
  readonly type = RadioActionTypes.AddRadioSuccess;
  constructor(public payload: RadioEntity) {}
}

export class AddRadioEntityFailure implements Action {
  readonly type = RadioActionTypes.AddRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddReply implements Action {
  readonly type = RadioActionTypes.AddReply;
  constructor(public payload: { entity: ReplyApiRequest; id: string }) {}
}

export class AddReplySuccess implements Action {
  readonly type = RadioActionTypes.AddReplySuccess;
  constructor(public payload: RadioDetail) {}
}

export class AddReplyFailure implements Action {
  readonly type = RadioActionTypes.AddReplyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateRadioProperty implements Action {
  readonly type = RadioActionTypes.UpdateRadioProperty;
  constructor(public payload: { radioId: string; customPropertyId: string; data: any }) {}
}

export class UpdateRadioPropertySuccess implements Action {
  readonly type = RadioActionTypes.UpdateRadioPropertySuccess;
  constructor(public payload: RadioDetail) {}
}

export class UpdateRadioPropertyFailure implements Action {
  readonly type = RadioActionTypes.UpdateRadioPropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteRadioProperty implements Action {
  readonly type = RadioActionTypes.DeleteRadioProperty;
  constructor(public payload: { radioId: string; customPropertyId: string }) {}
}

export class DeleteRadioPropertySuccess implements Action {
  readonly type = RadioActionTypes.DeleteRadioPropertySuccess;
  constructor(public payload: RadioDetail) {}
}

export class DeleteRadioPropertyFailure implements Action {
  readonly type = RadioActionTypes.DeleteRadioPropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class SearchRadio implements Action {
  readonly type = RadioActionTypes.SearchRadio;
  constructor(public payload: AdvancedSearchApiRequest) {}
}

export class SearchRadioSuccess implements Action {
  readonly type = RadioActionTypes.SearchRadioSuccess;
  constructor(public payload: RadioEntitiesResponse) {}
}

export class SearchRadioFailure implements Action {
  readonly type = RadioActionTypes.SearchRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class GetRadioMatrix implements Action {
  readonly type = RadioActionTypes.GetRadioMatrix;
  constructor(public payload: AdvancedSearchApiRequest) {}
}

export class GetRadioMatrixSuccess implements Action {
  readonly type = RadioActionTypes.GetRadioMatrixSuccess;
  constructor(public payload: any) {}
}

export class GetRadioMatrixFailure implements Action {
  readonly type = RadioActionTypes.GetRadioMatrixFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class GetRadioAnalysis implements Action {
  readonly type = RadioActionTypes.GetRadioAnalysis;
  constructor(public payload: AdvancedSearchApiRequest) {}
}

export class GetRadioAnalysisSuccess implements Action {
  readonly type = RadioActionTypes.GetRadioAnalysisSuccess;
  constructor(public payload: any) {}
}

export class GetRadioAnalysisFailure implements Action {
  readonly type = RadioActionTypes.GetRadioAnalysisFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class RadioFilter implements Action {
  readonly type = RadioActionTypes.RadioFilter;
  constructor(public payload: RadiosAdvancedSearch) {}
}

export class SetRadioAnalysisFilter implements Action {
  readonly type = RadioActionTypes.SetRadioAnalysisFilter;
  constructor(public payload: any) {}
}

export class SetRadioMatrixFilter implements Action {
  readonly type = RadioActionTypes.SetRadioMatrixFilter;
  constructor(public payload: any) {}
}

export class AssociateRadio implements Action {
  readonly type = RadioActionTypes.AssociateRadio;
  constructor(public payload: { workpackageId: string; nodeId: string; radio: RadioDetail }) {}
}

export class AssociateRadioSuccess implements Action {
  readonly type = RadioActionTypes.AssociateRadioSuccess;
  constructor(public payload: RadioEntitiesResponse) {}
}

export class AssociateRadioFailure implements Action {
  readonly type = RadioActionTypes.AssociateRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DissociateRadio implements Action {
  readonly type = RadioActionTypes.DissociateRadio;
  constructor(public payload: { workpackageId: string; nodeId: string; radioId: string }) {}
}

export class DissociateRadioSuccess implements Action {
  readonly type = RadioActionTypes.DissociateRadioSuccess;
  constructor(public payload: RadioEntitiesResponse) {}
}

export class DissociateRadioFailure implements Action {
  readonly type = RadioActionTypes.DissociateRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteRadioEntity implements Action {
  readonly type = RadioActionTypes.DeleteRadioEntity;
  constructor(public payload: string) {}
}

export class DeleteRadioEntitySuccess implements Action {
  readonly type = RadioActionTypes.DeleteRadioEntitySuccess;
  constructor(public payload: string) {}
}

export class DeleteRadioEntityFailure implements Action {
  readonly type = RadioActionTypes.DeleteRadioEntityFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadRadioTags implements Action {
  readonly type = RadioActionTypes.LoadRadioTags;
  constructor(public payload: { radioId: string }) {}
}

export class LoadRadioTagsSuccess implements Action {
  readonly type = RadioActionTypes.LoadRadioTagsSuccess;
  constructor(public payload: Tag[]) {}
}

export class LoadRadioTagsFail implements Action {
  readonly type = RadioActionTypes.LoadRadioTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddRadioTags implements Action {
  readonly type = RadioActionTypes.AddRadioTags;
  constructor(public payload: { radioId: string; tagIds: { id: string }[] }) {}
}

export class AddRadioTagsSuccess implements Action {
  readonly type = RadioActionTypes.AddRadioTagsSuccess;
  constructor(public payload: RadioDetail) {}
}

export class AddRadioTagsFail implements Action {
  readonly type = RadioActionTypes.AddRadioTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteRadioTags implements Action {
  readonly type = RadioActionTypes.DeleteRadioTags;
  constructor(public payload: { radioId: string; tagId: string }) {}
}

export class DeleteRadioTagsSuccess implements Action {
  readonly type = RadioActionTypes.DeleteRadioTagsSuccess;
  constructor(public payload: RadioDetail) {}
}

export class DeleteRadioTagsFail implements Action {
  readonly type = RadioActionTypes.DeleteRadioTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type RadioActionsUnion =
  | LoadRadios
  | LoadRadiosSuccess
  | LoadRadiosFailure
  | LoadRadio
  | LoadRadioSuccess
  | LoadRadioFailure
  | AddRadioEntity
  | AddRadioEntitySuccess
  | AddRadioEntityFailure
  | AddReply
  | AddReplySuccess
  | AddReplyFailure
  | UpdateRadioProperty
  | UpdateRadioPropertySuccess
  | UpdateRadioPropertyFailure
  | DeleteRadioProperty
  | DeleteRadioPropertySuccess
  | DeleteRadioPropertyFailure
  | SearchRadio
  | SearchRadioSuccess
  | SearchRadioFailure
  | RadioFilter
  | AssociateRadio
  | AssociateRadioSuccess
  | AssociateRadioFailure
  | DissociateRadio
  | DissociateRadioSuccess
  | DissociateRadioFailure
  | DeleteRadioEntity
  | DeleteRadioEntitySuccess
  | DeleteRadioEntityFailure
  | LoadRadioTags
  | LoadRadioTagsSuccess
  | LoadRadioTagsFail
  | AddRadioTags
  | AddRadioTagsSuccess
  | AddRadioTagsFail
  | DeleteRadioTags
  | DeleteRadioTagsSuccess
  | DeleteRadioTagsFail
  | CreateRadioView
  | CreateRadioViewSuccess
  | CreateRadioViewFail
  | UpdateRadioView
  | UpdateRadioViewSuccess
  | UpdateRadioViewFail
  | DeleteRadioView
  | DeleteRadioViewSuccess
  | DeleteRadioViewFail
  | GetRadioViews
  | GetRadioViewsSuccess
  | GetRadioViewsFail
  | GetRadioView
  | GetRadioViewSuccess
  | GetRadioViewFail
  | SetRadioViewAsFavourite
  | SetRadioViewAsFavouriteSuccess
  | SetRadioViewAsFavouriteFail
  | UnsetRadioViewAsFavourite
  | UnsetRadioViewAsFavouriteSuccess
  | UnsetRadioViewAsFavouriteFail
  | GetRadioMatrix
  | GetRadioMatrixSuccess
  | GetRadioMatrixFailure
  | GetRadioAnalysis
  | GetRadioAnalysisSuccess
  | GetRadioAnalysisFailure
  | SetRadioAnalysisFilter
  | SetRadioMatrixFilter;
