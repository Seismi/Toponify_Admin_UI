import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import {
  AttributeEntitiesResponse,
  AttributeDetail,
  AttributeEntity,
  AttributeApiRequest,
  AttributeDetailApiRequest,
  CustomPropertyValues,
  CustomPropertiesApiRequest
} from '../models/attributes.model';
import { OwnersEntityOrApproversEntity } from '@app/workpackage/store/models/workpackage.models';
import { Tag } from '@app/architecture/store/models/node.model';

export enum AttributeActionTypes {
  LoadAttributes = '[Attribute] Load Attributes entities',
  LoadAttributesSuccess = '[Attribute] Load Attributes entities Success',
  LoadAttributesFailure = '[Attribute] Load Attributes entities Fail',

  LoadAttribute = '[Attribute] Load Attribute',
  LoadAttributeSuccess = '[Attribute] Load Attribute Success',
  LoadAttributeFailure = '[Attribute] Load Attribute Fail',

  UpdateAttribute = '[Attribute] Update Attribute',
  UpdateAttributeSuccess = '[Attribute] Update Attribute Success',
  UpdateAttributeFailure = '[Attribute] Update Attribute Fail',

  AddAttribute = '[Attribute] Add Attribute',
  AddAttributeSuccess = '[Attribute] Add Attribute Success',
  AddAttributeFailure = '[Attribute] Add Attribute Fail',

  DeleteAttribute = '[Attribute] Delete Attribute',
  DeleteAttributeSuccess = '[Attribute] Delete Attribute Success',
  DeleteAttributeFailure = '[Attribute] Delete Attribute Fail',

  AddOwner = '[Attribute] Add Owner',
  AddOwnerSuccess = '[Attribute] Add Owner Success',
  AddOwnerFailure = '[Attribute] Add Owner Failure',

  DeleteOwner = '[Attribute] Delete Owner',
  DeleteOwnerSuccess = '[Attribute] Delete Owner Success',
  DeleteOwnerFailure = '[Attribute] Delete Owner Failure',

  UpdateProperty = '[Attribute] Update Property',
  UpdatePropertySuccess = '[Attribute] Update Property Success',
  UpdatePropertyFailure = '[Attribute] Update Property Failure',

  DeleteProperty = '[Attribute] Delete Property',
  DeletePropertySuccess = '[Attribute] Delete Property Success',
  DeletePropertyFailure = '[Attribute] Delete Property Failure',

  AddRelated = '[Attribute] Add Related',
  AddRelatedSuccess = '[Attribute] Add Related Success',
  AddRelatedFailure = '[Attribute] Add Related Failure',

  DeleteRelated = '[Attribute] Delete Related',
  DeleteRelatedSuccess = '[Attribute] Delete Related Success',
  DeleteRelatedFailure = '[Attribute] Delete Related Failure',

  LoadAttributeTags = '[Attribute] Load Attribute Tags',
  LoadAttributeTagsSuccess = '[Attribute] Load Attribute Tags Success',
  LoadAttributeTagsFail = '[Attribute] Load Attribute Tags Fail',

  AddAttributeTags = '[Attribute] Add Attribute Tags',
  AddAttributeTagsSuccess = '[Attribute] Add Attribute Tags Success',
  AddAttributeTagsFail = '[Attribute] Add Attribute Tags Fail',

  DeleteAttributeTags = '[Attribute] Delete Attribute Tags',
  DeleteAttributeTagsSuccess = '[Attribute] Delete Attribute Tags Success',
  DeleteAttributeTagsFail = '[Attribute] Delete Attribute Tags Fail',

  AddAttributeRadio = '[Attribute] Add Attribute Radio',
  AddAttributeRadioSuccess = '[Attribute] Add Attribute Radio Success',
  AddAttributeRadioFailure = '[Attribute] Add Attribute Radio Failure',

  DeleteAttributeRadio = '[Attribute] Delete Attribute Radio',
  DeleteAttributeRadioSuccess = '[Attribute] Delete Attribute Radio Success',
  DeleteAttributeRadioFailure = '[Attribute] Delete Attribute Radio Failure',
}

export class LoadAttributes implements Action {
  readonly type = AttributeActionTypes.LoadAttributes;
  constructor(public payload?: any) {}
}

export class LoadAttributesSuccess implements Action {
  readonly type = AttributeActionTypes.LoadAttributesSuccess;
  constructor(public payload: AttributeEntitiesResponse) {}
}

export class LoadAttributesFailure implements Action {
  readonly type = AttributeActionTypes.LoadAttributesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadAttribute implements Action {
  readonly type = AttributeActionTypes.LoadAttribute;
  constructor(public payload: { id: string; queryParams?: any }) {}
}

export class LoadAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.LoadAttributeSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class LoadAttributeFailure implements Action {
  readonly type = AttributeActionTypes.LoadAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateAttribute implements Action {
  readonly type = AttributeActionTypes.UpdateAttribute;
  constructor(public payload: { workPackageId: string; attributeId: string; entity: AttributeDetailApiRequest }) {}
}

export class UpdateAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.UpdateAttributeSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class UpdateAttributeFailure implements Action {
  readonly type = AttributeActionTypes.UpdateAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddAttribute implements Action {
  readonly type = AttributeActionTypes.AddAttribute;
  constructor(public payload: { workPackageId: string; entity: AttributeApiRequest }) {}
}

export class AddAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.AddAttributeSuccess;
  constructor(public payload: AttributeEntity) {}
}

export class AddAttributeFailure implements Action {
  readonly type = AttributeActionTypes.AddAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteAttribute implements Action {
  readonly type = AttributeActionTypes.DeleteAttribute;
  constructor(public payload: { workPackageId: string; attributeId: string }) {}
}

export class DeleteAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class DeleteAttributeFailure implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddOwner implements Action {
  readonly type = AttributeActionTypes.AddOwner;
  constructor(
    public payload: {
      workPackageId: string;
      attributeId: string;
      ownerId: string;
      entity: OwnersEntityOrApproversEntity;
    }
  ) {}
}

export class AddOwnerSuccess implements Action {
  readonly type = AttributeActionTypes.AddOwnerSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class AddOwnerFailure implements Action {
  readonly type = AttributeActionTypes.AddOwnerFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteOwner implements Action {
  readonly type = AttributeActionTypes.DeleteOwner;
  constructor(public payload: { workPackageId: string; attributeId: string; ownerId: string }) {}
}

export class DeleteOwnerSuccess implements Action {
  readonly type = AttributeActionTypes.DeleteOwnerSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class DeleteOwnerFailure implements Action {
  readonly type = AttributeActionTypes.DeleteOwnerFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateProperty implements Action {
  readonly type = AttributeActionTypes.UpdateProperty;
  constructor(
    public payload: {
      workPackageId: string;
      attributeId: string;
      customPropertyId: string;
      data: string;
    }
  ) {}
}

export class UpdatePropertySuccess implements Action {
  readonly type = AttributeActionTypes.UpdatePropertySuccess;
  constructor(public payload: AttributeDetail) {}
}

export class UpdatePropertyFailure implements Action {
  readonly type = AttributeActionTypes.UpdatePropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteProperty implements Action {
  readonly type = AttributeActionTypes.DeleteProperty;
  constructor(public payload: { workPackageId: string; attributeId: string; customPropertyId: string }) {}
}

export class DeletePropertySuccess implements Action {
  readonly type = AttributeActionTypes.DeletePropertySuccess;
  constructor(public payload: AttributeDetail) {}
}

export class DeletePropertyFailure implements Action {
  readonly type = AttributeActionTypes.DeletePropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddRelated implements Action {
  readonly type = AttributeActionTypes.AddRelated;
  constructor(public payload: { workPackageId: string; attributeId: string; relatedAttributeId: string }) {}
}

export class AddRelatedSuccess implements Action {
  readonly type = AttributeActionTypes.AddRelatedSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class AddRelatedFailure implements Action {
  readonly type = AttributeActionTypes.AddRelatedFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteRelated implements Action {
  readonly type = AttributeActionTypes.DeleteRelated;
  constructor(public payload: { workPackageId: string; attributeId: string; relatedAttributeId: string }) {}
}

export class DeleteRelatedSuccess implements Action {
  readonly type = AttributeActionTypes.DeleteRelatedSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class DeleteRelatedFailure implements Action {
  readonly type = AttributeActionTypes.DeleteRelatedFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadAttributeTags implements Action {
  readonly type = AttributeActionTypes.LoadAttributeTags;
  constructor(public payload: { workPackageId: string, attributeId: string }) {}
}

export class LoadAttributeTagsSuccess implements Action {
  readonly type = AttributeActionTypes.LoadAttributeTagsSuccess;
  constructor(public payload: Tag[]) {}
}

export class LoadAttributeTagsFail implements Action {
  readonly type = AttributeActionTypes.LoadAttributeTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddAttributeTags implements Action {
  readonly type = AttributeActionTypes.AddAttributeTags;
  constructor(public payload: { workPackageId: string; attributeId: string, tagIds: { id: string }[] }) {}
}

export class AddAttributeTagsSuccess implements Action {
  readonly type = AttributeActionTypes.AddAttributeTagsSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class AddAttributeTagsFail implements Action {
  readonly type = AttributeActionTypes.AddAttributeTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteAttributeTags implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeTags;
  constructor(public payload: { workPackageId: string; attributeId: string, tagId: string }) {}
}

export class DeleteAttributeTagsSuccess implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeTagsSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class DeleteAttributeTagsFail implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddAttributeRadio implements Action {
  readonly type = AttributeActionTypes.AddAttributeRadio;
  constructor(public payload: { workPackageId: string; attributeId: string, radioId: string }) {}
}

export class AddAttributeRadioSuccess implements Action {
  readonly type = AttributeActionTypes.AddAttributeRadioSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class AddAttributeRadioFailure implements Action {
  readonly type = AttributeActionTypes.AddAttributeRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteAttributeRadio implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeRadio;
  constructor(public payload: { workPackageId: string; attributeId: string, radioId: string }) {}
}

export class DeleteAttributeRadioSuccess implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeRadioSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class DeleteAttributeRadioFailure implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type AttributeActionsUnion =
  | LoadAttributes
  | LoadAttributesSuccess
  | LoadAttributesFailure
  | LoadAttribute
  | LoadAttributeSuccess
  | LoadAttributeFailure
  | UpdateAttribute
  | UpdateAttributeSuccess
  | UpdateAttributeFailure
  | AddAttribute
  | AddAttributeSuccess
  | AddAttributeFailure
  | DeleteAttribute
  | DeleteAttributeSuccess
  | DeleteAttributeFailure
  | AddOwner
  | AddOwnerSuccess
  | AddOwnerFailure
  | DeleteOwner
  | DeleteOwnerSuccess
  | DeleteOwnerFailure
  | UpdateProperty
  | UpdatePropertySuccess
  | UpdatePropertyFailure
  | DeleteProperty
  | DeletePropertySuccess
  | DeletePropertyFailure
  | AddRelated
  | AddRelatedSuccess
  | AddRelatedFailure
  | DeleteRelated
  | DeleteRelatedSuccess
  | DeleteRelatedFailure
  | LoadAttributeTags
  | LoadAttributeTagsSuccess
  | LoadAttributeTagsFail
  | AddAttributeTags
  | AddAttributeTagsSuccess
  | AddAttributeTagsFail
  | DeleteAttributeTags
  | DeleteAttributeTagsSuccess
  | DeleteAttributeTagsFail
  | AddAttributeRadio
  | AddAttributeRadioSuccess
  | AddAttributeRadioFailure
  | DeleteAttributeRadio
  | DeleteAttributeRadioSuccess
  | DeleteAttributeRadioFailure;
