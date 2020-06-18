import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  RadioEntitiesHttpParams,
  RadioEntitiesResponse,
  RadioDetailApiResponse,
  RadioApiRequest,
  RadioApiResponse,
  ReplyApiRequest,
  AdvancedSearchApiRequest
} from '../models/radio.model';
import { catchError, map, switchMap, mergeMap, tap } from 'rxjs/operators';
import {
  RadioActionTypes,
  LoadRadios,
  LoadRadiosSuccess,
  LoadRadiosFailure,
  LoadRadio,
  LoadRadioSuccess,
  LoadRadioFailure,
  AddRadioEntity,
  AddRadioEntitySuccess,
  AddRadioEntityFailure,
  AddReply,
  AddReplySuccess,
  UpdateRadioProperty,
  UpdateRadioPropertySuccess,
  UpdateRadioPropertyFailure,
  DeleteRadioProperty,
  DeleteRadioPropertySuccess,
  DeleteRadioPropertyFailure,
  SearchRadio,
  SearchRadioSuccess,
  SearchRadioFailure,
  AssociateRadio,
  DissociateRadio,
  DissociateRadioSuccess,
  DissociateRadioFailure,
  AssociateRadioFailure,
  AssociateRadioSuccess,
  DeleteRadioEntity,
  DeleteRadioEntitySuccess,
  DeleteRadioEntityFailure,
  LoadRadioTags,
  LoadRadioTagsSuccess,
  LoadRadioTagsFail,
  AddRadioTags,
  AddRadioTagsSuccess,
  AddRadioTagsFail,
  DeleteRadioTags,
  DeleteRadioTagsSuccess,
  DeleteRadioTagsFail,
  CreateRadioViewSuccess,
  CreateRadioViewFail,
  UpdateRadioViewSuccess,
  UpdateRadioViewFail,
  DeleteRadioViewSuccess,
  DeleteRadioViewFail,
  GetRadioViewSuccess,
  GetRadioViewsSuccess,
  GetRadioViewsFail,
  GetRadioViewFail,
  SetRadioViewAsFavouriteSuccess,
  SetRadioViewAsFavouriteFail,
  UnsetRadioViewAsFavouriteSuccess,
  UnsetRadioViewAsFavouriteFail,
  GetRadioMatrixSuccess,
  GetRadioMatrixFailure,
  GetRadioAnalysisSuccess,
  GetRadioAnalysisFailure,
  GetRadioAnalysis,
  GetRadioMatrix
} from '../actions/radio.actions';
import { RadioService } from '../../services/radio.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Tag } from '@app/architecture/store/models/node.model';

@Injectable()
export class RadioEffects {
  constructor(private actions$: Actions, private radioService: RadioService) {}

  @Effect()
  loadRadioEntities$ = this.actions$.pipe(
    ofType<LoadRadios>(RadioActionTypes.LoadRadios),
    map(action => action.payload),
    switchMap((payload: RadioEntitiesHttpParams) => {
      return this.radioService.getRadioEntities(payload).pipe(
        switchMap((data: RadioEntitiesResponse) => [new LoadRadiosSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new LoadRadiosFailure(error)))
      );
    })
  );

  @Effect()
  loadRadio$ = this.actions$.pipe(
    ofType<LoadRadio>(RadioActionTypes.LoadRadio),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.radioService.getRadio(id).pipe(
        switchMap((response: RadioDetailApiResponse) => [new LoadRadioSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new LoadRadioFailure(error)))
      );
    })
  );

  @Effect()
  addRadioEntity$ = this.actions$.pipe(
    ofType<AddRadioEntity>(RadioActionTypes.AddRadio),
    map(action => action.payload),
    mergeMap((payload: RadioApiRequest) => {
      return this.radioService.addRadioEntity(payload).pipe(
        mergeMap((radio: RadioApiResponse) => [new AddRadioEntitySuccess(radio.data)]),
        catchError((error: HttpErrorResponse) => of(new AddRadioEntityFailure(error)))
      );
    })
  );

  @Effect()
  addReply$ = this.actions$.pipe(
    ofType<AddReply>(RadioActionTypes.AddReply),
    map(action => action.payload),
    mergeMap((payload: { entity: ReplyApiRequest; id: string }) => {
      return this.radioService.addRadioReply(payload.entity, payload.id).pipe(
        mergeMap((radio: any) => [new AddReplySuccess(radio.data)]),
        catchError((error: HttpErrorResponse) => of(new AddRadioEntityFailure(error)))
      );
    })
  );

  @Effect()
  updateRadioProperty$ = this.actions$.pipe(
    ofType<UpdateRadioProperty>(RadioActionTypes.UpdateRadioProperty),
    map(action => action.payload),
    switchMap((payload: { radioId: string; customPropertyId: string; data: any }) => {
      return this.radioService.updateRadioProperty(payload.radioId, payload.customPropertyId, payload.data).pipe(
        switchMap((response: RadioDetailApiResponse) => [new UpdateRadioPropertySuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new UpdateRadioPropertyFailure(error)))
      );
    })
  );

  @Effect()
  deleteRadioProperty$ = this.actions$.pipe(
    ofType<DeleteRadioProperty>(RadioActionTypes.DeleteRadioProperty),
    map(action => action.payload),
    switchMap((payload: { radioId: string; customPropertyId: string }) => {
      return this.radioService.deleteRadioProperty(payload.radioId, payload.customPropertyId).pipe(
        switchMap((response: RadioDetailApiResponse) => [new DeleteRadioPropertySuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteRadioPropertyFailure(error)))
      );
    })
  );

  @Effect()
  searchRadio$ = this.actions$.pipe(
    ofType<SearchRadio>(RadioActionTypes.SearchRadio),
    map(action => action.payload),
    mergeMap((payload: AdvancedSearchApiRequest) => {
      const data = payload.data;
      const queryParams: { size?: string; page?: string } = {};

      if (payload.page && payload.size) {
        queryParams.size = payload.size;
        queryParams.page = payload.page;
      }

      return this.radioService.searchRadio({ data }, queryParams).pipe(
        mergeMap((response: RadioEntitiesResponse) => [new SearchRadioSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new SearchRadioFailure(error)))
      );
    })
  );

  @Effect()
  getRadioMatrix$ = this.actions$.pipe(
    ofType<GetRadioMatrix>(RadioActionTypes.GetRadioMatrix),
    map(action => action.payload),
    switchMap((payload: AdvancedSearchApiRequest) => {
      return this.radioService.getRadioMatrixData(payload).pipe(
        mergeMap((response: any) => [new GetRadioMatrixSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new GetRadioMatrixFailure(error)))
      );
    })
  );

  @Effect()
  getRadioAnalysis$ = this.actions$.pipe(
    ofType<GetRadioAnalysis>(RadioActionTypes.GetRadioAnalysis),
    map(action => action.payload),
    switchMap((payload: AdvancedSearchApiRequest) => {
      return this.radioService.getRadioAnalysisData(payload).pipe(
        mergeMap((response: any) => [new GetRadioAnalysisSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new GetRadioAnalysisFailure(error)))
      );
    })
  );

  @Effect()
  associateRadio$ = this.actions$.pipe(
    ofType<AssociateRadio>(RadioActionTypes.AssociateRadio),
    map(action => action.payload),
    mergeMap(payload => {
      return this.radioService
        .associateRadio({ workPackageId: payload.workpackageId, nodeId: payload.nodeId, radio: payload.radio })
        .pipe(
          mergeMap((response: RadioEntitiesResponse) => [
            new LoadRadio(payload.radio.id),
            new AssociateRadioSuccess(response)
          ]),
          catchError((error: HttpErrorResponse) => of(new AssociateRadioFailure(error)))
        );
    })
  );

  @Effect()
  dissociateRadio$ = this.actions$.pipe(
    ofType<DissociateRadio>(RadioActionTypes.DissociateRadio),
    map(action => action.payload),
    mergeMap(payload => {
      return this.radioService
        .dissociateRadio({ workPackageId: payload.workpackageId, nodeId: payload.nodeId, radioId: payload.radioId })
        .pipe(
          mergeMap((response: RadioEntitiesResponse) => [
            new LoadRadio(payload.radioId),
            new DissociateRadioSuccess(response)
          ]),
          catchError((error: HttpErrorResponse) => of(new DissociateRadioFailure(error)))
        );
    })
  );

  @Effect()
  deleteRadioEntity$ = this.actions$.pipe(
    ofType<DeleteRadioEntity>(RadioActionTypes.DeleteRadioEntity),
    map(action => action.payload),
    switchMap((payload: string) => {
      return this.radioService.deleteRadioEntity(payload).pipe(
        switchMap(_ => [new DeleteRadioEntitySuccess(payload)]),
        catchError((error: HttpErrorResponse) => of(new DeleteRadioEntityFailure(error)))
      );
    })
  );

  @Effect()
  loadRadioTags$ = this.actions$.pipe(
    ofType<LoadRadioTags>(RadioActionTypes.LoadRadioTags),
    map(action => action.payload),
    switchMap((payload: { radioId: string }) => {
      return this.radioService.getRadioTags(payload.radioId).pipe(
        switchMap((response: { data: Tag[] }) => [new LoadRadioTagsSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new LoadRadioTagsFail(error)))
      );
    })
  );

  @Effect()
  addRadioTags$ = this.actions$.pipe(
    ofType<AddRadioTags>(RadioActionTypes.AddRadioTags),
    map(action => action.payload),
    switchMap((payload: { radioId: string; tagIds: { id: string }[] }) => {
      return this.radioService.addRadioTags(payload.radioId, payload.tagIds).pipe(
        switchMap((response: RadioDetailApiResponse) => [new AddRadioTagsSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddRadioTagsFail(error)))
      );
    })
  );

  @Effect()
  deleteRadioTags$ = this.actions$.pipe(
    ofType<DeleteRadioTags>(RadioActionTypes.DeleteRadioTags),
    map(action => action.payload),
    mergeMap((payload: { radioId: string; tagId: string }) => {
      return this.radioService.deleteRadioTags(payload.radioId, payload.tagId).pipe(
        map(response => new DeleteRadioTagsSuccess(response.data)),
        catchError((error: HttpErrorResponse) => of(new DeleteRadioTagsFail(error)))
      );
    })
  );

  @Effect()
  getRadioViews$ = this.actions$.pipe(
    ofType<any>(RadioActionTypes.GetRadioViews),
    map(action => action.payload),
    mergeMap(() => {
      return this.radioService.getRadioViews().pipe(
        map(response => new GetRadioViewsSuccess(response.data)),
        catchError((error: HttpErrorResponse) => of(new GetRadioViewsFail(error)))
      );
    })
  );

  @Effect()
  getRadioView$ = this.actions$.pipe(
    ofType<any>(RadioActionTypes.GetRadioView),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.radioService.getRadioView(payload).pipe(
        map(response => new GetRadioViewSuccess(response.data)),
        catchError((error: HttpErrorResponse) => of(new GetRadioViewFail(error)))
      );
    })
  );

  @Effect()
  createRadioView$ = this.actions$.pipe(
    ofType<any>(RadioActionTypes.CreateRadioView),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.radioService.createRadioView(payload).pipe(
        map(response => new CreateRadioViewSuccess(response.data)),
        catchError((error: HttpErrorResponse) => of(new CreateRadioViewFail(error)))
      );
    })
  );

  @Effect()
  updateRadioView$ = this.actions$.pipe(
    ofType<any>(RadioActionTypes.UpdateRadioView),
    map(action => action.payload),
    mergeMap((payload: { radioViewId: string; radioViewData: any }) => {
      return this.radioService.updateRadioView(payload.radioViewId, payload.radioViewData).pipe(
        map(response => new UpdateRadioViewSuccess(response.data)),
        catchError((error: HttpErrorResponse) => of(new UpdateRadioViewFail(error)))
      );
    })
  );

  @Effect()
  deleteRadioView$ = this.actions$.pipe(
    ofType<any>(RadioActionTypes.DeleteRadioView),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.radioService.deleteRadioView(payload).pipe(
        map(response => new DeleteRadioViewSuccess(payload)),
        catchError((error: HttpErrorResponse) => of(new DeleteRadioViewFail(error)))
      );
    })
  );

  @Effect()
  setRadioViewFavourite$ = this.actions$.pipe(
    ofType<any>(RadioActionTypes.SetRadioViewAsFavourite),
    map(action => action.payload),
    mergeMap((id: string) => {
      return this.radioService.setRadioViewAsFavourite(id).pipe(
        map(_ => new SetRadioViewAsFavouriteSuccess(id)),
        catchError((error: HttpErrorResponse) => of(new SetRadioViewAsFavouriteFail(error)))
      );
    })
  );

  @Effect()
  unsetRadioViewFavourite$ = this.actions$.pipe(
    ofType<any>(RadioActionTypes.UnsetRadioViewAsFavourite),
    map(action => action.payload),
    mergeMap((id: string) => {
      return this.radioService.unsetRadioViewAsFavourite(id).pipe(
        map(_ => new UnsetRadioViewAsFavouriteSuccess(id)),
        catchError((error: HttpErrorResponse) => of(new UnsetRadioViewAsFavouriteFail(error)))
      );
    })
  );
}
