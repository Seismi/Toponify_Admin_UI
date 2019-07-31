import { Action } from '@ngrx/store';

export enum WorkpackageActionTypes {
  SelectWorkpackage = '[Architecture - Workpackage] Select Workpackage',
  UnSelectWorkpackage = '[Architecture - Workpackage] Unselect Workpackage'
}

export class SelectWorkpackage implements Action {
  readonly type = WorkpackageActionTypes.SelectWorkpackage;
  constructor(public payload: string) {}
}

export type WorkpackageActionsUnion = SelectWorkpackage;
