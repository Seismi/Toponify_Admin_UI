import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AttributeService, GetAttributeRequestQueryParams } from '@app/attributes/services/attributes.service';
import {
  AttributeActionTypes,
  LoadAttributes,
  LoadAttributesSuccess,
  LoadAttributesFailure,
  LoadAttribute,
  LoadAttributeSuccess,
  LoadAttributeFailure,
  AddAttribute,
  AddAttributeSuccess,
  AddAttributeFailure,
  UpdateAttribute,
  UpdateAttributeSuccess,
  UpdateAttributeFailure,
  DeleteAttribute,
  DeleteAttributeSuccess,
  DeleteAttributeFailure,
  AddOwner,
  AddOwnerSuccess,
  AddOwnerFailure,
  DeleteOwner,
  DeleteOwnerSuccess,
  DeleteOwnerFailure,
  UpdateProperty,
  UpdatePropertySuccess,
  DeleteProperty,
  DeletePropertySuccess,
  DeletePropertyFailure,
  AddRelated,
  AddRelatedSuccess,
  AddRelatedFailure,
  DeleteRelated,
  DeleteRelatedSuccess,
  DeleteRelatedFailure,
  LoadAttributeTags,
  LoadAttributeTagsSuccess,
  LoadAttributeTagsFail,
  AddAttributeTags,
  AddAttributeTagsSuccess,
  AddAttributeTagsFail,
  DeleteAttributeTags,
  DeleteAttributeTagsSuccess,
  DeleteAttributeTagsFail
} from '../actions/attributes.actions';
import {
  AttributeEntitiesHttpParams,
  AttributeEntitiesResponse,
  AttributeDetailApiResponse,
  AttributeApiResponse,
  AttributeEntity,
  AttributeDetail,
  AttributeApiRequest,
  AttributeDetailApiRequest,
  CustomPropertyValues,
  CustomPropertiesApiRequest
} from '../models/attributes.model';
import { OwnersEntityOrApproversEntity } from '@app/workpackage/store/models/workpackage.models';
import { UpdateRadioPropertyFailure } from '@app/radio/store/actions/radio.actions';
import { Tag } from '@app/architecture/store/models/node.model';

@Injectable()
export class AttributeEffects {
  constructor(private actions$: Actions, private attributeService: AttributeService) {}

  @Effect()
  loadAttributeEntities$ = this.actions$.pipe(
    ofType<LoadAttributes>(AttributeActionTypes.LoadAttributes),
    map(action => action.payload),
    switchMap((queryParams: GetAttributeRequestQueryParams) => {
      return this.attributeService.getAttributeEntities(queryParams).pipe(
        switchMap((data: AttributeEntitiesResponse) => [new LoadAttributesSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new LoadAttributesFailure(error)))
      );
    })
  );

  @Effect()
  loadAttribute$ = this.actions$.pipe(
    ofType<LoadAttribute>(AttributeActionTypes.LoadAttribute),
    map(action => action.payload),
    switchMap((payload: { id: string; queryParams?: GetAttributeRequestQueryParams }) => {
      return this.attributeService.getAttribute(payload.id, payload.queryParams).pipe(
        switchMap((response: AttributeDetailApiResponse) => [new LoadAttributeSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new LoadAttributeFailure(error)))
      );
    })
  );

  @Effect()
  addAttribute$ = this.actions$.pipe(
    ofType<AddAttribute>(AttributeActionTypes.AddAttribute),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; entity: AttributeApiRequest }) => {
      return this.attributeService.addAttribute(payload.workPackageId, payload.entity).pipe(
        switchMap((response: AttributeApiResponse) => [new AddAttributeSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddAttributeFailure(error)))
      );
    })
  );

  @Effect()
  updateAttribute$ = this.actions$.pipe(
    ofType<UpdateAttribute>(AttributeActionTypes.UpdateAttribute),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; attributeId: string; entity: AttributeDetailApiRequest }) => {
      return this.attributeService.updateAttribute(payload.workPackageId, payload.attributeId, payload.entity).pipe(
        switchMap((attribute: AttributeDetailApiResponse) => [new UpdateAttributeSuccess(attribute.data)]),
        catchError((error: HttpErrorResponse) => of(new UpdateAttributeFailure(error)))
      );
    })
  );

  @Effect()
  deleteAttribute$ = this.actions$.pipe(
    ofType<DeleteAttribute>(AttributeActionTypes.DeleteAttribute),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; attributeId: string }) => {
      return this.attributeService.deleteAttribute(payload.workPackageId, payload.attributeId).pipe(
        map(response => new DeleteAttributeSuccess(response.data)),
        catchError(error => of(new DeleteAttributeFailure(error)))
      );
    })
  );

  @Effect()
  addOwner$ = this.actions$.pipe(
    ofType<AddOwner>(AttributeActionTypes.AddOwner),
    map(action => action.payload),
    mergeMap(
      (payload: {
        workPackageId: string;
        attributeId: string;
        ownerId: string;
        entity: OwnersEntityOrApproversEntity;
      }) => {
        return this.attributeService
          .addOwner(payload.workPackageId, payload.attributeId, payload.ownerId, payload.entity)
          .pipe(
            mergeMap((response: AttributeDetailApiResponse) => [new AddOwnerSuccess(response.data)]),
            catchError((error: HttpErrorResponse) => of(new AddOwnerFailure(error)))
          );
      }
    )
  );

  @Effect()
  deleteOwner$ = this.actions$.pipe(
    ofType<DeleteOwner>(AttributeActionTypes.DeleteOwner),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; attributeId: string; ownerId: string }) => {
      return this.attributeService.deleteOwner(payload.workPackageId, payload.attributeId, payload.ownerId).pipe(
        switchMap((response: AttributeDetailApiResponse) => [new DeleteOwnerSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteOwnerFailure(error)))
      );
    })
  );

  @Effect()
  updateProperty$ = this.actions$.pipe(
    ofType<UpdateProperty>(AttributeActionTypes.UpdateProperty),
    map(action => action.payload),
    switchMap(
      (payload: {
        workPackageId: string;
        attributeId: string;
        customPropertyId: string;
        data: string;
      }) => {
        return this.attributeService
          .updateProperty(payload.workPackageId, payload.attributeId, payload.customPropertyId, payload.data)
          .pipe(
            switchMap((response: AttributeDetailApiResponse) => [new UpdatePropertySuccess(response.data)]),
            catchError((error: HttpErrorResponse) => of(new UpdateRadioPropertyFailure(error)))
          );
      }
    )
  );

  @Effect()
  deleteProperty$ = this.actions$.pipe(
    ofType<DeleteProperty>(AttributeActionTypes.DeleteProperty),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; attributeId: string; customPropertyId: string }) => {
      return this.attributeService
        .deleteProperty(payload.workPackageId, payload.attributeId, payload.customPropertyId)
        .pipe(
          switchMap((response: AttributeDetailApiResponse) => [new DeletePropertySuccess(response.data)]),
          catchError((error: HttpErrorResponse) => of(new DeletePropertyFailure(error)))
        );
    })
  );

  @Effect()
  addRelated$ = this.actions$.pipe(
    ofType<AddRelated>(AttributeActionTypes.AddRelated),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; attributeId: string; relatedAttributeId: string }) => {
      return this.attributeService
        .addRelated(payload.workPackageId, payload.attributeId, payload.relatedAttributeId)
        .pipe(
          switchMap((response: AttributeDetailApiResponse) => [new AddRelatedSuccess(response.data)]),
          catchError((error: HttpErrorResponse) => of(new AddRelatedFailure(error)))
        );
    })
  );

  @Effect()
  deleteRelated$ = this.actions$.pipe(
    ofType<DeleteRelated>(AttributeActionTypes.DeleteRelated),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; attributeId: string; relatedAttributeId: string }) => {
      return this.attributeService
        .deleteRelated(payload.workPackageId, payload.attributeId, payload.relatedAttributeId)
        .pipe(
          switchMap((response: AttributeDetailApiResponse) => [new DeleteRelatedSuccess(response.data)]),
          catchError((error: HttpErrorResponse) => of(new DeleteRelatedFailure(error)))
        );
    })
  );

  @Effect()
  loadAttributeTags$ = this.actions$.pipe(
    ofType<LoadAttributeTags>(AttributeActionTypes.LoadAttributeTags),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; attributeId: string }) => {
      return this.attributeService.getAttributeTags(payload.workPackageId, payload.attributeId).pipe(
        switchMap((response: { data: Tag[] }) => [new LoadAttributeTagsSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new LoadAttributeTagsFail(error)))
      );
    })
  );

  @Effect()
  addAttributeTags$ = this.actions$.pipe(
    ofType<AddAttributeTags>(AttributeActionTypes.AddAttributeTags),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; attributeId: string, tagIds: { id: string }[] }) => {
      return this.attributeService.addAttributeTags(payload.workPackageId, payload.attributeId, payload.tagIds).pipe(
        switchMap((response: AttributeDetailApiResponse) => [new AddAttributeTagsSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddAttributeTagsFail(error)))
      );
    })
  );

  @Effect()
  deleteAttributeTags$ = this.actions$.pipe(
    ofType<DeleteAttributeTags>(AttributeActionTypes.DeleteAttributeTags),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; attributeId: string, tagId: string }) => {
      return this.attributeService.deleteAttributeTags(payload.workPackageId, payload.attributeId, payload.tagId).pipe(
        map(response => new DeleteAttributeTagsSuccess(response.data)),
        catchError((error: HttpErrorResponse) => of(new DeleteAttributeTagsFail(error)))
      );
    })
  );
}
