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

const $ = go.GraphObject.make;

@Injectable()
export class DiagramChangesService {
  public onUpdatePosition: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateExpandState: BehaviorSubject<any> = new BehaviorSubject(null);
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

    // Moving a node will affect the positions of connected links.
    //  Therefore, add any connected links to set of parts to update.
    event.subject.each(function(part: go.Part) {
      partsToUpdate.add(part);

      if (part instanceof go.Node) {
        partsToUpdate.addAll(part.linksConnected);
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
            links.push({ id: part.key, points: part.data.route });
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

      // TEMPORARY - condition to prevent error while impactedByWorkPackages missing from nodeLink components response
      if (!this.currentLevel.endsWith('map')) {
        // Add currently editing workpackage to array of workpackages impacted by if not there already
        if (
          link.data.impactedByWorkPackages.every(
            function(workpackage) {
              return workpackage.id !== this.workpackages[0].id;
            }.bind(this)
          )
        ) {
          link.diagram.model.setDataProperty(
            link.data,
            'impactedByWorkPackages',
            link.data.impactedByWorkPackages.concat([this.workpackages[0]])
          );
        }
      }

      // Create link if not already in database
      if (link.data.isTemporary) {
        // Create copy of link data
        const newLink = Object.assign({}, link.data);

        newLink.sourceId = link.fromNode.data.id;
        newLink.targetId = link.toNode.data.id;

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

  nodeExpandChanged(node) {
    const linkData: { id: string; points: number[] }[] = [];

    // Make sure node bounds are up to date so links can route correctly
    node.ensureBounds();

    // Expanding/collapsing node sections changes node size, therefore link routes may need updating
    node.linksConnected.each(function(link: go.Link): void {
      // ignore disconnected links
      if (link.toNode && link.fromNode) {
        node.diagram.model.setDataProperty(link.data, 'updateRoute', true);
        link.invalidateRoute();
        link.updateRoute();

        linkData.push({ id: link.data.id, points: link.data.route });
      }
    });

    if (this.currentLevel.endsWith('map')) {
      // Update node's group layout in map view
      node.invalidateLayout();
    } else {
      // Update expanded status of node in the back end
      // -Temporarily removed pending API updates-
      /* this.onUpdateExpandState.next({
        node: {
          id: node.data.id,
          middleExpanded: node.data.middleExpanded,
          bottomExpanded: node.data.bottomExpanded
        },
        links: linkData
      }); */
    }
  }

  // Ensure group members and any connected links are positioned correctly
  //  when a system group is expanded
  systemSubGraphExpandChanged(group: go.Group): void {

    if (group.isSubGraphExpanded) {

      // Run group layout to ensure member nodes are in the correct positions
      group.layout.isValidLayout = false;
      group.layout.doLayout(group);

      // Set of links that may need rerouting after subgraph expanded
      const linksToReroute = new go.Set();

      group.findSubGraphParts()
        .each(
          function(part: go.Part): void {
            if (part instanceof go.Node) {

              /*
                Change member system location back and forth between the current location and another point.
                This is to force GoJS to update the position of the system, as this does not appear to be
                done correctly when the parent group is moved.
              */
              const location = part.location.copy();
              part.move(location.copy().offset(1, 1));
              part.move(location, true);

              // Add links connected to member to set of links to be rerouted
              linksToReroute.addAll(part.linksConnected);
            }
          }
        );

      // Reroute all necessary links
      linksToReroute.each(function(link: go.Link): void {
        link.data = Object.assign(link.data, { updateRoute: true });
        link.invalidateRoute();
        link.updateRoute();
      });
    }
  }
}
