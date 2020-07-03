/* tslint:disable:max-line-length */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { WorkPackageService } from './workpackage.service';
import {
  WorkpackageNode,
  WorkPackageNodeFindPotential,
  WorkPackageNodeScopeApiResponse,
  WorkPackageNodeScopesApiResponse,
  WorkPackageDetailApiResponse
} from '../store/models/workpackage.models';
import { HttpParams } from '@angular/common/http';
import {
  DescendantsEntity,
  NodesApiResponse,
  WorkPackageNodeDescendantsApiResponse,
  NodeDetailApiResponse,
  WorkPackageGroupMembersApiResponse
} from '@app/architecture/store/models/node.model';

export interface GetWorkPackageNodeScopesQueryParams {
  workPackageQuery?: string[];
  availableForAddition?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WorkPackageNodesService extends WorkPackageService {
  /**
   * Create new architecture node (system, data node, dimensions, reporting concept)
   * FIXME: missing types
   */
  addNode(workPackageId: string, data: WorkpackageNode, scope?: string): Observable<any> {
    if (scope) {
      return this.http.post<any>(
        `/workpackages/${workPackageId}/nodes`,
        { data },
        { ...this.httpOptions, params: { scopeQuery: scope } }
      );
    } else {
      return this.http.post<any>(`/workpackages/${workPackageId}/nodes`, { data }, this.httpOptions);
    }
  }

  /**
   * Update a specific node within the architecture
   * FIXME: missing types
   */
  updateNode(workPackageId: string, nodeId: string, data: WorkpackageNode): Observable<any> {
    return this.http.put<any>(`/workpackages/${workPackageId}/nodes/${nodeId}`, { data }, this.httpOptions);
  }

  /**
   * Request deletion of a specific node within the architecture.
   * FIXME: missing types
   */
  deleteNode(workPackageId: string, nodeId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/deleteRequest`, {});
  }

  /**
   * Get the descendants of an architecture node
   * FIXME: missing types
   */
  findPotentialWorkPackageNodes(
    workPackageId: string,
    nodeId: string,
    data: WorkPackageNodeFindPotential
  ): Observable<WorkPackageNodeDescendantsApiResponse> {
    return this.http.post<WorkPackageNodeDescendantsApiResponse>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/children/find/potential/`,
      { data: data },
      this.httpOptions
    );
  }

  /**
   * Get the potential group members of an architecture node
   */
  findPotentialGroupMemberNodes(
    workPackageId: string,
    nodeId: string,
    scope: string,
    asShared: boolean
  ): Observable<WorkPackageGroupMembersApiResponse> {

    const params = this.toHttpParams({ scopeQuery: scope, asShared: asShared });

    return this.http.get<WorkPackageGroupMembersApiResponse>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/groupMembers/find/potential/`,
      { params: params }
    );
  }

  getNodeDescendants(workPackageId: string, nodeId: string): Observable<any> {
    return this.http.get<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/descendants`);
  }

  addNodeDescendant(workPackageId: string, nodeId: string, data: DescendantsEntity): Observable<NodesApiResponse> {
    return this.http.post<NodesApiResponse>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/children`,
      { data: data },
      this.httpOptions
    );
  }

  /**
   * Remove a descendant from the list
   * FIXME: missing types
   */
  deleteNodeDescendant(workPackageId: string, nodeId: string, descendantNodeId: string): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/children/${descendantNodeId}/deleteRequest`,
      {}
    );
  }

  /**
   * Add owner to a node
   * FIXME: missing types
   */
  addNodeOwner(workPackageId: string, nodeId: string, ownerId: string, data: any): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/owners/${ownerId}`,
      data,
      this.httpOptions
    );
  }

  /**
   * Delete owner from a node
   * FIXME: missing types
   */
  deleteNodeOwner(workPackageId: string, nodeId: string, ownerId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/owners/${ownerId}/deleteRequest`, {});
  }

  /**
   * Add attribute to a node
   * FIXME: missing types
   */
  addNodeAttribute(workPackageId: string, nodeId: string, attributeId: string, data: any): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/attributes/${attributeId}`,
      data,
      this.httpOptions
    );
  }

  /**
   * Delete attribute from a node
   * FIXME: missing types
   */
  deleteNodeAttribute(workPackageId: string, nodeId: string, attributeId: string): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/attributes/${attributeId}/deleteRequest`,
      {}
    );
  }

  updateNodeProperty(
    workPackageId: string,
    nodeId: string,
    customPropertyId: string,
    data: string
  ): Observable<NodeDetailApiResponse> {
    return this.http.put<NodeDetailApiResponse>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/customPropertyValues/${customPropertyId}`,
      { data },
      this.httpOptions
    );
  }

  deleteNodeProperty(workPackageId: string, nodeId: string, customPropertyId: string): Observable<NodeDetailApiResponse> {
    return this.http.post<NodeDetailApiResponse>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/customPropertyValues/${customPropertyId}/deleteRequest`,
      {}
    );
  }

  getWorkPackageNodeScopes(
    nodeId: string,
    queryParams?: GetWorkPackageNodeScopesQueryParams
  ): Observable<WorkPackageNodeScopesApiResponse> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get<WorkPackageNodeScopesApiResponse>(`/nodes/${nodeId}/scopes`, { params: params });
  }

  addWorkPackageNodeScope(scopeId: string, data: string[]): Observable<WorkPackageNodeScopeApiResponse> {
    return this.http.post<WorkPackageNodeScopeApiResponse>(
      `/scopes/${scopeId}/nodes`,
      { data: data },
      this.httpOptions
    );
  }

  addWorkPackageNodeRadio(workPackageId: string, nodeId: string, radioId: string): Observable<NodeDetailApiResponse> {
    return this.http.post<NodeDetailApiResponse>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/radios/${radioId}`,
      this.httpOptions
    );
  }

  deleteWorkPackageNodeScope(scopeId: string, nodeId: string): Observable<WorkPackageNodeScopeApiResponse> {
    return this.http.delete<WorkPackageNodeScopeApiResponse>(`/scopes/${scopeId}/nodes/${nodeId}`, this.httpOptions);
  }

  addWorkPackageNodeAttribute(workPackageId: string, nodeId: string, attributeId: string): Observable<NodeDetailApiResponse> {
    return this.http.post<NodeDetailApiResponse>(`/workpackages/${workPackageId}/nodes/${nodeId}/attributes/${attributeId}`, this.httpOptions);
  }

  deleteWorkPackageNodeAttribute(workPackageId: string, nodeId: string, attributeId: string): Observable<NodeDetailApiResponse> {
    return this.http.post<NodeDetailApiResponse>(`/workpackages/${workPackageId}/nodes/${nodeId}/attributes/${attributeId}/deleteRequest`, {});
  }

  addWorkPackageNodeGroup(workPackageId: string, systemId: string, groupId: string): Observable<NodeDetailApiResponse> {
    return this.http.post<NodeDetailApiResponse>(`/workpackages/${workPackageId}/nodes/${systemId}/group/set/${groupId}`, this.httpOptions);
  }

  deleteWorkPackageNodeGroup(workPackageId: string, systemId: string): Observable<NodeDetailApiResponse> {
    return this.http.post<NodeDetailApiResponse>(`/workpackages/${workPackageId}/nodes/${systemId}/group/deleteRequest`, {});
  }

  SetWorkPackageNodeAsMaster(workPackageId: string, nodeId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/setAsMaster`, {});
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    let httpParams = new HttpParams();
    Object.getOwnPropertyNames(obj).forEach(key => {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          httpParams = httpParams.append(`${key}[]`, item);
        });
      } else {
        httpParams = httpParams.set(key, obj[key]);
      }
    });
    return httpParams;
  }
}
