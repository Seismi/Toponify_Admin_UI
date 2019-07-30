import { Action } from '@ngrx/store';

export enum WorkpackageActionTypes {
  SelectWorkpackage = '[Architecture - Workpackage] Zoom Level',
  UnSelectWorkpackage = '[Architecture - Workpackage] View level'
}

export class SelectWorkpackage implements Action {
  readonly type = WorkpackageActionTypes.SelectWorkpackage;
  constructor(public payload: string) {}
}

export type WorkpackageActionsUnion = SelectWorkpackage;
