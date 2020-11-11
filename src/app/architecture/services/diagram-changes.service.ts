import { Injectable } from '@angular/core';
import { linkCategories, LinkLayoutSettingsEntity } from '@app/architecture/store/models/node-link.model';
import {
  AddWorkPackageLink,
  AddWorkPackageMapViewLink,
  UpdateWorkPackageLink
} from '@app/workpackage/store/actions/workpackage-link.actions';
import { AddWorkPackageNode, UpdateWorkPackageNode } from '@app/workpackage/store/actions/workpackage-node.actions';
import { getEditWorkpackages, getSelectedWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { select, Store } from '@ngrx/store';
import * as go from 'gojs';
import { BehaviorSubject } from 'rxjs';
import { State as WorkPackageState } from '../../workpackage/store/reducers/workpackage.reducer';
import { DiagramLevelService, Level } from './diagram-level.service';
import { MatDialog } from '@angular/material';
import { EditNameModalComponent } from '@app/architecture/components/edit-name-modal/edit-name-modal.component';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import {
  getFilterLevelQueryParams,
  getMapViewQueryParams,
  getNodeIdQueryParams,
  getScopeQueryParams
} from '@app/core/store/selectors/route.selectors';
import {
  endPointTypes,
  layers,
  nodeCategories,
  NodeLayoutSettingsEntity
} from '@app/architecture/store/models/node.model';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import { getLayoutSelected } from '@app/layout/store/selectors/layout.selector';
import { AddWorkPackageMapViewTransformation } from '@app/workpackage/store/actions/workpackage.actions';
import {autoLayoutId, colourOptions} from '@app/architecture/store/models/layout.model';
import { defaultScopeId } from '@app/scope/store/models/scope.model';

@Injectable()
export class DiagramChangesService {
  public onUpdatePosition: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateExpandState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateLinkLabelState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateTransformationNodeLabelState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateGroupsAreaState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateNodeColour: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateLinkColour: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateDiagramLayout: BehaviorSubject<any> = new BehaviorSubject(null);
  public diagramEditable: boolean;
  private currentLevel: Level;
  private currentScope: string;
  private currentNodeId: string;
  private currentMapViewSource: { id: string; isTransformation: boolean };
  public dependenciesView = false;

  workpackages = [];
  selectedWorkpackages = [];
  layout;

  constructor(
    public diagramLevelService: DiagramLevelService,
    private store: Store<RouterReducerState<RouterStateUrl>>,
    private layoutStore: Store<LayoutState>,
    public dialog: MatDialog,
    private workpackageStore: Store<WorkPackageState>
  ) {
    this.workpackageStore
      .pipe(select(getEditWorkpackages))
      .subscribe(workpackages => (this.workpackages = workpackages));
    this.workpackageStore
      .pipe(select(getSelectedWorkpackages))
      .subscribe(workpackages => (this.selectedWorkpackages = workpackages));
    this.layoutStore.pipe(select(getLayoutSelected)).subscribe(layout => (this.layout = layout));
    this.store.select(getFilterLevelQueryParams).subscribe(filterLevel => {
      this.currentLevel = filterLevel;
      this.dependenciesView = false;
    });
    this.store.select(getScopeQueryParams).subscribe(scope => {
      this.currentScope = scope;
    });
    this.store.select(getNodeIdQueryParams).subscribe(nodeId => {
      this.currentNodeId = nodeId;
    });
    this.store.select(getMapViewQueryParams).subscribe(mapViewParams => {
      this.currentMapViewSource = mapViewParams;
    });
  }

  // Display map view for a link
  getMapViewForLink(event: go.InputEvent, object: go.Link): void {
    let mapViewSource: go.Part;

    // If link connects to a transformation node then use this node as the source of the map view.
    if (object.fromNode && object.fromNode.category === nodeCategories.transformation) {
      mapViewSource = object.fromNode;
    } else if (object.toNode && object.toNode.category === nodeCategories.transformation) {
      mapViewSource = object.toNode;
      // Otherwise, use the link as the source of the map view.
    } else {
      mapViewSource = object;
    }

    this.diagramLevelService.displayMapView.call(this.diagramLevelService, event, mapViewSource);
  }
}
