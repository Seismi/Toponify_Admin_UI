import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElementLinkService } from '@app/version/services/element-link.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as ElementLinkActions from '../actions/element-link.actions';
import { ElementLinkActionTypes } from '../actions/element-link.actions';
import { AddElementLinkApiResponse, ElementLinkApiRequest, ElementLinkApiResponse } from '../models/element-link.model';


@Injectable()
export class ElementLinkEffects {
  constructor(
    private actions$: Actions,
    private elementLinkService: ElementLinkService
  ) {}

  @Effect()
  loadElemnents$ = this.actions$.pipe(
    ofType<ElementLinkActions.LoadElementLinks>(ElementLinkActionTypes.LoadElementLinks),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.elementLinkService.getElementLinks(versionId).pipe(
        switchMap((elementLink: ElementLinkApiResponse) =>
            [new ElementLinkActions.LoadElementLinksSuccess(elementLink.data)]),
        catchError((error: HttpErrorResponse) => of(new ElementLinkActions.LoadElementLinksFailure(error)))
      );
    })
  );

  @Effect()
  addElementLink$ = this.actions$.pipe(
    ofType<ElementLinkActions.AddElementLink>(ElementLinkActionTypes.AddElementLink),
    map(action => action.payload),
    mergeMap((payload: { elementLink: ElementLinkApiRequest, versionId: string}) => {
      return this.elementLinkService.addElementLink(payload.elementLink, payload.versionId).pipe(
        mergeMap((elementLink: AddElementLinkApiResponse) => [new ElementLinkActions.AddElementLinkSuccess(elementLink.data)]),
        catchError((error: HttpErrorResponse) => of(new ElementLinkActions.AddElementLinkFailure(error)))
      );
    })
  );

  @Effect()
  updateElementLink$ = this.actions$.pipe(
    ofType<ElementLinkActions.UpdateElementLink>(ElementLinkActionTypes.UpdateElementLink),
    map(action => action.payload),
    switchMap((payload: { elementLink: ElementLinkApiRequest, versionId: any}[]) => {

      const observables = payload.map(item => {
        return this.elementLinkService.updateElementLink(item.elementLink, item.versionId);
      });

      return forkJoin(observables).pipe(
        map(data => {
          const mappedLinks = {};
          data.forEach(item => mappedLinks[item.data.id] = item.data);
          return new ElementLinkActions.UpdateElementLinkSuccess(mappedLinks);
        }),
        catchError(error => of(new ElementLinkActions.UpdateElementLinkFailure(error)))
      );
    })
  );

  @Effect()
  deleteElementLink$ = this.actions$.pipe(
    ofType<ElementLinkActions.DeleteElementLink>(ElementLinkActionTypes.DeleteElementLink),
    map(action => action.payload),
    mergeMap((elementLink: {versionId: string, elementLinkId: string}) => {
      return this.elementLinkService.deleteElementLink(elementLink.versionId, elementLink.elementLinkId).pipe(
        map(_ => new ElementLinkActions.DeleteElementLinkSuccess(elementLink.elementLinkId)),
        catchError(error => of(new ElementLinkActions.DeleteElementLinkFailure(error)))
      );
    })
  );
}
