import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { WorkPackageNodeFindPotential, WorkPackageNodeScopes } from '../models/workpackage.models';
import { GetWorkPackageNodeScopesQueryParams } from '@app/workpackage/services/workpackage-nodes.service';
import { DescendantsEntity, NodeDetail } from '@app/architecture/store/models/node.model';

export enum WorkPackageNodeActionTypes {
  AddWorkPackageNode = '[WorkPackage] Add node',
  AddWorkPackageNodeSuccess = '[WorkPackage] Add node success',
  AddWorkPackageNodeFailure = '[WorkPackage] Add node failure',

  AddWorkPackageNodeDescendant = '[WorkPackage] Add node descendant',
  AddWorkPackageNodeDescendantSuccess = '[WorkPackage] Add node descendant success',
  AddWorkPackageNodeDescendantFailure = '[WorkPackage] Add node descendant failure',

  AddWorkPackageMapViewNodeDescendant = '[WorkPackage] Add map view node descendant',
  AddWorkPackageMapViewNodeDescendantSuccess = '[WorkPackage] Add map view  node descendant success',
  AddWorkPackageMapViewNodeDescendantFailure = '[WorkPackage] Add map view node descendant failure',

  DeleteWorkPackageNodeDescendant = '[WorkPackage] Delete node descendant',
  DeleteWorkPackageNodeDescendantSuccess = '[WorkPackage] Delete node descendant success',
  DeleteWorkPackageNodeDescendantFailure = '[WorkPackage] Delete node descendant failure',

  LoadWorkPackageNodeDescendants = '[WorkPackage] Load node descendants',
  LoadWorkPackageNodeDescendantsSuccess = '[WorkPackage] Load node descendants success',
  LoadWorkPackageNodeDescendantsFailure = '[WorkPackage] Load node descendants failure',

  UpdateWorkPackageNode = '[WorkPackage] Update node',
  UpdateWorkPackageNodeSuccess = '[WorkPackage] Update node success',
  UpdateWorkPackageNodeFailure = '[WorkPackage] Update node failure',

  DeleteWorkpackageNode = '[WorkPackage] Delete Node',
  DeleteWorkpackageNodeSuccess = '[WorkPackage] Delete Node Success',
  DeleteWorkpackageNodeFailure = '[WorkPackage] Delete Node Fail',

  AddWorkpackageNodeOwner = '[WorkPackage] Add Node Owner',
  AddWorkpackageNodeOwnerSuccess = '[WorkPackage] Add Node Owner Success',
  AddWorkpackageNodeOwnerFailure = '[WorkPackage] Add Node Owner Failure',

  DeleteWorkpackageNodeOwner = '[WorkPackage] Delete Node Owner',
  DeleteWorkpackageNodeOwnerSuccess = '[WorkPackage] Delete Node Owner Success',
  DeleteWorkpackageNodeOwnerFailure = '[WorkPackage] Delete Node Owner Failure',

  LoadWorkPackageNodeScopes = '[WorkPackage] Load Node Scopes',
  LoadWorkPackageNodeScopesSuccess = '[WorkPackage] Load Node Scopes Success',
  LoadWorkPackageNodeScopesFailure = '[WorkPackage] Load Node Scopes Failure',

  LoadWorkPackageNodeScopesAvailability = '[WorkPackage] Load Node Scopes Availability',
  LoadWorkPackageNodeScopesAvailabilitySuccess = '[WorkPackage] Load Node Scopes Availability Success',
  LoadWorkPackageNodeScopesAvailabilityFailure = '[WorkPackage] Load Node Scopes Availability Failure',

  AddWorkPackageNodeScope = '[Scope] Add Node Scope',
  AddWorkPackageNodeScopeSuccess = '[Scope] Add Node Scope Success',
  AddWorkPackageNodeScopeFailure = '[Scope] Add Node Scope Failure',

  DeleteWorkPackageNodeScope = '[Scope] Delete Node Scope',
  DeleteWorkPackageNodeScopeSuccess = '[Scope] Delete Node Scope Success',
  DeleteWorkPackageNodeScopeFailure = '[Scope] Delete Node Scope Failure',

  FindPotentialWorkpackageNodes = '[WorkPackage] Find Potential Workpackage Nodes',
  FindPotentialWorkpackageNodesSuccess = '[WorkPackage] Find Potential Workpackage Nodes Success',
  FindPotentialWorkpackageNodesFailure = '[WorkPackage] Find Potential Workpackage Nodes Failure',

  FindPotentialGroupMemberNodes = '[WorkPackage] Find Potential Group Member Nodes',
  FindPotentialGroupMemberNodesSuccess = '[WorkPackage] Find Potential Group Member Nodes Success',
  FindPotentialGroupMemberNodesFailure = '[WorkPackage] Find Potential Group Member Nodes Failure',

  AddWorkPackageNodeRadio = '[WorkPackage] Add Node Radio',
  AddWorkPackageNodeRadioSuccess = '[WorkPackage] Add Node Radio Success',
  AddWorkPackageNodeRadioFailure = '[WorkPackage] Add Node Radio Failure',

  AddWorkPackageNodeAttribute = '[WorkPackage] Add Node Attribute',
  AddWorkPackageNodeAttributeSuccess = '[WorkPackage] Add Node Attribute Success',
  AddWorkPackageNodeAttributeFailure = '[WorkPackage] Add Node Attribute Failure',

  UpdateWorkPackageNodeProperty = '[WorkPackage] Update Node Property',
  UpdateWorkPackageNodePropertySuccess = '[WorkPackage] Update Node Property Success',
  UpdateWorkPackageNodePropertyFailure = '[WorkPackage] Update Node Property Failure',

  DeleteWorkPackageNodeProperty = '[WorkPackage] Delete Node Property',
  DeleteWorkPackageNodePropertySuccess = '[WorkPackage] Delete Node Property Success',
  DeleteWorkPackageNodePropertyFailure = '[WorkPackage] Delete Node Property Failure',

  DeleteWorkPackageNodeAttribute = '[WorkPackage] Delete Node Attribute',
  DeleteWorkPackageNodeAttributeSuccess = '[WorkPackage] Delete Node Attribute Success',
  DeleteWorkPackageNodeAttributeFailure = '[WorkPackage] Delete Node Attribute Failure',

  AddWorkPackageNodeGroup = '[WorkPackage] Add Node To Group',
  AddWorkPackageNodeGroupSuccess = '[WorkPackage] Add Node To Group Success',
  AddWorkPackageNodeGroupFailure = '[WorkPackage] Add Node To Group Failure',

  DeleteWorkPackageNodeGroup = '[WorkPackage] Delete Node Group',
  DeleteWorkPackageNodeGroupSuccess = '[WorkPackage] Delete Node Group Success',
  DeleteWorkPackageNodeGroupFailure = '[WorkPackage] Delete Node Group Failure'
}

export class AddWorkPackageNode implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNode;
  constructor(public payload: { workpackageId: string; node: any; scope?: string, newLayoutDetails?: any }) {}
}

export class AddWorkPackageNodeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeSuccess;
  constructor(public payload: any) {}
}

export class AddWorkPackageNodeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddWorkPackageNodeDescendant implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeDescendant;
  constructor(public payload: { workPackageId: string; nodeId: string; data: DescendantsEntity }) {}
}

export class AddWorkPackageNodeDescendantSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeDescendantSuccess;
  constructor(public payload: DescendantsEntity) {}
}

export class AddWorkPackageNodeDescendantFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeDescendantFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddWorkPackageMapViewNodeDescendant implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageMapViewNodeDescendant;
  constructor(public payload: { workPackageId: string; nodeId: string; data: DescendantsEntity, mapViewParams: any }) {}
}

export class AddWorkPackageMapViewNodeDescendantSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageMapViewNodeDescendantSuccess;
  constructor(public payload: DescendantsEntity) {}
}

export class AddWorkPackageMapViewNodeDescendantFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageMapViewNodeDescendantFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkPackageNodeDescendant implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeDescendant;
  constructor(public payload: { workpackageId: string; nodeId: string; descendantId: string }) {}
}

export class DeleteWorkPackageNodeDescendantSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeDescendantSuccess;
  constructor(public payload: DescendantsEntity) {}
}

export class DeleteWorkPackageNodeDescendantFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeDescendantFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateWorkPackageNode implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNode;
  constructor(public payload: { workpackageId: string; nodeId: string; node: any }) {}
}

export class UpdateWorkPackageNodeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNodeSuccess;
  constructor(public payload: any) {}
}

export class UpdateWorkPackageNodeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNodeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadWorkPackageNodeDescendants implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendants;
  constructor(public payload: { workpackageId: string; nodeId: string }) {}
}

export class LoadWorkPackageNodeDescendantsSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendantsSuccess;
  constructor(public payload: any) {}
}

export class LoadWorkPackageNodeDescendantsFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendantsFailure;
  constructor(public payload: any) {}
}

export class DeleteWorkpackageNode implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNode;
  constructor(public payload: { workpackageId: string; nodeId: string }) {}
}

export class DeleteWorkpackageNodeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNodeSuccess;
  constructor(public payload: any) {}
}

export class DeleteWorkpackageNodeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNodeFailure;
  constructor(public payload: any) {}
}

export class AddWorkpackageNodeOwner implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkpackageNodeOwner;
  constructor(public payload: { workpackageId: string; nodeId: string; ownerId: string; data: any }) {}
}

export class AddWorkpackageNodeOwnerSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkpackageNodeOwnerSuccess;
  constructor(public payload: any) {}
}

export class AddWorkpackageNodeOwnerFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkpackageNodeOwnerFailure;
  constructor(public payload: any) {}
}

export class DeleteWorkpackageNodeOwner implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNodeOwner;
  constructor(public payload: { workpackageId: string; nodeId: string; ownerId: string }) {}
}

export class DeleteWorkpackageNodeOwnerSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNodeOwnerSuccess;
  constructor(public payload: any) {}
}

export class DeleteWorkpackageNodeOwnerFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNodeOwnerFailure;
  constructor(public payload: any) {}
}

export class LoadWorkPackageNodeScopes implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeScopes;
  constructor(public payload: { nodeId: string; queryParams?: GetWorkPackageNodeScopesQueryParams }) {}
}

export class LoadWorkPackageNodeScopesSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesSuccess;
  constructor(public payload: WorkPackageNodeScopes[]) {}
}

export class LoadWorkPackageNodeScopesFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesFailure;
  constructor(public payload: Error) {}
}

export class LoadWorkPackageNodeScopesAvailability implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesAvailability;
  constructor(public payload: { nodeId: string; queryParams?: GetWorkPackageNodeScopesQueryParams }) {}
}

export class LoadWorkPackageNodeScopesAvailabilitySuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesAvailabilitySuccess;
  constructor(public payload: WorkPackageNodeScopes[]) {}
}

export class LoadWorkPackageNodeScopesAvailabilityFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesAvailabilityFailure;
  constructor(public payload: Error) {}
}

export class AddWorkPackageNodeScope implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeScope;
  constructor(public payload: { scopeId: string; data: string[] }) {}
}

export class AddWorkPackageNodeScopeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeScopeSuccess;
  constructor(public payload: WorkPackageNodeScopes) {}
}

export class AddWorkPackageNodeScopeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkPackageNodeScope implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeScope;
  constructor(public payload: { scopeId: string; nodeId: string }) {}
}

export class DeleteWorkPackageNodeScopeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeScopeSuccess;
  constructor(public payload: WorkPackageNodeScopes) {}
}

export class DeleteWorkPackageNodeScopeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class FindPotentialWorkpackageNodes implements Action {
  readonly type = WorkPackageNodeActionTypes.FindPotentialWorkpackageNodes;
  constructor(public payload: { workPackageId: string; nodeId: string; data: WorkPackageNodeFindPotential }) {}
}

export class FindPotentialWorkpackageNodesSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.FindPotentialWorkpackageNodesSuccess;
  constructor(public payload: DescendantsEntity[]) {}
}

export class FindPotentialWorkpackageNodesFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.FindPotentialWorkpackageNodesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class FindPotentialGroupMemberNodes implements Action {
  readonly type = WorkPackageNodeActionTypes.FindPotentialGroupMemberNodes;
  constructor(public payload: { workPackageId: string; nodeId: string; scope: string; asShared: boolean }) {}
}

export class FindPotentialGroupMemberNodesSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.FindPotentialGroupMemberNodesSuccess;
  constructor(public payload: DescendantsEntity[]) {}
}

export class FindPotentialGroupMemberNodesFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.FindPotentialGroupMemberNodesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddWorkPackageNodeRadio implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeRadio;
  constructor(public payload: { workPackageId: string; nodeId: string; radioId: string }) {}
}

export class AddWorkPackageNodeRadioSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeRadioSuccess;
  constructor(public payload: NodeDetail) {}
}

export class AddWorkPackageNodeRadioFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddWorkPackageNodeAttribute implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeAttribute;
  constructor(public payload: { workPackageId: string; nodeId: string, attributeId: string }) {}
}

export class AddWorkPackageNodeAttributeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeAttributeSuccess;
  constructor(public payload: NodeDetail) {}
}

export class AddWorkPackageNodeAttributeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}

}

export class DeleteWorkPackageNodeAttribute implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeAttribute;
  constructor(public payload: { workPackageId: string; nodeId: string; attributeId: string }) {}
}

export class DeleteWorkPackageNodeAttributeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeAttributeSuccess;
  constructor(public payload: NodeDetail) {}
}

export class DeleteWorkPackageNodeAttributeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeAttributeFailure;
  constructor(public payload: any) {}
}

export class UpdateWorkPackageNodeProperty implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNodeProperty;
  constructor(public payload: { workPackageId: string; nodeId: string; customPropertyId: string, data: string }) {}
}

export class UpdateWorkPackageNodePropertySuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNodePropertySuccess;
  constructor(public payload: NodeDetail) {}
}

export class UpdateWorkPackageNodePropertyFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNodePropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkPackageNodeProperty implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeProperty;
  constructor(public payload: { workPackageId: string; nodeId: string; customPropertyId: string }) {}
}

export class DeleteWorkPackageNodePropertySuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodePropertySuccess;
  constructor(public payload: NodeDetail) {}
}

export class DeleteWorkPackageNodePropertyFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodePropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddWorkPackageNodeGroup implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeGroup;
  constructor(public payload: { workPackageId: string; systemId: any; groupId: string }) {}
}

export class AddWorkPackageNodeGroupSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeGroupSuccess;
  constructor(public payload: NodeDetail) {}
}

export class AddWorkPackageNodeGroupFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeGroupFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkPackageNodeGroup implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeGroup;
  constructor(public payload: { workPackageId: string; systemId: string }) {}
}

export class DeleteWorkPackageNodeGroupSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeGroupSuccess;
  constructor(public payload: NodeDetail) {}
}

export class DeleteWorkPackageNodeGroupFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkPackageNodeGroupFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type WorkPackageNodeActionsUnion =
  | AddWorkPackageNode
  | AddWorkPackageNodeSuccess
  | AddWorkPackageNodeFailure
  | AddWorkPackageNodeDescendant
  | AddWorkPackageNodeDescendantSuccess
  | AddWorkPackageNodeDescendantFailure
  | AddWorkPackageMapViewNodeDescendant
  | AddWorkPackageMapViewNodeDescendantSuccess
  | AddWorkPackageMapViewNodeDescendantFailure
  | UpdateWorkPackageNode
  | UpdateWorkPackageNodeSuccess
  | UpdateWorkPackageNodeFailure
  | LoadWorkPackageNodeDescendants
  | LoadWorkPackageNodeDescendantsSuccess
  | LoadWorkPackageNodeDescendantsFailure
  | DeleteWorkpackageNode
  | DeleteWorkpackageNodeSuccess
  | DeleteWorkpackageNodeFailure
  | AddWorkpackageNodeOwner
  | AddWorkpackageNodeOwnerSuccess
  | AddWorkpackageNodeOwnerFailure
  | DeleteWorkpackageNodeOwner
  | DeleteWorkpackageNodeOwnerSuccess
  | DeleteWorkpackageNodeOwnerFailure
  | DeleteWorkPackageNodeDescendant
  | DeleteWorkPackageNodeDescendantSuccess
  | DeleteWorkPackageNodeDescendantFailure
  | LoadWorkPackageNodeScopes
  | LoadWorkPackageNodeScopesSuccess
  | LoadWorkPackageNodeScopesFailure
  | LoadWorkPackageNodeScopesAvailability
  | LoadWorkPackageNodeScopesAvailabilitySuccess
  | LoadWorkPackageNodeScopesAvailabilityFailure
  | AddWorkPackageNodeScope
  | AddWorkPackageNodeScopeSuccess
  | AddWorkPackageNodeScopeFailure
  | DeleteWorkPackageNodeScope
  | DeleteWorkPackageNodeScopeSuccess
  | DeleteWorkPackageNodeScopeFailure
  | FindPotentialWorkpackageNodes
  | FindPotentialWorkpackageNodesSuccess
  | FindPotentialWorkpackageNodesFailure
  | FindPotentialGroupMemberNodes
  | FindPotentialGroupMemberNodesSuccess
  | FindPotentialGroupMemberNodesFailure
  | AddWorkPackageNodeRadio
  | AddWorkPackageNodeRadioSuccess
  | AddWorkPackageNodeRadioFailure
  | AddWorkPackageNodeAttribute
  | AddWorkPackageNodeAttributeSuccess
  | AddWorkPackageNodeAttributeFailure
  | UpdateWorkPackageNodeProperty
  | UpdateWorkPackageNodePropertySuccess
  | UpdateWorkPackageNodePropertyFailure
  | DeleteWorkPackageNodeProperty
  | DeleteWorkPackageNodePropertySuccess
  | DeleteWorkPackageNodePropertyFailure
  | DeleteWorkPackageNodeAttribute
  | DeleteWorkPackageNodeAttributeSuccess
  | DeleteWorkPackageNodeAttributeFailure
  | AddWorkPackageNodeGroup
  | AddWorkPackageNodeGroupSuccess
  | AddWorkPackageNodeGroupFailure
  | DeleteWorkPackageNodeGroup
  | DeleteWorkPackageNodeGroupSuccess
  | DeleteWorkPackageNodeGroupFailure;
