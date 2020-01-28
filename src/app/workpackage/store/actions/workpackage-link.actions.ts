import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { NodeLink, NodeLinkDetail } from '@app/architecture/store/models/node-link.model';

export enum WorkPackageLinkActionTypes {
  AddWorkPackageLink = '[WorkPackage] Add link',
  AddWorkPackageLinkSuccess = '[WorkPackage] Add link success',
  AddWorkPackageLinkFailure = '[WorkPackage] Add link failure',
  UpdateWorkPackageLink = '[WorkPackage] Update link',
  UpdateWorkPackageLinkSuccess = '[WorkPackage] Update link success',
  UpdateWorkPackageLinkFailure = '[WorkPackage] Update link failure',
  DeleteWorkpackageLink = '[WorkPackage] Delete Link',
  DeleteWorkpackageLinkSuccess = '[WorkPackage] Delete Link Success',
  DeleteWorkpackageLinkFailure = '[WorkPackage] Delete Link Fail',
  LoadWorkpackageLinkDescendants = '[WorkPackage] Load Link descendants',
  LoadWorkpackageLinkDescendantsSuccess = '[WorkPackage] Load Link descendants success',
  LoadWorkpackageLinkDescendantsFailure = '[WorkPackage] Load Link descendants failure',
  AddWorkPackageLinkOwner = '[WorkPackage] Add link owner',
  AddWorkPackageLinkOwnerSuccess = '[WorkPackage] Add link owner success',
  AddWorkPackageLinkOwnerFailure = '[WorkPackage] Add link owner failure',
  DeleteWorkpackageLinkOwner = '[WorkPackage] Delete Link Owner',
  DeleteWorkpackageLinkOwnerSuccess = '[WorkPackage] Delete Link Owner Success',
  DeleteWorkpackageLinkOwnerFailure = '[WorkPackage] Delete Link Owner Fail',
  AddWorkPackageLinkAttribute = '[WorkPackage] Add Link Attribute',
  AddWorkPackageLinkAttributeSuccess = '[WorkPackage] Add Link Attribute Success',
  AddWorkPackageLinkAttributeFailure = '[WorkPackage] Add Link Attribute Failure',
  UpdateWorkPackageLinkProperty = '[WorkPackage] Update Link Property',
  UpdateWorkPackageLinkPropertySuccess = '[WorkPackage] Update Link Property Success',
  UpdateWorkPackageLinkPropertyFailure = '[WorkPackage] Update Link Property Failure',
  DeleteWorkPackageLinkProperty = '[WorkPackage] Delete Link Property',
  DeleteWorkPackageLinkPropertySuccess = '[WorkPackage] Delete Link Property Success',
  DeleteWorkPackageLinkPropertyFailure = '[WorkPackage] Delete Link Property Failure',
  DeleteWorkPackageLinkAttribute = '[WorkPackage] Delete Link Attribute',
  DeleteWorkPackageLinkAttributeSuccess = '[WorkPackage] Delete Link Attribute Success',
  DeleteWorkPackageLinkAttributeFailure = '[WorkPackage] Delete Link Attribute Failure'
}

export class AddWorkPackageLink implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLink;
  constructor(public payload: { workpackageId: string; link: any }) {}
}

export class AddWorkPackageLinkSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkSuccess;
  constructor(public payload: any) {}
}

export class AddWorkPackageLinkFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateWorkPackageLink implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLink;
  constructor(public payload: { workpackageId: string; linkId: string; link: any }) {}
}

export class UpdateWorkPackageLinkSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLinkSuccess;
  constructor(public payload: any) {}
}

export class UpdateWorkPackageLinkFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadWorkpackageLinkDescendants implements Action {
  readonly type = WorkPackageLinkActionTypes.LoadWorkpackageLinkDescendants;
  constructor(public payload: { workpackageId: string; linkId: string }) {}
}

export class LoadWorkpackageLinkDescendantsSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.LoadWorkpackageLinkDescendantsSuccess;
  constructor(public payload: any) {}
}

export class LoadWorkpackageLinkDescendantsFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.LoadWorkpackageLinkDescendantsFailure;
  constructor(public payload: any) {}
}

export class DeleteWorkpackageLink implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkpackageLink;
  constructor(public payload: { workpackageId: string; linkId: string }) {}
}

export class DeleteWorkpackageLinkSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkpackageLinkSuccess;
  constructor(public payload: any) {}
}

export class DeleteWorkpackageLinkFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkpackageLinkFailure;
  constructor(public payload: any) {}
}

export class AddWorkPackageLinkOwner implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkOwner;
  constructor(public payload: { workPackageId: string; nodeLinkId: string; ownerId: string }) {}
}

export class AddWorkPackageLinkOwnerSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkOwnerSuccess;
  constructor(public payload: NodeLink) {}
}

export class AddWorkPackageLinkOwnerFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkOwnerFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkpackageLinkOwner implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkpackageLinkOwner;
  constructor(public payload: { workPackageId: string; nodeLinkId: string; ownerId: string }) {}
}

export class DeleteWorkpackageLinkOwnerSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkpackageLinkOwnerSuccess;
  constructor(public payload: NodeLink) {}
}

export class DeleteWorkpackageLinkOwnerFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkpackageLinkOwnerFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddWorkPackageLinkAttribute implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkAttribute;
  constructor(public payload: { workPackageId: string, nodeLinkId: string, attributeId: string }) {}
}

export class AddWorkPackageLinkAttributeSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkAttributeSuccess;
  constructor(public payload: NodeLinkDetail) {}
}

export class AddWorkPackageLinkAttributeFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateWorkPackageLinkProperty implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLinkProperty;
  constructor(public payload: { workPackageId: string; nodeLinkId: string; customPropertyId: string, data: string }) {}
}

export class UpdateWorkPackageLinkPropertySuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLinkPropertySuccess;
  constructor(public payload: NodeLinkDetail) {}
}

export class UpdateWorkPackageLinkPropertyFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLinkPropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkPackageLinkProperty implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkPackageLinkProperty;
  constructor(public payload: { workPackageId: string; nodeLinkId: string; customPropertyId: string }) {}
}

export class DeleteWorkPackageLinkPropertySuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkPackageLinkPropertySuccess;
  constructor(public payload: NodeLinkDetail) {}
}

export class DeleteWorkPackageLinkPropertyFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkPackageLinkPropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkPackageLinkAttribute implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkPackageLinkAttribute;
  constructor(public payload: { workPackageId: string, nodeLinkId: string, attributeId: string }) { }
}

export class DeleteWorkPackageLinkAttributeSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkPackageLinkAttributeSuccess;
  constructor(public payload: NodeLinkDetail) { }
}

export class DeleteWorkPackageLinkAttributeFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.DeleteWorkPackageLinkAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}

export type WorkPackageLinkActionsUnion =
  | AddWorkPackageLink
  | AddWorkPackageLinkSuccess
  | AddWorkPackageLinkFailure
  | LoadWorkpackageLinkDescendants
  | LoadWorkpackageLinkDescendantsSuccess
  | LoadWorkpackageLinkDescendantsFailure
  | DeleteWorkpackageLink
  | DeleteWorkpackageLinkSuccess
  | DeleteWorkpackageLinkFailure
  | UpdateWorkPackageLink
  | UpdateWorkPackageLinkSuccess
  | UpdateWorkPackageLinkFailure
  | AddWorkPackageLinkOwner
  | AddWorkPackageLinkOwnerSuccess
  | AddWorkPackageLinkOwnerFailure
  | DeleteWorkpackageLinkOwner
  | DeleteWorkpackageLinkOwnerSuccess
  | DeleteWorkpackageLinkOwnerFailure
  | AddWorkPackageLinkAttribute
  | AddWorkPackageLinkAttributeSuccess
  | AddWorkPackageLinkAttributeFailure
  | UpdateWorkPackageLinkProperty
  | UpdateWorkPackageLinkPropertySuccess
  | UpdateWorkPackageLinkPropertyFailure
  | DeleteWorkPackageLinkProperty
  | DeleteWorkPackageLinkPropertySuccess
  | DeleteWorkPackageLinkPropertyFailure
  | DeleteWorkPackageLinkAttribute
  | DeleteWorkPackageLinkAttributeSuccess
  | DeleteWorkPackageLinkAttributeFailure;
