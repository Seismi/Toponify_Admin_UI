import { Injectable } from '@angular/core';
import {linkCategories, LinkLayoutSettingsEntity, NodeLink} from '@app/architecture/store/models/node-link.model';
import {
  AddWorkPackageLink,
  AddWorkPackageMapViewLink,
  UpdateWorkPackageLink
} from '@app/workpackage/store/actions/workpackage-link.actions';
import { AddWorkPackageNode, UpdateWorkPackageNode } from '@app/workpackage/store/actions/workpackage-node.actions';
import { getEditWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
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
import { take } from 'rxjs/operators';
import {endPointTypes, layers, nodeCategories, NodeLayoutSettingsEntity} from '@app/architecture/store/models/node.model';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import {getLayoutSelected} from '@app/layout/store/selectors/layout.selector';
import {AddWorkPackageMapViewTransformation} from '@app/workpackage/store/actions/workpackage.actions';
import {autoLayoutId} from '@app/architecture/store/models/layout.model';

const $ = go.GraphObject.make;

@Injectable()
export class DiagramChangesService {
  public onUpdatePosition: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateExpandState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateGroupsAreaState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateDiagramLayout: BehaviorSubject<any> = new BehaviorSubject(null);
  private currentLevel: Level;
  private currentScope: string;
  private currentNodeId: string;
  private currentMapViewSource: { id: string, isTransformation: boolean };
  public dependenciesView = false;

  workpackages = [];
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
    this.layoutStore
      .pipe(select(getLayoutSelected))
      .subscribe(layout => (this.layout = layout));
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

  // Add newly created nodes to the back end
  //  -event
  //    -subject: set of nodes to add to the database
  createObjects(event: go.DiagramEvent): void {
    const nodeId = this.currentNodeId;
    const scope = this.currentScope;

    const shortEditWorkpackage = {
      id: this.workpackages[0].id,
      name: this.workpackages[0].name,
      description: this.workpackages[0].description,
      hasErrors: this.workpackages[0].hasErrors,
      status: this.workpackages[0].status
    };

    event.subject.each((part: go.Part) => {
      // Set workpackage currently being edited as "impacted by" workpackage for the part
      event.diagram.model.setDataProperty(part.data, 'impactedByWorkPackages', [shortEditWorkpackage]);

      if ('displayId' in part.data) {
        part.data.id = part.data.displayId;
      }

      // Only add nodes here as new links are temporary until connected
      if (part instanceof go.Node) {
        const node = Object.assign({}, part.data);
        const dialogRef = this.dialog.open(EditNameModalComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            name: node.name
          }
        });

        dialogRef.afterClosed().subscribe((data: { name: string }) => {
          if (data && data.name) {
            part.data.name = data.name;
            node.name = data.name;
          }

          this.workpackages.forEach(workpackage => {

            const addWorkPackageNodeParams: any = { workpackageId: workpackage.id, scope, node};

            if (this.layout.id !== autoLayoutId) {

              const { nodeLayoutData, linkLayoutData } = this.getCurrentPartsLayoutData(event.diagram);

              addWorkPackageNodeParams.newLayoutDetails = {
                layoutId: this.layout.id,
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

            if (!node.isTemporary) {
              this.workpackageStore.dispatch(
                new AddWorkPackageNode(addWorkPackageNodeParams)
              );
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
      }.bind(this)
    );

    // Add currently editing workpackage to array of workpackages impacted by if not there already
    if (
      part.data.impactedByWorkPackages.every(
        function(workpackage) {
          return workpackage.id !== this.workpackages[0].id;
        }.bind(this)
      )
    ) {
      part.diagram.model.setDataProperty(
        part.data,
        'impactedByWorkPackages',
        part.data.impactedByWorkPackages.concat([this.workpackages[0]])
      );
    }

    // Update part data in backend
    if (part instanceof go.Node) {
      this.workpackageStore.dispatch(
        new UpdateWorkPackageNode({
          workpackageId: this.workpackages[0].id,
          nodeId: data.id,
          node: data
        })
      );
    } else if (part instanceof go.Link) {
      this.workpackageStore.dispatch(
        new UpdateWorkPackageLink({
          workpackageId: this.workpackages[0].id,
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

  // Update position of links or nodes in the back end
  //  -event
  //    -subject: set of parts to update the positions of
  updatePosition(event: any): void {
    // Do not update positions for map view
    if (this.currentLevel.endsWith('map')) {
      return;
    }

    // Set to contain all parts to update
    const partsToUpdate = new go.Set();

    // Moving a node will affect the positions of grouped nodes
    //  and any connected links. Therefore, add these to set of
    //  parts to update.
    event.subject.each(function(part: go.Part) {
      partsToUpdate.add(part);

      // If moved part is a node, include connected links
      if (part instanceof go.Node) {
        partsToUpdate.addAll(part.linksConnected);
      }

      // If moved part is a group, include grouped parts and any links connected to grouped nodes
      if (part instanceof go.Group) {
        const subParts = part.findSubGraphParts();
        partsToUpdate.addAll(part.findSubGraphParts().iterator);

        subParts.each(function(subPart: go.Part): void {
          if (subPart instanceof go.Node) {
            partsToUpdate.addAll((subPart as go.Node).linksConnected);
          }
        });
      }
    });

    // Also fix position of any node that has no position currently defined.
    event.diagram.nodes.each(function(node: go.Node) {
      if (node.data && node.data.locationMissing) {
        partsToUpdate.add(node);
      }
    });

    const links: any[] = [];
    const nodes: any[] = [];
    // Update position of each part
    partsToUpdate.each(
      function(part: go.Part) {
        if (part instanceof go.Link) {
          // Ignore disconnected links
          if (part.fromNode && part.toNode) {
            links.push({ id: part.key,
              points: part.data.route,
              fromSpot: part.data.fromSpot,
              toSpot: part.data.toSpot
            });
          }
        } else {
          // Part is a node
          nodes.push({ id: part.key, locationCoordinates: part.data.location });
        }
      }.bind(this)
    );

    this.onUpdatePosition.next({
      nodes: nodes,
      links: links
    });

    this.onUpdateDiagramLayout.next({});
  }

  // Update diagram when display options have been changed
  updateDisplayOptions(event: any, option: string, diagram: go.Diagram): void {

    // If option to show master data links disabled then deselect any master data links
    if (option === 'masterDataLinks' && !event.checked) {
      diagram.selection.each(function(part) {
        if (part instanceof go.Link && part.category === linkCategories.masterData) {
          part.isSelected = false;
        }
      });
    }

    // Redo layout for node usage view after updating display options
    if (this.currentLevel === Level.usage) {
      diagram.layout.isValidLayout = false;
    } else {
      // Update the route of links after display change
      diagram.links.each(
        function(link) {
          // Set data property to indicate that link route should be updated
          diagram.model.setDataProperty(link.data, 'updateRoute', true);
          link.updateRoute();
        }.bind(this)
      );
    }
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
        if (this.currentLevel.endsWith('map')) {
          if (link.fromNode.data.isTemporary) {
            this.createMapViewTransformationLink(link.fromNode);
          } else if (link.toNode.data.isTemporary) {
            this.createMapViewTransformationLink(link.toNode);
          } else {
            this.workpackages.forEach(workpackage => {
              this.workpackageStore.dispatch(
                new AddWorkPackageMapViewLink({
                  workpackageId: workpackage.id,
                  link: Object.assign({}, link.data),
                  mapViewParams: {
                    id: this.currentMapViewSource.id,
                    queryParams: {
                      workPackageQuery: [workpackage.id],
                      scope: this.currentScope,
                      isTransformation: this.currentMapViewSource.isTransformation
                    }
                  }
                })
              );
            });
          }
        } else {
          this.workpackages.forEach(workpackage => {
            this.workpackageStore.dispatch(
              new AddWorkPackageLink({
                workpackageId: workpackage.id,
                link: Object.assign({}, link.data)
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

        this.workpackages.forEach(workpackage => {
          this.workpackageStore.dispatch(
            new UpdateWorkPackageLink({
              workpackageId: workpackage.id,
              linkId: link.data.id,
              link: updatedLink
            })
          );
        });
      }

      /* When a link is newly connected between two nodes, other links between the same two nodes are
         rerouted. Therefore, these links must have their routes updated in the back end. */

      // Create set of links going between the same two nodes as the updated link
      const neighbourLinks = new go.Set();
      neighbourLinks.addAll(link.fromNode.findLinksBetween(link.toNode));
      // Do not include the reconnected link
      neighbourLinks.remove(link);

      // Gojs does not normally calculate the new routes until later.
      //  Therefore, make Gojs update the routes now so that accurate
      //  routes can be added to the back end.
      neighbourLinks.each(function(NLink: go.Link) {
        NLink.invalidateRoute();
        NLink.updateRoute();
      });

      // Update position of neighbouring links in back end
      this.updatePosition({ subject: neighbourLinks, diagram: link.diagram });
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

    const selectedPartKey: string | null = diagram.selection.count === 1 ? diagram.selection.first().key : null;

    diagram.model.nodeDataArray = JSON.parse(JSON.stringify(nodes));

    if (diagram.layout.isValidLayout) {
      diagram.layout.isValidLayout = false;
    }

    if (selectedPartKey) {
      diagram.select(diagram.findPartForKey(selectedPartKey));
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

    const selectedPartKey: string | null = diagram.selection.count === 1 ? diagram.selection.first().key : null;

    const sourceProp = diagram.model.linkFromKeyProperty;
    const targetProp = diagram.model.linkToKeyProperty;

    const linkArray = links.filter(link => nodesIds.includes(link[sourceProp]) && nodesIds.includes(link[targetProp]));

    (diagram.model as go.GraphLinksModel).linkDataArray = JSON.parse(JSON.stringify(linkArray));

    if (selectedPartKey) {
      diagram.select(diagram.findPartForKey(selectedPartKey));
    }

    // Ensure bounds of all nodes with any connected links.
    //  This makes sure that links can route correctly if a reroute is necessary.
    diagram.nodes.each(function(node) {
      if (node.linksConnected.count > 0) {
        node.ensureBounds();
      }
    });

    /* Check for any links that do not have a valid route between source and target nodes.
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
        // Get bounding rectangles of the link's source and target node
        const fromArea = link.fromNode.actualBounds.copy();
        const toArea = link.toNode.actualBounds.copy();

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

    this.diagramLevelService.groupLayoutInitial = true;

    if (diagram.layout.isValidLayout) {
      diagram.layout.isValidLayout = false;
    }
  }

  linkingValidation(
    fromnode: go.Node,
    fromport: go.GraphObject,
    tonode: go.Node,
    toport: go.GraphObject,
    oldlink: go.Link
  ): boolean {

    // Ensure that links in map view go in the right direction
    if (this.currentLevel.endsWith('map')) {
      if (fromnode &&
        fromnode.containingGroup &&
        fromnode.containingGroup.data.endPointType !== endPointTypes.source) {
        return false;
      }
      if (tonode &&
        tonode.containingGroup &&
        tonode.containingGroup.data.endPointType !== endPointTypes.target) {
        return false;
      }
    }

    // Only validate links that are connected at both ends
    if (!fromnode || !tonode) {
      return true;
    }

    // Prevent links between two transformation nodes
    if (fromnode.data.category === nodeCategories.transformation
      && tonode.data.category === nodeCategories.transformation) {
      return false;
    }

    // Prevent links to transformation node in more than one direction
    if (fromnode.data.category === nodeCategories.transformation
      || tonode.data.category === nodeCategories.transformation) {
      const allLinks = tonode.findLinksTo(fromnode);
      if (allLinks.count > 0) {
        return false;
      }
    }

    // Prevent links between equivalent nodes in map view
    if (this.currentLevel.endsWith('map')) {
      if (fromnode.data.id === tonode.data.id) {
        return false;
      }
    }

    return true;
  }

  // Hide all nodes except the specified node and all nodes directly linked to it
  hideNonDependencies(depNode: go.Node): void {
    depNode.diagram.startTransaction('Analyse Dependencies');

    // Highlight specified node with a thicker blue shadow
    this.setBlueShadowHighlight(depNode, true);

    const nodesToStayVisible = this.getNodesToShowDependencies(depNode);

    if (nodesToStayVisible) {
      this.dependenciesView = true;
    }

    // Hide all non-directly-dependent nodes
    depNode.diagram.nodes.each(function(node) {
      if (!nodesToStayVisible.has(node)) {
        node.visible = false;
      }
    });

    // Update bindings so that the appropriate nodes show the button to expand dependency levels shown
    depNode.diagram.nodes.each(function(node) {
      if (node.visible) {
        node.updateTargetBindings();
      }
    });

    depNode.diagram.commitTransaction('Analyse Dependencies');

    // Centre diagram view on the specified node
    depNode.diagram.centerRect(depNode.actualBounds);
  }

  // Show all nodes that are directly linked to the specified node
  showDependencies(depNode: go.Node): void {
    depNode.diagram.startTransaction('Show Dependencies');

    const nodesToShow = this.getNodesToShowDependencies(depNode);

    nodesToShow.each(function(node) {
      node.visible = true;
    });

    // Update bindings so that the appropriate nodes show the button to expand dependency levels shown
    depNode.diagram.nodes.each(function(node) {
      if (node.visible) {
        node.updateTargetBindings();
      }
    });

    depNode.diagram.commitTransaction('Show Dependencies');
  }

  // Get a set of all nodes that need to be visible to show dependencies from the given input node
  getNodesToShowDependencies(depNode: go.Node): go.Set<go.Part> {

    // Get direct dependencies
    const dependencies = new go.Set<go.Part>([depNode]);
    dependencies.addAll(depNode.findNodesConnected());

    // Get any top-level groups containing the direct dependencies
    const groups = new go.Set<go.Group>();
    dependencies.each(function(node) {
      const topPart = node.findTopLevelPart();
      if (topPart instanceof go.Group) {
        groups.add(topPart);
      }
    });

    // Get all members of the groups containing direct dependencies
    const members = new go.Set<go.Part>();
    groups.each(function(group) {
      members.addAll(group.findSubGraphParts());
    });

    return new go.Set<go.Part>(dependencies)
      .addAll(groups).addAll(members);
  }

  // Set all nodes in the specified diagram to visible
  showAllNodes(diagram: go.Diagram): void {
    diagram.startTransaction('Show All Nodes');

    // Set all nodes to visible and reset shadow
    diagram.nodes.each(function(node) {
      node.visible = true;
      this.setBlueShadowHighlight(node, false);
    }.bind(this));

    this.dependenciesView = false;

    // Update bindings so that nodes no longer show the button to expand dependency levels
    diagram.nodes.each(function(node) {
      node.updateTargetBindings();
    });

    diagram.commitTransaction('Show All Nodes');
  }

  // Rerun the diagram's layout for all nodes and links
  reorganise(diagram) {
    diagram.startTransaction('Clear set positions');
    diagram.nodes.each(function(node) {
      diagram.model.setDataProperty(node.data, 'locationMissing', true);
    });
    diagram.links.each(function(link) {
      diagram.model.setDataProperty(link.data, 'routeMissing', true);
    });
    diagram.commitTransaction('Clear set positions');
    diagram.layout.isValidLayout = false;
  }

  // Rerun the diagram's links
  reorganiseLinks(diagram) {
    diagram.links.each(link => {
      diagram.model.setDataProperty(link.data, 'updateRoute', true);
      link.invalidateRoute();
    });
  }

  nodeExpandChanged(node) {
    const linkData: { id: string; points: number[], fromSpot: string, toSpot: string }[] = [];

    // Make sure node bounds are up to date so links can route correctly
    node.ensureBounds();

    // Expanding/collapsing node sections changes node size, therefore link routes may need updating
    node.linksConnected.each(function(link: go.Link): void {
      // ignore disconnected links
      if (link.toNode && link.fromNode) {
        node.diagram.model.setDataProperty(link.data, 'updateRoute', true);
        link.invalidateRoute();
        link.updateRoute();

        linkData.push({ id: link.data.id,
          points: link.data.route,
          fromSpot: link.data.fromSpot,
          toSpot: link.data.toSpot
        });
      }
    });

    if ([Level.systemMap, Level.dataMap, Level.dimensionMap, Level.usage].includes(this.currentLevel)) {
      this.groupMemberSizeChanged(node);
      // Update node's layout in map view or usage view
      node.findTopLevelPart().invalidateLayout();
    } else {

      this.groupMemberSizeChanged(node);

      // Update expanded status of node in the back end
      this.onUpdateExpandState.next({
        node: {
          id: node.data.id,
          middleExpanded: node.data.middleExpanded,
          bottomExpanded: node.data.bottomExpanded
        },
        links: linkData
      });

      this.onUpdateDiagramLayout.next({});
    }
  }

  // Ensure group members and any connected links are positioned correctly
  //  when a system/data group is expanded
  groupSubGraphExpandChanged(group: go.Group): void {

    if (group.isSubGraphExpanded) {

      // Run group layout to ensure member nodes are in the correct positions
      group.layout.isValidLayout = false;
      group.layout.invalidateLayout();

      // Ensure visibility of group member area and group size are up to date
      group.updateTargetBindings('middleExpanded');
      group.ensureBounds();

      const memberArea = group.findObject('Group member area');
      const memberBounds = memberArea.getDocumentBounds().copy();

      group.findSubGraphParts()
        .each(
          function (part: go.Part): void {
            if (part instanceof go.Node) {

              // If member is located outside of the group and is not automatically laid out then reposition member
              if (!memberBounds.containsRect(part.actualBounds) && !part.canLayout()) {

                const newLocation = new go.Point();

                // Place member underneath all correctly positioned members,
                //  centre aligned and separated by a small gap
                newLocation.x = memberBounds.centerX;
                newLocation.y = memberBounds.bottom + 12;

                // Update the area required to contain the members
                memberBounds.height = memberBounds.height + part.actualBounds.height + 12;
                memberBounds.width = Math.max(memberBounds.width, part.actualBounds.width);

                part.move(newLocation, true);
              } else {
                /*
                  For nodes that are already located in the group, change member node location back and
                  forth between the current location and another point.
                  This is to force GoJS to update the position of the node, as this does not appear to be
                  done correctly when the parent group is moved.
                */
                const location = part.location.copy();
                part.move(location.copy().offset(1, 1));
                part.move(location, true);
              }
              // Try to ensure that each part has correct bounds after being moved
              part.ensureBounds();
            }
          }
        );

      // Set height and width of group member area to match the area previously
      //  calculated as necessary to enclose the members.
      group.findObject('Group member area').height = memberBounds.height;
      group.findObject('Group member area').width = memberBounds.width;
    } else {
      // If group collapsed, just ensure bounds are correct
      group.ensureBounds();
    }

    // Set of links that may need rerouting after subgraph expanded/collapsed
    const linksToReroute = new go.Set();

    // Get any links that may need rerouting
    group.findSubGraphParts()
      .each(
        function(part: go.Part): void {
          if (part instanceof go.Node) {
            // Add links connected to member to set of links to be rerouted
            linksToReroute.addAll(part.linksConnected);
          }
        }
      );

    // Reroute all necessary links
    linksToReroute.each(function (link: go.Link): void {
      link.data = Object.assign(link.data, {updateRoute: true});
      link.invalidateRoute();
      link.updateRoute();
    });
  }

  groupAreaChanged(event: go.DiagramEvent): void {
    const linkData: { id: string; points: number[], fromSpot: string, toSpot: string }[] = [];
    const node = event.subject.part;

    // Make sure node bounds are up to date so links can route correctly
    node.ensureBounds();

    // Changing group area changes node size, therefore link routes may need updating
    node.linksConnected.each(function(link: go.Link): void {
      // ignore disconnected links
      if (link.toNode && link.fromNode) {
        node.diagram.model.setDataProperty(link.data, 'updateRoute', true);
        link.invalidateRoute();
        link.updateRoute();

        linkData.push({ id: link.data.id,
          points: link.data.route,
          fromSpot: link.data.fromSpot,
          toSpot: link.data.toSpot
        });
      }
    });

    if (this.currentLevel === Level.usage) {
      // Update node's layout in usage view
      node.findTopLevelPart().invalidateLayout();
    }

    // Update group area of node in the back end
    this.onUpdateGroupsAreaState.next({
      groups: [{
        id: node.data.id,
        areaSize: node.data.areaSize,
        locationCoordinates: node.data.location
      }],
      links: linkData
    });

    this.groupMemberSizeChanged(node);
  }

  // Ensures that all groups that have the given member as part of
  //  their subgraph are large enough to enclose the member
  groupMemberSizeChanged(member: go.Node): void {
    const nestedGroups = new go.Set();
    const linksToUpdate = new go.Set();

    let currentGroup = member;
    let currentMinBounds = member.getDocumentBounds().copy();

    // Loop through containing groups until reaching a top level group,
    //  ensuring each is big enough
    while (currentGroup.containingGroup !== null) {
      currentGroup = currentGroup.containingGroup;

      const memberArea = currentGroup.findObject('Group member area');
      const memberBounds = memberArea.getDocumentBounds().copy();

      // If currently considered group is already large enough then exit loop
      if (memberBounds.containsRect(currentMinBounds)) {
        break;
      }

      // Add the current group and any connected links to the sets of parts to update in the back end
      nestedGroups.add(currentGroup);
      linksToUpdate.addAll(currentGroup.linksConnected);

      // Expand minimum required area to include current group member area
      currentMinBounds = currentMinBounds.unionRect(memberBounds);

      // Expand group member area width and height to ensure it is large enough to enclose all group members
      memberArea.height = Math.max(currentMinBounds.bottom - memberBounds.top, memberArea.height);
      memberArea.width = Math.max(memberBounds.right, currentMinBounds.right)
        - Math.min(memberBounds.left, currentMinBounds.left);

      // Shift group horizontally in order to ensure group member area correctly encloses required bounds
      currentGroup.location = new go.Point(currentMinBounds.centerX, currentGroup.location.y);

      // For next iteration, set minimum bounds equal to new bounds of current group
      currentGroup.ensureBounds();
      currentMinBounds = currentGroup.getDocumentBounds().copy();
    }

    const linkData = [];

    // Update routes of any links connected to any of the resized groups
    linksToUpdate.each(function(link: go.Link) {
      // ignore disconnected links
      if (link.toNode && link.fromNode) {
        link.diagram.model.setDataProperty(link.data, 'updateRoute', true);
        link.invalidateRoute();
        link.updateRoute();

        linkData.push({ id: link.data.id,
          points: link.data.route,
          fromSpot: link.data.fromSpot,
          toSpot: link.data.toSpot
        });
      }
    });

    // Construct array of group size/location data
    const groupData = [];
    nestedGroups.each(function(group: go.Group) {
      groupData.push({
        id: group.data.id,
        areaSize: group.data.areaSize,
        locationCoordinates: group.data.location
      });
    });

    // Update back end with new layout info for updated groups and links
    this.onUpdateGroupsAreaState.next({
      groups: groupData,
      links: linkData
    });

    if (this.currentLevel === Level.usage) {
      // Update node's layout in usage view
      member.invalidateLayout();
    }

    this.onUpdateDiagramLayout.next({});

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

  // Expands the currently viewed area of the diagram to include the given menu
  updateViewAreaForMenu(menu: go.Adornment) {
    const diagram = menu.diagram;

    menu.ensureBounds();
    // Expand diagram area to include the menu
    diagram.documentBounds.unionRect(menu.actualBounds);
    // Calculate new view area based on current view area and menu bounds
    const updatedViewArea = diagram.viewportBounds.copy().unionRect(menu.actualBounds);
    // Scroll screen to calculated view area
    diagram.scrollToRect(updatedViewArea);
  }

  // Get current layout data for all parts in the diagram
  getCurrentPartsLayoutData(diagram: go.Diagram): {
    nodeLayoutData: NodeLayoutSettingsEntity['layout'][],
    linkLayoutData: LinkLayoutSettingsEntity['layout'][]
  } {

    const nodeLayoutData = diagram.model.nodeDataArray.map(function(node) {
      return {
        id: node.id,
        positionSettings: {
          locationCoordinates: node.location,
          middleExpanded: node.middleExpanded,
          bottomExpanded: node.bottomExpanded,
          areaSize: node.areaSize
        }
      };
    });

    const linkLayoutData = (diagram.model as go.GraphLinksModel).linkDataArray.map(function(link) {
      return {
        id: link.id,
        positionSettings: {
          route: link.route,
          fromSpot: link.fromSpot,
          toSpot: link.toSpot
        }
      };
    });

    return { nodeLayoutData, linkLayoutData };
  }

  // If in node usage view, place the layer lanes around the displayed nodes
  placeNodeUsageLanes(event: go.DiagramEvent): void {

    // Only proceed if in node usage view
    if (this.currentLevel === Level.usage) {

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
          shape.height = currentLayerArea.height
            // ...plus half the distance to the previous layer (if present)...
            + Math.max(0, (priorLayerArea ? (currentLayerArea.top - priorLayerArea.bottom) / 2 : sideMargin))
            // ...plus half the distance to the next layer (if present).
            + Math.max(0, (nextLayerArea ? (nextLayerArea.top - currentLayerArea.bottom) / 2 : sideMargin));

          lane.location = new go.Point(
            // Position the left side of all lanes to the left of the diagram's nodes
            areas.all.left - sideMargin,
            // Position the top of the lane equidistant between its layer and the previous layer (if present)
            (priorLayerArea ? (priorLayerArea.bottom + currentLayerArea.top) / 2 : currentLayerArea.top - sideMargin)
          );
          // If no nodes from the current layer exist in the diagram then hide lane for that layer
        } else {
          lane.visible = false;
        }
      });
    }
  }

  setBlueShadowHighlight(node: go.Node, highlight: boolean): void {
    node.shadowColor = highlight ? 'blue' : 'gray';
    node.shadowBlur = highlight ? 18 : 4;
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
        workpackageId: this.workpackages[0].id,
        scope: this.currentScope,
        nodeData: node.data,
        linkData: [].concat(linksIn, linksOut),
        mapViewParams: {
          id: this.currentMapViewSource.id,
          queryParams: {
            workPackageQuery: [this.workpackages[0].id],
            scope: this.currentScope,
            isTransformation: this.currentMapViewSource.isTransformation
          }
        }
      };

      this.workpackageStore.dispatch(new AddWorkPackageMapViewTransformation(params));
    }
  }

  // Check for any other nodes already occupying a given space
  isUnoccupied(rectangle: go.Rect, node: go.Node): boolean {
    const diagram = node.diagram;

    // nested function used by Layer.findObjectsIn, below
    // only consider Parts, and ignore the given Node, any Links, and Group members
    function navigate(obj: go.GraphObject): go.Part {
      const part = obj.part;
      if (part === node) { return null; }
      if (part instanceof go.Link) { return null; }
      if (part.isMemberOf(node)) { return null; }
      if (node.isMemberOf(part)) { return null; }
      return part;
    }

    // only consider non-temporary Layers
    const diagramLayers = diagram.layers;
    while (diagramLayers.next()) {
      const layer = diagramLayers.value;
      if (layer.isTemporary) { continue; }
      if (layer.findObjectsIn(rectangle, navigate, null, true).count > 0) { return false; }
    }
    return true;
  }
}
