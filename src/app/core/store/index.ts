import * as fromLayout from '../store/reducers/layout.reducer';
import * as fromError from '../store/reducers/error.reducer';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import { ActionReducer, ActionReducerMap, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';
/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from 'src/environments/environment';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { Params } from '@angular/router';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  layout: fromLayout.LayoutState;
  router:  RouterReducerState<RouterStateUrl>;
  error: fromError.ErrorState;
}

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
  layout: fromLayout.reducer,
  router: routerReducer,
  error: fromError.reducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    // console.log('state', state);
    // console.log('action', action);

    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger, storeFreeze] : [];

/**
 * Layout Reducers
 */

export const getLayoutState = createFeatureSelector<State, fromLayout.LayoutState>('layout');

export const getLeftDrawer = createSelector(
  getLayoutState,
  fromLayout.getLeftDrawerOpen
);

export const getRightDrawer = createSelector(
  getLayoutState,
  fromLayout.getRightDrawerOpen
);


