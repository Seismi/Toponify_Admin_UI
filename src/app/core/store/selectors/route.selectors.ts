import { createSelector } from '@ngrx/store';
import { State } from '../index';

export const getQueryParams = createSelector((state: State, props: { key: string }) => {
  const routerState = state.router.state  || null;
  if (!routerState) {
    return null;
  }
  return routerState.queryParams[props.key];
});
