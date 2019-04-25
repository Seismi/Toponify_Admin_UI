import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import * as ElementActions from '../actions/element.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { ElementActionTypes } from '../actions/element.actions';
import { ElementService } from '@app/version/services/element.service';
import { ElementApiResponse, ElementApiRequest, ElementSingleApiResponse, ElementResponse } from '../models/element.model';


@Injectable()
export class ElementEffects {
  constructor(
    private actions$: Actions,
    private elementService: ElementService
  ) {}

  @Effect()
  loadElemnents$ = this.actions$.pipe(
    ofType<ElementActions.LoadElements>(ElementActionTypes.LoadElements),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.elementService.getElements(versionId).pipe(
        switchMap((element: ElementApiResponse) =>
            [new ElementActions.LoadElementsSuccess(element.data)]),
        catchError((error: HttpErrorResponse) => of(new ElementActions.LoadElementsFailure(error)))
      );
    })
  );

  @Effect()
  addElement$ = this.actions$.pipe(
    ofType<ElementActions.AddElement>(ElementActionTypes.AddElement),
    map(action => action.payload),
    mergeMap((payload: { element: ElementApiRequest, versionId: string}) => {
      return this.elementService.addElement(payload.element, payload.versionId).pipe(
        mergeMap((element: ElementResponse) => [new ElementActions.AddElementSuccess(element.data)]),
        catchError((error: HttpErrorResponse) => of(new ElementActions.AddElementFailure(error)))
      );
    })
  );

  @Effect()
  updateElement$ = this.actions$.pipe(
    ofType<ElementActions.UpdateElement>(ElementActionTypes.UpdateElement),
    map(action => action.payload),
    mergeMap((payload: { element: ElementApiRequest, versionId: string}) => {
      return this.elementService.updateElement(payload.element, payload.versionId).pipe(
        mergeMap((version: ElementSingleApiResponse) => [new ElementActions.UpdateElementSuccess(version.data)]),
        catchError((error: HttpErrorResponse) => of(new ElementActions.UpdateElementFailure(error)))
      );
    })
  );

  @Effect()
  deleteElement$ = this.actions$.pipe(
    ofType<ElementActions.DeleteElement>(ElementActionTypes.DeleteElement),
    map(action => action.payload),
    mergeMap((element: {versionId: string, elementId: string}) => {
      return this.elementService.deleteElement(element.versionId, element.elementId).pipe(
        map(_ => new ElementActions.DeleteElementSuccess(element.elementId)),
        catchError(error => of(new ElementActions.DeleteElementFailure(error)))
      );
    })
  );
}
