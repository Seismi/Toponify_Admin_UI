import { ActionReducerMap } from '@ngrx/store';
import * as fromWorkPackage from './workpackage.reducer';

export const reducers: ActionReducerMap<any> = {
  workpackage: fromWorkPackage.reducer
};
