/* tslint:disable:max-line-length */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { WorkPackageService } from './workpackage.service';
import { NodeLink, NodeLinkDetailApiResponse } from '@app/architecture/store/models/node-link.model';
import {
  WorkpackageLink,
  WorkpackageLinkCustomProperty,
  WorkpackageLinkSliceAdd,
  WorkpackageLinkSliceCondition,
  WorkpackageLinkSliceConditionType,
  WorkpackageLinkSliceUpdate
} from '../store/models/workpackage.models';

@Injectable()
export class WorkPackageLinksService extends WorkPackageService {
  /**
   * Create a new link between two architecture nodes
   * FIXME: missing types
   */
  addLink(workPackageId: string, data: WorkpackageLink): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodelinks`, { data }, this.httpOptions);
  }

  /**
   * Update a link between Architecture Nodes
   * FIXME: missing types
   */
  updateLink(workPackageId: string, nodeLinkId: string, data: WorkpackageLink): Observable<any> {
    return this.http.put<any>(`/workpackages/${workPackageId}/nodelinks/${nodeLinkId}`, { data }, this.httpOptions);
  }

  /**
   * Request deletion of a node link.
   * FIXME: missing types
   */
  deleteLink(workPackageId: string, nodeLinkId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/deleteRequest`, {});
  }

  addLinkAttribute(workPackageId: string, nodeLinkId: string, attributeId: string): Observable<NodeLinkDetailApiResponse> {
    return this.http.post<NodeLinkDetailApiResponse>(
      `/workpackages/${workPackageId}/nodeLinks/${nodeLinkId}/attributes/${attributeId}`,
      this.httpOptions
    );
  }

  /**
   * Delete attribute from a link
   * FIXME: missing types
   */
  deleteLinkAttribute(workPackageId: string, nodeLinkId: string, attributeId: string): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodeLinks/${nodeLinkId}/attributes/${attributeId}/deleteRequest`,
      {}
    );
  }

  /**
   * Add custom property to a link
   * FIXME: missing types
   */
  addLinkCustomProperty(
    workPackageId: string,
    nodeLinkId: string,
    customPropertyId: string,
    data: WorkpackageLinkCustomProperty
  ): Observable<any> {
    return this.http.put<any>(
      `/workpackages/${workPackageId}/nodeLinks/${nodeLinkId}/customPropertyValues/${customPropertyId}`,
      { data },
      this.httpOptions
    );
  }

  /**
   * Delete custom property from a link
   * FIXME: missing types
   */
  deleteLinkCustomProperty(workPackageId: string, nodeLinkId: string, customPropertyId: string): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodeLinks/${nodeLinkId}/customPropertyValues/${customPropertyId}/deleteRequest`,
      {}
    );
  }

  /**
   * Get the descendants of a link
   * FIXME: missing types
   */
  getLinkDescendants(workPackageId: string, nodeLinkId: string): Observable<any> {
    return this.http.get<any>(`/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/descendants`);
  }

  /**
   * Create a new slice
   * FIXME: missing types
   */
  addLinkSlice(workPackageId: string, nodeLinkId: string, data: WorkpackageLinkSliceAdd): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/slices/`,
      data,
      this.httpOptions
    );
  }

  /**
   * Update a slice
   * FIXME: missing types
   */
  updateLinkSlice(
    workPackageId: string,
    nodeLinkId: string,
    sliceId: string,
    data: WorkpackageLinkSliceUpdate
  ): Observable<any> {
    return this.http.put<any>(
      `/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/slices/${sliceId}`,
      data,
      this.httpOptions
    );
  }

  /**
   * Request deletion of a slice
   * FIXME: missing types
   */
  deleteLinkSlice(workPackageId: string, nodeLinkId: string, sliceId: string): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/slices/${sliceId}/deleteRequest`,
      {}
    );
  }

  /**
   * Create a new slice condition type
   * FIXME: missing types
   */
  addLinkSliceConditionType(
    workPackageId: string,
    nodeLinkId: string,
    data: WorkpackageLinkSliceConditionType
  ): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/sliceConditionTypes/`,
      data,
      this.httpOptions
    );
  }

  /**
   * Update a slice
   * FIXME: missing types
   */
  updateLinkSliceConditionType(
    workPackageId: string,
    nodeLinkId: string,
    sliceConditionTypeId: string,
    data: WorkpackageLinkSliceConditionType
  ): Observable<any> {
    return this.http.put<any>(
      `/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/sliceConditionTypes/${sliceConditionTypeId}`,
      data,
      this.httpOptions
    );
  }

  /**
   * Request deletion of a slice
   * FIXME: missing types
   */
  deleteLinkSliceConditionType(
    workPackageId: string,
    nodeLinkId: string,
    sliceConditionTypeId: string
  ): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/sliceConditionTypes/${sliceConditionTypeId}/deleteRequest`,
      {}
    );
  }

  /**
   * Add a slice condition
   * FIXME: missing types
   */
  addLinkSliceCondition(
    workPackageId: string,
    nodeLinkId: string,
    data: WorkpackageLinkSliceCondition
  ): Observable<any> {
    return this.http.put<any>(
      `/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/sliceConditions/`,
      data,
      this.httpOptions
    );
  }

  /**
   * Request deletion of a slice condition
   * FIXME: missing types
   */
  deleteLinkSliceCondition(workPackageId: string, nodeLinkId: string): Observable<any> {
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodelinks/${nodeLinkId}/sliceConditions/deleteRequest`,
      {}
    );
  }

  
  addLinkOwner(workPackageId: string, nodeLinkId: string, ownerId: string): Observable<NodeLink> {
    return this.http.post<NodeLink>(`/workpackages/${workPackageId}/nodeLinks/${nodeLinkId}/owners/${ownerId}`, this.httpOptions);
  }

  deleteLinkOwner(workPackageId: string, nodeLinkId: string, ownerId: string): Observable<NodeLink> {
    return this.http.post<NodeLink>(`/workpackages/${workPackageId}/nodeLinks/${nodeLinkId}/owners/${ownerId}/deleteRequest`, {});
  }

}
