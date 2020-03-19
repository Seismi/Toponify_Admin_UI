import { Injectable } from '@angular/core';
import { linkCategories } from '@app/architecture/store/models/node-link.model';
import { AddWorkPackageLink, UpdateWorkPackageLink } from '@app/workpackage/store/actions/workpackage-link.actions';
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
import { getFilterLevelQueryParams, getQueryParams } from '@app/core/store/selectors/route.selectors';
import { take } from 'rxjs/operators';
import {nodeCategories} from '@app/architecture/store/models/node.model';

const $ = go.GraphObject.make;

@Injectable()
export class DiagramChangesService {
  public onUpdatePosition: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateExpandState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateGroupsAreaState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateDiagramLayout: BehaviorSubject<any> = new BehaviorSubject(null);
  private currentLevel: Level;

  workpackages = [];

  constructor(
    public diagramLevelService: DiagramLevelService,
    private store: Store<RouterReducerState<RouterStateUrl>>,
    public dialog: MatDialog,
    private workpackageStore: Store<WorkPackageState>
  ) {
    this.workpackageStore
      .pipe(select(getEditWorkpackages))
      .subscribe(workpackages => (this.workpackages = workpackages));
    this.store.select(getFilterLevelQueryParams).subscribe(level => (this.currentLevel = level));
  }

  // Add newly created nodes to the back end
  //  -event
  //    -subject: set of nodes to add to the database
  createObjects(event: go.DiagramEvent): void {
    this.store
      .select(getQueryParams)
      .pipe(take(1))
      .subscribe(params => {
        const { id: nodeId, scope } = params;

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

          // Only add nodes here as new links are temporary until connected
          if (part instanceof go.Node) {
            const node = Object.assign({}, part.data);
            node.location = [{ view: 'Default', locationCoordinates: part.data.location }];
            const dialogRef = this.dialog.open(EditNameModalComponent, {
              disableClose: false,
              width: 'auto',
              data: {
                name: node.name
              }
            });

            dialogRef.afterClosed().subscribe((data: { name: string }) => {
              if (data && data.name) {
                node.name = data.name;
              }
              this.workpackages.forEach(workpackage => {
                if (nodeId) {
                  this.workpackageStore.dispatch(
                    new AddWorkPackageNode({
                      workpackageId: workpackage.id,
                      node: {
                        ...node,
                        parentId: nodeId
                      },
                      scope
                    })
                  );
                } else {
                  this.workpackageStore.dispatch(
                    new AddWorkPackageNode({ workpackageId: workpackage.id, node, scope })
                  );
                }
              });
            });
          } else {
            if ('displayId' in part.data) {
              part.data.id = part.data.displayId;
            }
          }
        });
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
    const model = diagram.model;
    model.setDataProperty(model.modelData, option, event.checked);

    // If option to show data links disabled then deselect any data links
    if (option === 'dataLinks' && !event.checked) {
      diagram.selection.each(function(part) {
        if (part instanceof go.Link && part.category === linkCategories.data) {
          part.isSelected = false;
        }
      });
    }

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
        // Create copy of link data
        const newLink = Object.assign({}, link.data);

        newLink.sourceId = link.fromNode.data.id;
        newLink.targetId = link.toNode.data.id;
        newLink.name = `${link.fromNode.data.name} - ${link.toNode.data.name}`;

        this.workpackages.forEach(workpackage => {
          this.workpackageStore.dispatch(
            new AddWorkPackageLink({
              workpackageId: workpackage.id,
              link: newLink
            })
          );
        });

        // Flag that link now exists in the database
        link.data.isTemporary = false;

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
    // Only validate links that are connected at both ends
    if (!fromnode || !tonode) {
      return true;
    }

    // If both nodes linked are from a group, then ensure the nodes are not part of the same group
    if (fromnode.containingGroup && tonode.containingGroup) {
      if (fromnode.containingGroup.key === tonode.containingGroup.key) {
        return false;
      }
    }

    // When connecting links via drag and drop, the oldlink parameter is not passed.
    // Therefore, set the value of this parameter here in this case.
    if (!oldlink) {
      const draggingTool = fromnode.diagram.toolManager.draggingTool;

      // Copy of a link being created
      if (draggingTool.copiedParts) {
        oldlink = draggingTool.copiedParts.first().key as go.Link;
      } else {
        // Link being moved
        oldlink = draggingTool.draggedParts.first().key as go.Link;
      }
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

    // Only validate master data links
    if (oldlink.category === linkCategories.masterData) {
      // Prevent multiple master data links between the same pair of nodes
      const allLinks = fromnode.findLinksBetween(tonode);
      return !allLinks.any(function(link) {
        return (
          link.data.category === linkCategories.masterData &&
          // Don't count current link when checking if master data links already exist
          oldlink.data.id !== link.data.id
        );
      });
    }

    return true;
  }

  // Hide all nodes except the specified node and all nodes directly linked to it
  hideNonDependencies(depNode: go.Node): void {
    depNode.diagram.startTransaction('Analyse Dependencies');

    // Get direct dependencies
    const dependencies = [depNode.key];
    depNode.findNodesConnected().each(function(connectedNode) {
      dependencies.push(connectedNode.key);
    });

    // Hide all non-directly-dependent nodes
    depNode.diagram.nodes.each(function(node) {
      if (!dependencies.includes(node.key)) {
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

    // Get linked nodes and ensure they are visible
    depNode.findNodesConnected().each(function(connectedNode) {
      connectedNode.visible = true;
    });

    // Update bindings so that the appropriate nodes show the button to expand dependency levels shown
    depNode.diagram.nodes.each(function(node) {
      if (node.visible) {
        node.updateTargetBindings();
      }
    });

    depNode.diagram.commitTransaction('Show Dependencies');
  }

  // Set all nodes in the specified diagram to visible
  showAllNodes(diagram: go.Diagram): void {
    diagram.startTransaction('Show All Nodes');

    // Set all nodes to visible
    diagram.nodes.each(function(node) {
      node.visible = true;
    });

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

    // Placeholder - update all node and link positions in back end for current layout
    // Needs store update before implementation
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

    this.groupMemberSizeChanged(node);

    if (this.currentLevel.endsWith('map')) {
      // Update node's group layout in map view
      node.invalidateLayout();
    } else {
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
  //  when a system group is expanded
  systemSubGraphExpandChanged(group: go.Group): void {

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
                  For nodes that are already located in the group, change member system location back and
                  forth between the current location and another point.
                  This is to force GoJS to update the position of the system, as this does not appear to be
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
}
