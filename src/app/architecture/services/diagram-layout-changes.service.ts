import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DiagramLevelService, Level} from '@app/architecture/services/diagram-level.service';
import {MatDialog} from '@angular/material';
import * as go from 'gojs';
import {colourOptions} from '@app/architecture/store/models/layout.model';
import {bottomOptions, nodeCategories, NodeLayoutSettingsEntity} from '@app/architecture/store/models/node.model';
import {LinkLayoutSettingsEntity} from '@app/architecture/store/models/node-link.model';
import {select, Store} from '@ngrx/store';
import {State as LayoutState} from '@app/layout/store/reducers/layout.reducer';
import {State as WorkPackageState} from '@app/workpackage/store/reducers/workpackage.reducer';
import {getEditWorkpackages, getSelectedWorkpackages} from '@app/workpackage/store/selectors/workpackage.selector';
import {getLayoutSelected} from '@app/layout/store/selectors/layout.selector';

let thisService: DiagramLayoutChangesService;

/*
This service handles changes to the layout i.e. any visual change to the diagram/nodes/links
 that can be saved by the user.
*/

@Injectable()
export class DiagramLayoutChangesService {
  public onUpdatePosition: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateExpandState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateLinkLabelState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateTransformationNodeLabelState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateGroupsAreaState: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateNodeColour: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateLinkColour: BehaviorSubject<any> = new BehaviorSubject(null);
  public onUpdateDiagramLayout: BehaviorSubject<any> = new BehaviorSubject(null);

  workpackages = [];
  selectedWorkpackages = [];
  layout;
  layoutEditable = false;

  constructor(
    private diagramLevelService: DiagramLevelService,
    private dialog: MatDialog,
    private layoutStore: Store<LayoutState>,
    private workpackageStore: Store<WorkPackageState>
  ) {
    thisService = this;
    thisService.workpackageStore
      .pipe(select(getEditWorkpackages))
      .subscribe(workpackages => (thisService.workpackages = workpackages));
    thisService.workpackageStore
      .pipe(select(getSelectedWorkpackages))
      .subscribe(workpackages => (thisService.selectedWorkpackages = workpackages));
    thisService.layoutStore.pipe(select(getLayoutSelected)).subscribe(layout => (thisService.layout = layout));
  }

  // Update position of links or nodes in the back end
  //  -event
  //    -subject: set of parts to update the positions of
  updatePosition(event: any): void {
    // Do not update positions for map view
    if (thisService.diagramLevelService.isInMapView()) {
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
            links.push({
              id: part.key,
              points: part.data.route,
              fromSpot: part.data.fromSpot,
              toSpot: part.data.toSpot,
              colour: part.data.colour,
              showLabel: part.data.showLabel
            });
          }
        } else {
          // Part is a node
          nodes.push({ id: part.key, locationCoordinates: part.data.location });
        }
      }
    );

    thisService.onUpdatePosition.next({
      nodes: nodes,
      links: links
    });

    thisService.onUpdateDiagramLayout.next({});
  }

  // Rerun the diagram's layout for all nodes and links
  reorganise(diagram) {
    diagram.nodes.each(function(node) {
      diagram.model.setDataProperty(node.data, 'locationMissing', true);
    });
    diagram.links.each(function(link) {
      diagram.model.setDataProperty(link.data, 'routeMissing', true);
    });
    diagram.layout.isValidLayout = false;
    diagram.layout.doLayout(diagram);

    const linkRoutes = [];
    const nodeLocations = [];

    diagram.links.each(function(link: go.Link): void {
      linkRoutes.push({
        id: link.key,
        points: link.data.route,
        fromSpot: link.data.fromSpot,
        toSpot: link.data.toSpot,
        colour: link.data.colour,
        showLabel: link.data.showLabel}
      );
    });

    diagram.nodes.each(function(node: go.Node): void {
      nodeLocations.push({ id: node.data.id, locationCoordinates: node.data.location });
    });
  }

  // Rerun the diagram's links
  reorganiseLinks(diagram) {
    diagram.links.each(link => {
      diagram.model.setDataProperty(link.data, 'updateRoute', true);
      link.invalidateRoute();
      link.updateRoute();
    });

    const linkRoutes = thisService.updateLinkRoutes(diagram.links);

    thisService.onUpdatePosition.next(
      {
        nodes: [],
        links: linkRoutes
      }
    );
  }

  nodeExpandChanged(node) {
    let linkData: {
      id: string;
      points?: number[];
      fromSpot?: string;
      toSpot?: string;
      colour?: colourOptions;
      showLabel?: boolean
    }[] = [];

    node.ensureBounds();

    if (!thisService.diagramLevelService.isInStandardLevel()) {
      thisService.groupMemberSizeChanged(node);
      // Update node's layout in map, usage sources or targets views
      node.findTopLevelPart().invalidateLayout();
    } else {

      if (node instanceof go.Group) {
        // Set of links that may need rerouting after subgraph expanded/collapsed
        const linksToReroute = new go.Set<go.Link>();

        // Get any links that may need rerouting
        node.findSubGraphParts().each(function (part: go.Part): void {
          if (part instanceof go.Node) {
            // Add links connected to member to set of links to be rerouted
            linksToReroute.addAll(part.linksConnected);
          }
        });

        linkData = (thisService.updateLinkRoutes(linksToReroute));
      }

      // Update expanded status of node in the back end
      thisService.onUpdateExpandState.next({
        node: {
          id: node.data.id,
          middleExpanded: node.data.middleExpanded,
          bottomExpanded: node.data.bottomExpanded
        },
        links: linkData
      });

      thisService.groupMemberSizeChanged(node);
      thisService.onUpdateDiagramLayout.next({});
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
      const nonMemberSectionsHeight = group.resizeObject.getDocumentBounds().height - memberBounds.height;

      group.memberParts.each(function(part: go.Part): void {
        if (part instanceof go.Node) {
          /*
            For nodes that are already located in the group, change member node location back and
            forth between the current location and another point.
            This is to force GoJS to update the position of the node, as this does not appear to be
            done correctly when the parent group is moved.
          */
          const location = part.location.copy();
          part.move(location.copy().offset(1, 1));
          part.move(location, true);

          // Try to ensure that each part has correct bounds after being moved
          part.ensureBounds();
        }
      });

      // Set height and width of group to enclose the area previously
      //  calculated as necessary to enclose the members.
      group.resizeObject.height = memberBounds.height + nonMemberSectionsHeight;
      group.resizeObject.width = memberBounds.width + 10;
      group.ensureBounds();
    } else {
      // If group collapsed, just ensure bounds are correct
      group.ensureBounds();
    }
  }

  groupAreaChanged(event: go.DiagramEvent): void {
    const node = event.subject.part;

    // Make sure node bounds are up to date so links can route correctly
    node.ensureBounds();

    const linksToUpdate = new go.Set<go.Link>(node.linksConnected);

    if (node instanceof go.Group && !node.isSubGraphExpanded) {
      node.findSubGraphParts().each(function(part: go.Part): void {
        if (part instanceof go.Node) {
          part.linksConnected.each(function(memberLink: go.Link): void {
            if (memberLink.isVisible()) {
              linksToUpdate.add(memberLink);
            }
          });
        }
      });
    }

    const linkData = thisService.updateLinkRoutes(linksToUpdate);

    if (thisService.diagramLevelService.currentLevel === Level.usage || thisService.diagramLevelService.isInMapView()) {
      // Update node's layout in usage view
      node.findTopLevelPart().invalidateLayout();
    } else {
      // Update group area of node in the back end
      thisService.onUpdateGroupsAreaState.next({
        groups: [
          {
            id: node.data.id,
            areaSize: node.data.areaSize,
            locationCoordinates: node.data.location
          }
        ],
        links: linkData
      });
    }

    thisService.groupMemberSizeChanged(node);
    thisService.onUpdateDiagramLayout.next({});
  }

  // Ensures that all groups that have the given member as part of
  //  their subgraph are large enough to enclose the member
  groupMemberSizeChanged(member: go.Group): void {
    const nestedGroups = new go.Set<go.Group>();
    const linksToUpdate = new go.Set<go.Link>();

    let currentGroup = member;
    let currentMinBounds = member.getDocumentBounds().copy();

    // Loop through containing groups until reaching a top level group,
    //  ensuring each is big enough
    while (currentGroup.containingGroup !== null) {
      currentGroup = currentGroup.containingGroup;

      // If current group is a map view group then:
      //  - redo layout to ensure member nodes do not overlap
      //  - Exit (as map view groups are resized automatically)
      if (currentGroup.category === '') {
        currentGroup.layout.invalidateLayout();
        break;
      }

      const memberArea = currentGroup.findObject('Group member area');
      const memberBounds = memberArea.getDocumentBounds().copy();
      const nonMemberSectionsHeight = currentGroup.resizeObject.getDocumentBounds().height - memberBounds.height;

      // If currently considered group is already large enough then exit loop
      if (memberBounds.containsRect(currentMinBounds)) {
        break;
      }

      // Add the current group and any connected links to the sets of parts to update in the back end
      nestedGroups.add(currentGroup);
      linksToUpdate.addAll(currentGroup.linksConnected);

      // Expand minimum required area to include current group member area
      currentMinBounds = currentMinBounds.unionRect(memberBounds);

      // Expand group width and height to ensure it is large enough to enclose all group members
      currentGroup.resizeObject.height = Math.max(
        nonMemberSectionsHeight + currentMinBounds.bottom - memberBounds.top + 10,
        currentGroup.resizeObject.getDocumentBounds().height
      );
      currentGroup.resizeObject.width = Math.max(
        Math.max(memberBounds.right, currentMinBounds.right) - Math.min(memberBounds.left, currentMinBounds.left) + 10,
        currentGroup.resizeObject.getDocumentBounds().width
      );

      // Shift group horizontally in order to ensure group member area correctly encloses required bounds
      currentGroup.location = new go.Point(currentMinBounds.centerX, currentGroup.location.y);
      // For next iteration, set minimum bounds equal to new bounds of current group
      currentGroup.ensureBounds();
      currentMinBounds = currentGroup.getDocumentBounds().copy();
    }

    const linkData = thisService.updateLinkRoutes(linksToUpdate);

    // Construct array of group size/location data
    const groupData = [];
    nestedGroups.each(function(group: go.Group) {
      groupData.push({
        id: group.data.id,
        areaSize: group.data.areaSize,
        locationCoordinates: group.data.location
      });
    });

    if (thisService.diagramLevelService.currentLevel === Level.usage || thisService.diagramLevelService.currentLevel === Level.systemMap) {
      // Update node's layout in usage or map view
      member.invalidateLayout();
    } else {
      if (groupData.length + linkData.length > 0) {
        // Update back end with new layout info for updated groups and links
        thisService.onUpdateGroupsAreaState.next({
          groups: groupData,
          links: linkData
        });

        thisService.onUpdateDiagramLayout.next({});
      }
    }
  }

  changeColours(diagram: go.Diagram, colour: colourOptions): void {
    diagram.selection.each(function(part): void {
      diagram.model.setDataProperty(part.data, 'colour', colour);
      if (part instanceof go.Node) {
        thisService.nodeColourChanged(part);
      } else {
        thisService.linkColourChanged(part as go.Link);
      }
    });
    thisService.onUpdateDiagramLayout.next({});
  }

  nodeColourChanged(node: go.Node): void {
    thisService.onUpdateNodeColour.next(
      {
        id: node.data.id,
        colour: node.data.colour
      }
    );
  }

  linkColourChanged(link: go.Link): void {
    thisService.onUpdateLinkColour.next(
      {
        id: link.data.id,
        points: link.data.route,
        fromSpot: link.data.fromSpot,
        toSpot: link.data.toSpot,
        colour: link.data.colour,
        showLabel: link.data.showLabel
      }
    );
  }

  linkShowLabelChanged(link: go.Link): void {
    thisService.onUpdateLinkLabelState.next(
      {
        id: link.data.id,
        points: link.data.route,
        fromSpot: link.data.fromSpot,
        toSpot: link.data.toSpot,
        colour: link.data.colour,
        showLabel: link.data.showLabel
      }
    );
  }

  transformationNodeShowLabelChanged(node: go.Node): void {
    thisService.onUpdateTransformationNodeLabelState.next(
      {
        id: node.data.id,
        showLabel: node.data.showLabel
      }
    );
  }

  // Get current layout data for all parts in the diagram
  getCurrentPartsLayoutData(
    diagram: go.Diagram
  ): {
    nodeLayoutData: NodeLayoutSettingsEntity['layout'][];
    linkLayoutData: LinkLayoutSettingsEntity['layout'][];
  } {
    const nodeLayoutData = diagram.model.nodeDataArray.map(function(node) {
      return {
        id: node.id,
        positionSettings: {
          locationCoordinates: node.location,
          middleExpanded: node.middleExpanded,
          bottomExpanded: node.bottomExpanded,
          areaSize: node.areaSize,
          colour: node.colour,
          showLabel: node.showLabel
        }
      };
    });

    const linkLayoutData = (diagram.model as go.GraphLinksModel).linkDataArray.map(function(link) {
      return {
        id: link.id,
        positionSettings: {
          route: link.route,
          fromSpot: link.fromSpot,
          toSpot: link.toSpot,
          colour: link.colour,
          showLabel: link.showLabel
        }
      };
    });

    return { nodeLayoutData, linkLayoutData };
  }

  // For links routed automatically, save calculated route to current layout
  saveCalculatedRoutes(diagram: go.Diagram): void {
    const calculatedLinks = [];
    const calculatedNodes = [];

    diagram.links.each(function(link: go.Link): void {
      const linkLayout = link.data.positionPerLayout
        .find(function(layoutSettings: LinkLayoutSettingsEntity): boolean {
          return layoutSettings.layout.id === thisService.layout.id;
        });

      const linkLayoutSettings = linkLayout ? linkLayout.layout.positionSettings : null;

      // Link route has been calculated if no route saved for the layout
      //  or if the actual route differs from the saved route
      let linkCalculated = true;

      if (linkLayoutSettings && linkLayoutSettings.route) {
        linkCalculated = link.data.route.length !== linkLayoutSettings.route.length
          || link.data.route.some(
            function(coordinate, index) {
              return linkLayoutSettings.route[index] !== coordinate;
            });
      }

      if (linkCalculated && link.isVisible()) {
        link.data.test = true;
        calculatedLinks.push({
          id: link.key,
          points: link.data.route,
          fromSpot: link.data.fromSpot,
          toSpot: link.data.toSpot,
          colour: link.data.colour,
          showLabel: link.data.showLabel
        });
      }
    });

    diagram.nodes.each(function(node: go.Node): void {
      const nodeLayout = node.data.positionPerLayout
        .find(function(layoutSettings: NodeLayoutSettingsEntity): boolean {
          return layoutSettings.layout.id === thisService.layout.id;
        });

      const nodeLayoutSettings = nodeLayout ? nodeLayout.layout.positionSettings : null;

      // node location has been calculated if no location saved for the layout
      //  or if the actual location differs from the saved location
      let nodeCalculated = true;

      if (nodeLayoutSettings && nodeLayoutSettings.locationCoordinates) {
        nodeCalculated = node.data.location !== nodeLayoutSettings.locationCoordinates;
      }

      if (nodeCalculated && node.isVisible()) {
        node.data.test = true;
        calculatedNodes.push({
          id: node.key,
          locationCoordinates: node.data.location
        });
      }
    });

    if (calculatedLinks.length + calculatedNodes.length > 0) {
      thisService.onUpdatePosition.next({
        nodes: calculatedNodes,
        links: calculatedLinks
      });
    }
  }

  updateLinkRoutes(links: go.Set<go.Link>): {
    id: string
    points?: number[];
    fromSpot?: string;
    toSpot?: string;
    colour?: colourOptions;
    showLabel?: boolean;
  }[] {
    const linkData = [];
    links.each(function(link: go.Link): void {
      if (link.fromNode && link.toNode) {
        link.diagram.model.setDataProperty(link.data, 'updateRoute', true);
        link.invalidateRoute();
        link.updateRoute();

        linkData.push({
          id: link.data.id,
          points: link.data.route,
          fromSpot: link.data.fromSpot,
          toSpot: link.data.toSpot,
          colour: link.data.colour,
          showLabel: link.data.showLabel
        });
      }
    });

    return linkData;
  }

  changeStatusForSelection(diagram: go.Diagram): void {
    const anyStatusHidden = diagram.selection.any(
      function (part: go.Part): boolean {
        if ((part instanceof go.Node) && part.category !== nodeCategories.transformation) {
          return !part.data.middleExpanded;
        } else {
          return !part.data.showLabel;
        }
      }
    );

    diagram.selection.each(function(part: go.Part): void {
      if (part instanceof go.Node && part.category !== nodeCategories.transformation) {
        diagram.model.setDataProperty(part.data, 'middleExpanded', anyStatusHidden);
        diagram.model.setDataProperty(part.data, 'bottomExpanded', bottomOptions.none);

        thisService.nodeExpandChanged(part);
      } else {
        diagram.model.setDataProperty(part.data, 'showLabel', anyStatusHidden);
        if (part.category === nodeCategories.transformation) {
          thisService.transformationNodeShowLabelChanged(part as go.Node);
        } else {
          thisService.linkShowLabelChanged(part as go.Link);
        }
        thisService.onUpdateDiagramLayout.next({});
      }
    });
  }
}
