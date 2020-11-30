import {Injectable} from '@angular/core';
import {DiagramLevelService, Level} from '@app/architecture/services/diagram-level.service';
import {select, Store} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/core/store';
import {MatDialog} from '@angular/material';
import {State as WorkPackageState} from '@app/workpackage/store/reducers/workpackage.reducer';
import * as go from 'gojs';
import {EditNameModalComponent} from '@app/architecture/components/edit-name-modal/edit-name-modal.component';
import {autoLayoutId} from '@app/architecture/store/models/layout.model';
import {AddWorkPackageNode, UpdateWorkPackageNode} from '@app/workpackage/store/actions/workpackage-node.actions';
import {
  AddWorkPackageLink,
  AddWorkPackageMapViewLink,
  UpdateWorkPackageLink
} from '@app/workpackage/store/actions/workpackage-link.actions';
import {layers} from '@app/architecture/store/models/node.model';
import {AddWorkPackageMapViewTransformation} from '@app/workpackage/store/actions/workpackage.actions';
import {defaultScopeId} from '@app/scope/store/models/scope.model';
import {DiagramLayoutChangesService} from '@app/architecture/services/diagram-layout-changes.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {DiagramUtilitiesService} from '@app/architecture/services/diagram-utilities-service';
import {getMapViewQueryParams, getNodeIdQueryParams, getScopeQueryParams} from '@app/core/store/selectors/route.selectors';
import {getEditWorkpackages, getSelectedWorkpackages} from '@app/workpackage/store/selectors/workpackage.selector';

let thisService: DiagramStructureChangesService;

// Customised link that only updates its route when a tool that can affect link route is active
export class CustomLink extends go.Link {
  constructor() {
    super();
  }

  // Override computePoints method
  public computePoints(): boolean {

    // Failsafe - call ordinary computePoints process for any links that are partially disconnected and have no route
    if ((!this.fromNode || !this.toNode) && this.points.count === 0) {
      return go.Link.prototype.computePoints.call(this);
    }

    // Leave link route as is if link is disconnected - prevents bug where links dragged from palette were flipping
    if (!this.fromNode && !this.toNode) {
      return true;
    }

    if (this.data.isTemporary) {
      return go.Link.prototype.computePoints.call(this);
    }

    // Avoid errors that occur for links that do not have their diagram property set
    if (!this.diagram) {
      return go.Link.prototype.computePoints.call(this);
    }

    const toolManager = this.diagram.toolManager;
    const linkShiftingTool = toolManager.mouseDownTools.toArray().find(function (tool) {
      return tool.name === 'LinkShifting';
    });

    // Always update route if "updateRoute" flag set or no route defined
    if (this.data.updateRoute || this.points.count === 0) {
      // Reset "updateRoute" flag
      this.diagram.model.setDataProperty(this.data, 'updateRoute', false);
      return go.Link.prototype.computePoints.call(this);
    }

    // Update route for links connected to dragged nodes
    if (toolManager.draggingTool.isActive) {
      const draggedParts = new go.Set(toolManager.draggingTool.draggedParts.iteratorKeys);
      const linkAffected = draggedParts.any(function (part: go.Part): boolean {
        if (part instanceof go.Link) {
          return part === this;
        } else if (part instanceof go.Node) {
          return (new go.Set<go.Link>(part.findLinksConnected())).contains(this);
        }
      }.bind(this));

      if (linkAffected) {
        return go.Link.prototype.computePoints.call(this);
      }
      // Update route for links that are being connected to a node
    } else if (toolManager.linkingTool.isActive) {
      if (toolManager.linkingTool.originalLink === this) {
        return go.Link.prototype.computePoints.call(this);
      }
      // Update route for links that are having their endpoints shifted
    } else if (linkShiftingTool.isActive) {
      if ((linkShiftingTool['_handle'].part as go.Adornment).adornedObject.part === this) {
        return go.Link.prototype.computePoints.call(this);
      }
      // Update route for links that are connected to a node which is being resized
    } else if (toolManager.resizingTool.isActive) {
      const resizingNode = toolManager.resizingTool.adornedObject.part as go.Node;

      // Check if current link is connected to the node being resized
      //  (including links to nodes within the node if it is a collapsed group)
      if (this.fromNode === resizingNode || this.toNode === resizingNode
        || (!this.fromNode.isVisible() && this.fromNode.isMemberOf(resizingNode))
        || (!this.toNode.isVisible() && this.toNode.isMemberOf(resizingNode))
      ) {
        return go.Link.prototype.computePoints.call(this);
      }
    }

    // Otherwise, leave link route as is
    return true;
  }
}

/*
This service handles any structural changes to the diagram i.e. creation of nodes/links
 and updates of their (non layout specific) properties.
*/

@Injectable()
export class DiagramStructureChangesService {
  public diagramEditable: boolean;
  // Observable to indicate that a shared copy of an existing node should be added to the group as a new member
  public addNewSharedSubItemSource = new Subject();
  public addNewSharedSubItem$ = this.addNewSharedSubItemSource.asObservable();
  // Observable to indicate that a new node should be added to the group as a new member
  public addNewSubItemSource = new Subject();
  public addNewSubItem$ = this.addNewSubItemSource.asObservable();
  // Observable to indicate that the system should be assigned to a new group
  public addSystemToGroupSource = new Subject();
  public addSystemToGroup$ = this.addSystemToGroupSource.asObservable();
  // Observable to indicate that a new child node is to be added to a node
  public addChildNodeSource = new Subject();
  public addChildNode$ = this.addChildNodeSource.asObservable();
  // Observable to indicate that a shared copy of an existing node should be made into the master
  public setAsMasterSource = new Subject();
  public setAsMaster$ = this.setAsMasterSource.asObservable();
  // Observable to indicate that the system was dropped in a group
  public setSystemGroupSource = new Subject();
  public setSystemGroup$ = this.setSystemGroupSource.asObservable();

  public onRequestNodeDelete: BehaviorSubject<any> = new BehaviorSubject(null);
  public onRequestLinkDelete: BehaviorSubject<any> = new BehaviorSubject(null);

  private currentScope: string;
  private currentNodeId: string;
  private currentMapViewSource: { id: string; isTransformation: boolean };

  workpackages = [];
  selectedWorkpackages = [];

  constructor(
    private diagramLayoutChangesService: DiagramLayoutChangesService,
    private diagramLevelService: DiagramLevelService,
    private diagramUtilitiesService: DiagramUtilitiesService,
    private store: Store<RouterReducerState<RouterStateUrl>>,
    public dialog: MatDialog,
    private workpackageStore: Store<WorkPackageState>
  ) {
    thisService = this;

    thisService.workpackageStore
      .pipe(select(getEditWorkpackages))
      .subscribe(workpackages => (this.workpackages = workpackages));
    thisService.workpackageStore
      .pipe(select(getSelectedWorkpackages))
      .subscribe(workpackages => (thisService.selectedWorkpackages = workpackages));

    thisService.store.select(getScopeQueryParams).subscribe(scope => {
      thisService.currentScope = scope;
    });

    thisService.store.select(getNodeIdQueryParams).subscribe(nodeId => {
      this.currentNodeId = nodeId;
    });

    thisService.store.select(getMapViewQueryParams).subscribe(mapViewParams => {
      this.currentMapViewSource = mapViewParams;
    });

  }

  // Add newly created nodes to the back end
  //  -event
  //    -subject: set of nodes to add to the database
  createObjects(event: go.DiagramEvent): void {
    const nodeId = thisService.currentNodeId;
    const scope = thisService.currentScope;

    const shortEditWorkpackage = {
      id: thisService.workpackages[0].id,
      name: thisService.workpackages[0].name,
      description: thisService.workpackages[0].description,
      hasErrors: thisService.workpackages[0].hasErrors,
      status: thisService.workpackages[0].status
    };

    event.subject.each((part: go.Part) => {
      // Set workpackage currently being edited as "impacted by" workpackage for the part
      event.diagram.model.setDataProperty(part.data, 'impactedByWorkPackages', [shortEditWorkpackage]);

      if ('displayId' in part.data) {
        part.data.id = part.data.displayId;
      }

      const group = event.diagram.findNodeForKey(part.data.group);

      // Only add nodes here as new links are temporary until connected
      if (part instanceof go.Node) {
        const node = Object.assign({}, part.data);
        const dialogRef = thisService.dialog.open(EditNameModalComponent, {
          disableClose: false,
          width: '500px',
          data: {
            name: node.name,
            group: group ? group.data.name : null
          }
        });

        dialogRef.afterClosed().subscribe((data: { name: string }) => {
          if (data && data.name) {
            part.data.name = data.name;
            node.name = data.name;
          } else {
            part.diagram.remove(part);
            return;
          }

          thisService.workpackages.forEach(workpackage => {
            const addWorkPackageNodeParams: any = { workpackageId: workpackage.id, scope, node };

            if (thisService.diagramLayoutChangesService.layout.id !== autoLayoutId) {
              const { nodeLayoutData, linkLayoutData } = thisService.diagramLayoutChangesService.getCurrentPartsLayoutData(event.diagram);

              addWorkPackageNodeParams.newLayoutDetails = {
                layoutId: thisService.diagramLayoutChangesService.layout.id,
                data: {
                  positionDetails: {
                    workPackages: [{ id: workpackage.id, name: workpackage.name }],
                    positions: {
                      nodes: nodeLayoutData,
                      nodeLinks: linkLayoutData
                    }
                  }
                }
              };
            }

            if (nodeId) {
              addWorkPackageNodeParams.node.parentId = nodeId;
            }

            if (data && data.name && !node.isTemporary) {
              thisService.workpackageStore.dispatch(new AddWorkPackageNode(addWorkPackageNodeParams));
            }
          });
        });
      }
    });
  }

  // Updates the properties associated with a node or link
  //  -part: part to update
  //  -data: object containing new property values to apply
  updatePartData(part: go.Part, data: any) {
    // Iterate through data to set each property against the part
    Object.keys(data).forEach(
      function(property) {
        // Do not update id or category fields as these do not change
        if (
          !['id', 'category'].includes(property) &&
          // Only update properties that appear in the part's data
          property in part.data &&
          // Do not bother to update properties that have not changed
          data[property] !== part.data[property]
        ) {
          part.diagram.model.setDataProperty(part.data, property, data[property]);
        }
      }
    );

    // Add currently editing workpackage to array of workpackages impacted by if not there already
    if (
      part.data.impactedByWorkPackages.every(
        function(workpackage) {
          return workpackage.id !== thisService.workpackages[0].id;
        }
      )
    ) {
      part.diagram.model.setDataProperty(
        part.data,
        'impactedByWorkPackages',
        part.data.impactedByWorkPackages.concat([thisService.workpackages[0]])
      );
    }

    // Update part data in backend
    if (part instanceof go.Node) {
      thisService.workpackageStore.dispatch(
        new UpdateWorkPackageNode({
          workpackageId: thisService.workpackages[0].id,
          nodeId: data.id,
          node: data
        })
      );
    } else if (part instanceof go.Link) {
      thisService.workpackageStore.dispatch(
        new UpdateWorkPackageLink({
          workpackageId: thisService.workpackages[0].id,
          linkId: data.id,
          link: data
        })
      );
    }
  }

  // Update radio count after new radio is created
  updateRadioCount(part: go.Part, category: string) {
    // Get the plural of the RADIO category
    const categoryPlural = category.replace('y', 'ie') + 's';

    // Create a copy of the current relatedRadioCounts object
    const radioCounts = Object.assign({}, part.data.relatedRadioCounts);
    // Increment the relevant count
    radioCounts[categoryPlural]++;

    // Set the relatedRadioCount property to the updated value
    part.diagram.model.setDataProperty(part.data, 'relatedRadioCounts', radioCounts);
  }

  // Update back end when a link is connected to a node
  //  -event
  //    -subject: link that has been connected
  updateLinkConnections(event: go.DiagramEvent): void {
    const draggingTool = event.diagram.toolManager.draggingTool;
    const relinkingTool = event.diagram.toolManager.relinkingTool;

    const link = event.subject;

    // Ignore disconnected links
    if (link.fromNode && link.toNode) {
      // Update link route
      link.diagram.model.setDataProperty(link.data, 'updateRoute', true);
      link.updateRoute();

      // Create link if not already in database
      if (link.data.isTemporary) {
        link.data.sourceId = link.fromNode.data.id;
        link.data.targetId = link.toNode.data.id;
        link.data.name = `${link.fromNode.data.name} - ${link.toNode.data.name}`;

        // If in map view, check if newly connected link connects to a transformation node
        if (thisService.diagramLevelService.isInMapView()) {
          if (link.fromNode.data.isTemporary) {
            thisService.createMapViewTransformationLink(link.fromNode);
          } else if (link.toNode.data.isTemporary) {
            thisService.createMapViewTransformationLink(link.toNode);
          } else {
            thisService.workpackages.forEach(workpackage => {
              thisService.workpackageStore.dispatch(
                new AddWorkPackageMapViewLink({
                  workpackageId: workpackage.id,
                  link: Object.assign({}, link.data),
                  mapViewParams: {
                    id: thisService.currentMapViewSource.id,
                    queryParams: {
                      workPackageQuery: [workpackage.id],
                      scope: thisService.currentScope,
                      isTransformation: thisService.currentMapViewSource.isTransformation
                    }
                  }
                })
              );
            });
          }
        } else {
          thisService.workpackages.forEach(workpackage => {
            let layoutDetails;
            const layout = thisService.diagramLayoutChangesService.layout;
            if (layout && layout.id !== autoLayoutId) {
              layoutDetails = {
                layoutId: layout.id,
                data: {
                  positionDetails: {
                    workPackages: [{ id: workpackage.id, name: workpackage.name }],
                    positions: {
                      nodes: [],
                      nodeLinks: [{
                        id: link.data.id,
                        positionSettings: {
                          route: link.data.route,
                          fromSpot: link.data.fromSpot,
                          toSpot: link.data.toSpot
                        }
                      }]
                    }
                  }
                }
              };
            }

            thisService.workpackageStore.dispatch(
              new AddWorkPackageLink({
                workpackageId: workpackage.id,
                link: Object.assign({}, link.data),
                newLayoutDetails: layoutDetails
              })
            );
          });

          // Flag that link now exists in the database
          link.data.isTemporary = false;
        }

        if (draggingTool.isActive) {
          draggingTool.doDeactivate();
        }
      } else {
        // Link already exists in database, therefore do update

        // Prevent process from running twice when updating both ends of a link by dragging
        if (!draggingTool.isActive && !relinkingTool.isActive) {
          return;
        }

        const updatedLink = {
          id: link.data.id,
          sourceId: link.fromNode.data.id,
          targetId: link.toNode.data.id
        };

        thisService.workpackages.forEach(workpackage => {
          thisService.workpackageStore.dispatch(
            new UpdateWorkPackageLink({
              workpackageId: workpackage.id,
              linkId: link.data.id,
              link: updatedLink
            })
          );
        });
      }
    }
  }

  // Update the array of nodes that are displayed in the diagram
  //  -diagram - the diagram to update
  //  -nodes - the array of nodes from the architecture to include
  //  -selectedWorkPackages - the array of currently selected work packages to apply node changes from
  updateNodes(diagram: any, nodes: go.Node[]) {
    if (!nodes || !Array.isArray(nodes)) {
      throw new Error('Invalid nodes type');
    }

    diagram.model.nodeDataArray = JSON.parse(JSON.stringify(nodes));

    if (diagram.layout.isValidLayout) {
      diagram.layout.isValidLayout = false;
    }
  }

  // Update the array of links that are displayed in the diagram
  //  -diagram - the diagram to update
  //  -links - the array of links from the architecture to include
  //  -selectedWorkPackages - the array of currently selected work packages to apply link changes from
  updateLinks(diagram: any, links: go.Link[], nodesIds: string[]): void {
    if (!links || !Array.isArray(links)) {
      throw new Error('Invalid links type');
    }
    if (!nodesIds || !Array.isArray(nodesIds)) {
      throw new Error('Invalid nodesIds type');
    }

    const sourceProp = diagram.model.linkFromKeyProperty;
    const targetProp = diagram.model.linkToKeyProperty;

    const linkArray = links.filter(link => nodesIds.includes(link[sourceProp]) && nodesIds.includes(link[targetProp]));

    (diagram.model as go.GraphLinksModel).linkDataArray = JSON.parse(JSON.stringify(linkArray));

    // Ensure bounds of all nodes
    //  This makes sure that links can route correctly if a reroute is necessary.
    diagram.nodes.each(function(node) {
      node.ensureBounds();
    });

    /* Check for any links that do not have a valid route between source and target nodes
       (or containing groups of the source/target nodes if the groups are collapsed).
       This can happen if the source or target nodes are moved in a work package where
       the link no longer exists.
    */
    diagram.links.each(function(link) {
      // Ignore links with no route set yet
      if (link.points.count === 0) {
        return;
      }

      // Only proceed if link is connected at both ends
      if (link.fromNode && link.toNode) {
        // If source or target node is member of a collapsed group then need to check link
        //  connects to the containing group instead.
        const fromNode = thisService.diagramUtilitiesService.getFirstVisibleGroup(link.fromNode);
        const toNode = thisService.diagramUtilitiesService.getFirstVisibleGroup(link.toNode);

        // Get bounding rectangles of the link's source and target node
        const fromArea = fromNode.port.getDocumentBounds().copy();
        const toArea = toNode.port.getDocumentBounds().copy();

        if ([fromArea.x, fromArea.y, toArea.x, toArea.y].some(isNaN)) {
          return;
        }

        // Inflate the rectangles slightly. This is necessary because the rectangle co-ordinates
        //  and link point co-ordinates are stored to a differing number of decimal places.
        fromArea.inflate(0.0000000001, 0.0000000001);
        toArea.inflate(0.0000000001, 0.0000000001);

        // Start and end points of the link
        const linkStart = link.points.first();
        const linkEnd = link.points.last();

        // Determines how far the link's ends can be from the side of the connecting node's bounding rectangle
        // before it is considered visually disconnected.
        const error_tolerance = 3.5;

        // Check link connects from a side of the source node
        const fromSideConnected =
          fromArea.containsPoint(linkStart) &&
          ['left', 'right', 'top', 'bottom'].some(function(side) {
            // Get appropriate co-ordinate for the current side
            const coOrdinateVal = side === 'left' || side === 'right' ? linkStart.x : linkStart.y;
            // Check vertical or horizontal distance between the node side and link end point
            return Math.abs(fromArea[side] - coOrdinateVal) <= error_tolerance;
          });

        // Check link connects to a side of the target node
        const toSideConnected =
          toArea.containsPoint(linkEnd) &&
          ['left', 'right', 'top', 'bottom'].some(function(side) {
            // Get appropriate co-ordinate for the current side
            const coOrdinateVal = side === 'left' || side === 'right' ? linkEnd.x : linkEnd.y;
            // Check vertical or horizontal distance between the node side and link end point
            return Math.abs(toArea[side] - coOrdinateVal) <= error_tolerance;
          });

        // Check if either end of the link not connected to a side of the corresponding node
        if (!fromSideConnected || !toSideConnected) {
          // Set link route to be recalculated
          diagram.model.setDataProperty(link.data, 'updateRoute', true);
          link.invalidateRoute();
        }
      }
    });

    thisService.diagramLevelService.groupLayoutInitial = true;

    if (diagram.layout.isValidLayout) {
      diagram.layout.isValidLayout = false;
    }
  }

  // If in node usage view, place the layer lanes around the displayed nodes
  placeNodeUsageLanes(event: go.DiagramEvent): void {
    // Only proceed if in node usage view
    if (thisService.diagramLevelService.currentLevel === Level.usage) {
      // A map to map each layer to its lane
      const lanes = new go.Map<string, go.Part>();

      // Get parts used to represent each lane
      event.diagram.parts.each(function(part) {
        if (part.category === 'lane') {
          lanes.add(part.name, part);
        }
      });

      // Variable to hold the areas that are taken up by nodes in each layer
      const areas = {
        [layers.system]: null,
        [layers.data]: null,
        [layers.dimension]: null,
        [layers.reportingConcept]: null,
        // Also include a property for the area of all nodes
        all: null
      };

      // Calculate areas taken up by nodes from each layer
      event.diagram.nodes.each(function(node) {
        // Get current area for the node's layer
        const area = areas[node.data.layer];
        const nodeBounds = node.getDocumentBounds();

        // Do not attempt to include area of nodes that are not visible
        if (!node.isVisible()) {
          return;
        }

        // If area property has not yet been set then set it equal to the node's bounds
        if (!area) {
          areas[node.data.layer] = nodeBounds.copy();
          // Otherwise, update current area for the layer to include the node's bounds
        } else {
          area.unionRect(nodeBounds);
        }

        // If area property has not yet been set then set it equal to the node's bounds
        if (!areas.all) {
          areas.all = nodeBounds.copy();
          // Otherwise, update current area to include the node's bounds
        } else {
          areas.all.unionRect(nodeBounds);
        }
      });

      // Minimum distance to leave between the edge of a lane and the nodes
      const sideMargin = 25;

      const layerOrder = [layers.system, layers.data, layers.dimension, layers.reportingConcept];

      // Adjust location and size of the lane for each layer
      layerOrder.forEach(function(layer, index) {
        const lane = lanes.get(layer);

        const currentLayerArea = areas[layer];
        // If current layer is the topmost layer then set previous layer area to null
        const priorLayerArea = index > 0 ? areas[layerOrder[index - 1]] : null;
        // If current layer is the bottommost layer then set next layer area to null
        const nextLayerArea = index < layerOrder.length - 1 ? areas[layerOrder[index + 1]] : null;

        const shape = lane.findObject('shape');

        if (currentLayerArea) {
          lane.visible = true;
          // Lane width must be wide enough to fit all of the diagram's nodes, including a margin at each side
          shape.width = areas.all.width + sideMargin * 2;

          // Lane must be tall enough to enclose its layer...
          shape.height =
            currentLayerArea.height +
            // ...plus half the distance to the previous layer (if present)...
            Math.max(0, priorLayerArea ? (currentLayerArea.top - priorLayerArea.bottom) / 2 : sideMargin) +
            // ...plus half the distance to the next layer (if present).
            Math.max(0, nextLayerArea ? (nextLayerArea.top - currentLayerArea.bottom) / 2 : sideMargin);

          lane.location = new go.Point(
            // Position the left side of all lanes to the left of the diagram's nodes
            areas.all.left - sideMargin,
            // Position the top of the lane equidistant between its layer and the previous layer (if present)
            priorLayerArea ? (priorLayerArea.bottom + currentLayerArea.top) / 2 : currentLayerArea.top - sideMargin
          );
          // If no nodes from the current layer exist in the diagram then hide lane for that layer
        } else {
          lane.visible = false;
        }
      });
    }
  }

  // Update back end with all parts necessary for a transformation
  createMapViewTransformationLink(node: go.Node): void {
    const linksIn = [];
    const linksOut = [];

    // Get links connecting a source node to a transformation node
    node.findLinksInto().each(function(link) {
      if (link.fromNode) {
        link.data.sourceId = link.fromNode.data.id;
        link.data.targetId = link.toNode.data.id;
        linksIn.push(link.data);
      }
    });

    // Get links connecting a transformation node to a target node
    node.findLinksOutOf().each(function(link) {
      if (link.toNode) {
        link.data.sourceId = link.fromNode.data.id;
        link.data.targetId = link.toNode.data.id;
        linksOut.push(link.data);
      }
    });

    // Only proceed if at least one fully attached link is connected to the transformation node in both directions
    if (linksIn.length > 0 && linksOut.length > 0) {
      const params: any = {
        workpackageId: thisService.workpackages[0].id,
        scope: thisService.currentScope,
        nodeData: node.data,
        linkData: [].concat(linksIn, linksOut),
        mapViewParams: {
          id: thisService.currentMapViewSource.id,
          queryParams: {
            workPackageQuery: [thisService.workpackages[0].id],
            scope: thisService.currentScope,
            isTransformation: thisService.currentMapViewSource.isTransformation
          }
        }
      };

      thisService.workpackageStore.dispatch(new AddWorkPackageMapViewTransformation(params));
    }
  }

  // Update guide with instructions for current diagram state
  updateGuide(diagram: go.Diagram): void {

    let guide;
    diagram.parts.each(function(part: go.Part): void {
      if (part.name === 'Guide') {
        guide = part;
      }
    });

    if (!guide) {
      throw new Error('Guide missing');
    }

    guide.visible = diagram.nodes.count + diagram.nodes.count === 0;

    const instructions = guide.findObject('instructions');

    if (thisService.currentScope === defaultScopeId) {
      if (thisService.selectedWorkpackages.length === 0) {
        instructions.text = 'Your topology is empty. Select or create a work package to get started.';
      } else if (thisService.selectedWorkpackages.length === 1) {
        if (thisService.diagramEditable) {
          instructions.text = 'Go to edit pane and start dragging and dropping objects';
        } else {
          instructions.text = 'Your work package is empty. Enter edit mode to start documenting your topology';
        }
      }
    } else {
      if (thisService.currentNodeId) {
        instructions.text = 'No detail to display. Start documenting or click back button to go to previous view.';
      } else {
        instructions.text =
          'There is no detail to display. Review scope definition or start documenting with a work package';
      }
    }

    // Ensure instructions do not exceed screen space available
    instructions.width = Math.max(100, diagram.viewportBounds.width - 10);
  }
}