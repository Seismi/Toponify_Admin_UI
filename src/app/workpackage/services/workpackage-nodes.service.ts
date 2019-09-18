/* tslint:disable:max-line-length */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { WorkPackageService } from './workpackage.service';
import { WorkpackageNode, WorkpackageNodeDescendant, WorkpackageNodeCustomProperty } from '../store/models/workpackage.models';

@Injectable()
export class WorkPackageNodesService extends WorkPackageService {

  /**
   * Create new architecture node (system, data set, dimensions, reporting concept)
   * FIXME: missing types
   */
  addNode(workPackageId: string, data: WorkpackageNode): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes`, {data}, this.httpOptions);
  }

  /**
   * Update a specific node within the architecture
   * FIXME: missing types
   */
  updateNode(workPackageId: string, nodeId: string, data: WorkpackageNode): Observable<any> {
    return this.http.put<any>(`/workpackages/${workPackageId}/nodes/${nodeId}`, {data}, this.httpOptions);
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
  getNodeDescendants(workPackageId: string, nodeId: string): Observable<any> {
    return this.http.get<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/descendants`);
  }

  /**
   * Add a dependency to a node
   * FIXME: missing types
   */
  addNodeDescendant(workPackageId: string, nodeId: string, descendantNodeId: string, data: WorkpackageNodeDescendant): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/descendants/${descendantNodeId}`, {data}, this.httpOptions);
  }

  /**
   * Remove a descendant from the list
   * FIXME: missing types
   */
  deleteNodeDescendant(workPackageId: string, nodeId: string, descendantNodeId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/descendants/${descendantNodeId}/deleteRequest`,
    {});
  }

  /**
   * Add owner to a node
   * FIXME: missing types
   */
  addNodeOwner(workPackageId: string, nodeId: string, ownerId: string, data: any): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/owners/${ownerId}`, data, this.httpOptions);
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
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/attributes/${attributeId}`, data, this.httpOptions);
  }

  /**
   * Delete attribute from a node
   * FIXME: missing types
   */
  deleteNodeAttribute(workPackageId: string, nodeId: string, attributeId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/attributes/${attributeId}/deleteRequest`, {});
  }

  /**
   * Add custom property to a node
   * FIXME: missing types
   */
  addNodeCustomProperty(workPackageId: string, nodeId: string, customPropertyId: string, data: WorkpackageNodeCustomProperty): Observable<any> {
    return this.http.put<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/customPropertyValues/${customPropertyId}`,
    data, this.httpOptions);
  }

  /**
   * Delete custom property from a node
   * FIXME: missing types
   */
  deleteNodeCustomProperty(workPackageId: string, nodeId: string, customPropertyId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/customPropertyValues/${customPropertyId}/deleteRequest`, {});
  }

}

