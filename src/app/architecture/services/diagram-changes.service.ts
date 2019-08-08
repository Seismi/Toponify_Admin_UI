import * as go from 'gojs';
import {Injectable} from '@angular/core';
import {Level, DiagramLevelService} from './diagram-level.service';
import {FilterService} from './filter.service';
import { linkCategories } from '@app/architecture/store/models/node-link.model';
import { Node } from '@app/architecture/store/models/node.model.ts';
import { BehaviorSubject } from 'rxjs';

const $ = go.GraphObject.make;

// TEMPORARY HARD CODED COLOURS FOR WORK PACKAGES
const workPackageColours = [
  '#f44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#607D8B'
];

@Injectable()
export class DiagramChangesService {

  public onUpdatePosition: BehaviorSubject<any> = new BehaviorSubject(null);

  // Colors for work packages
  colors = workPackageColours;

  constructor(
    public diagramLevelService: DiagramLevelService,
    public filterService: FilterService
  ) {
  }

  // Add newly created nodes to the back end
  //  -event
  //    -subject: set of nodes to add to the database
  createObjects(event: any): void {

    const currentLevel = this.diagramLevelService.filter.getValue().filterLevel;

    // Only implemented for system, data set and dimension views so far
    if (![Level.system, Level.dataSet, Level.dimension].includes(currentLevel)) {return ; }

    event.subject.each(function(part: go.Part) {

      // Only add nodes here as new links are temporary until connected
      if (part instanceof go.Node) {

        // Create copy of node data with route in format required for back end
        const sendData = Object.assign({}, part.data);

        // Replace locations. Will need to be updated to replace individual location for the current view when views are implemented.
        // *REPLACE* sendData.location = [{view: 'Default', locationCoordinates: part.data.location}];

        // Add node to back end database
        /* *REPLACE*
        this.store.dispatch(new addNodeActionMapping[currentLevel]({
          [currentLevel.toLowerCase()]: {
            data: sendData
          },
          versionId: this.versionId
        }));*/
      }
    });
  }

  // Updates the properties associated with a node or link
  //  -part: part to update
  //  -data: object containing new property values to apply
  updatePartData(part, data) {

    // Iterate through data to set each property against the part
    Object.keys(data).forEach(function(property) {

      // Do not update id or category fields as these do not change
      if (!['id', 'category'].includes(property)
        // Only update properties that appear in the part's data
        && property in part.data
        // Do not bother to update properties that have not changed
        && data[property] !== part.data[property]) {

        part.diagram.model.setDataProperty(part.data, property, data[property]);
      }
    }.bind(this));
  }

  // Update position of links or nodes in the back end
  //  -event
  //    -subject: set of parts to update the positions of
  updatePosition(event: any): void {

    const currentLevel = this.filterService.filter.getValue().filterLevel;

    // Do not update positions for map view
    if (currentLevel === Level.map) {return ; }

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

    const links: any[] = [];
    let node: any;
    // Update position of each part
    partsToUpdate.each(function(part: go.Part) {
      if (part instanceof go.Link) {
        // Ignore disconnected links
        if (part.fromNode && part.toNode) {
          links.push({id: part.key, points: part.data.route});
        }
      } else {  // Part is a node
        node = {id: part.key, locationCoordinates: part.data.location};
      }
    }.bind(this));

    this.onUpdatePosition.next({
      node: node,
      links: links
    });
  }

  // Update diagram when display options have been changed
  updateDisplayOptions(event: any, option: string, diagram: go.Diagram): void {

    const model = diagram.model;
    model.setDataProperty(model.modelData, option, event.checked);

    // Redo layout for node usage view after updating display options
    if (this.filterService.getFilter().filterLevel === Level.usage) {
      diagram.layout.isValidLayout = false;
    } else {
      // Update the route of links after display change
      diagram.links.each(function(link) {
        // Set data property to indicate that link route should be updated
        diagram.model.setDataProperty(link.data, 'updateRoute', true);
        link.updateRoute();
      }.bind(this));
    }
  }

  // Update back end when a link is connected to a node
  //  -event
  //    -subject: link that has been connected
  updateLinkConnections(event: any): void {

    const draggingTool = event.diagram.toolManager.draggingTool;
    const relinkingTool = event.diagram.toolManager.relinkingTool;

    const link = event.subject;
    const currentLevel = this.filterService.filter.getValue().filterLevel;

    // Only implemented for system, data set and dimension views so far
    if (![Level.system, Level.dataSet, Level.dimension].includes(currentLevel)) {return ; }

    // Ignore disconnected links
    if (link.fromNode && link.toNode) {

      // Update link route
      link.updateRoute();

      // Create link if not already in database
      if (link.data.isTemporary) {

        // Create copy of link data with route in format required for back end
        const sendData = Object.assign({}, link.data);

        // Only save route if using standard display settings
        // *REPLACE* sendData.route = this.standardDisplay ? [{view: 'Default', points: link.data.route}] : [];

        // Add link to database
        /* *REPLACE*
        this.store.dispatch(new addLinkActionMapping[currentLevel]({
          [currentLevel.toLowerCase() + 'Link']: {
            data: sendData
          },
          versionId: this.versionId
        }));*/

        // Flag that link now exists in the database
        link.data.isTemporary = false;

        if (draggingTool.isActive) {draggingTool.doDeactivate(); }
      } else { // Link already exists in database, therefore do update

        // Prevent process from running twice when updating both ends of a link by dragging
        if (!draggingTool.isActive && !relinkingTool.isActive) {
          return ;
        }

        // Source/target properties
        const sourceProp = event.diagram.model.linkFromKeyProperty;
        const targetProp = event.diagram.model.linkToKeyProperty;

        // Update link source and target in the database
        /* *REPLACE*
        this.store.dispatch(new updateLinkActionMapping[currentLevel]({
          [currentLevel.toLowerCase() + 'Link']: {
            data: {id: link.key,
              [sourceProp]: link.fromNode.key,
              [targetProp]: link.toNode.key,
              route: this.standardDisplay ? [{view: 'Default', points: link.data.route}] : []
            }
          },
          versionId: this.versionId
        }));*/
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
      neighbourLinks.each(function(NLink: go.Link) {NLink.invalidateRoute(); NLink.updateRoute(); });

      // Update position of neighbouring links in back end
      this.updatePosition({subject: neighbourLinks});
    }
  }

  // Update the array of nodes that are displayed in the diagram
  //  -diagram - the diagram to update
  //  -nodes - the array of nodes from the architecture to include
  //  -selectedWorkPackages - the array of currently selected work packages to apply node changes from
  updateNodes(diagram, nodes) {

    if (nodes && nodes.length > 0) {

      const filter = this.filterService.filter.getValue();
      const currentLevel = filter.filterLevel.toLowerCase();

      let nodeArray = JSON.parse(JSON.stringify(nodes));

      // Check if filter is set
      if (filter && filter.filterNodeIds) {

        // Include only nodes specified in the filter
        nodeArray = nodeArray.filter(function (node) {
          return filter.filterNodeIds.includes(node.id);
        }, this);
      }

      /*/ In map view, sort the nodes so that the group representing the source occurs first in the array
      if (filter.filterLevel === Level.map) {
        nodeArray.sort(function(a, b) {
          if (a.id === this.diagramLevelService.mapView.sourceDataSet.id) {
            return -1;
          } else {
            return 1;
          }
        }.bind(this));
      }*/

      // Temporary - create copy to fix bug that arises when using sample data from json server
      nodeArray = JSON.parse(JSON.stringify(nodeArray));

      diagram.model.nodeDataArray = [...nodeArray];
      if (diagram.layout.isValidLayout) { diagram.layout.isValidLayout = false; }
    }
  }

  // Update the array of links that are displayed in the diagram
  //  -diagram - the diagram to update
  //  -links - the array of links from the architecture to include
  //  -selectedWorkPackages - the array of currently selected work packages to apply link changes from
  updateLinks(diagram, links) {

    if (links && links.length > 0) {

      const filter = this.filterService.filter.getValue();
      const currentLevel = filter.filterLevel.toLowerCase();

      const sourceProp = diagram.model.linkFromKeyProperty;
      const targetProp = diagram.model.linkToKeyProperty;

      let linkArray = JSON.parse(JSON.stringify(links));

      // Check if filter is set
      if (filter && filter.filterNodeIds) {

        // Include only links between nodes that are both specified in the filter
        linkArray = linkArray.filter(function (link) {
          return filter.filterNodeIds.includes(link[sourceProp]) &&
            filter.filterNodeIds.includes(link[targetProp]);
        }, this);
      }

      // Temporary - create copy to fix bug that arises when using sample data from json server
      linkArray = JSON.parse(JSON.stringify(linkArray));

      (diagram.model as go.GraphLinksModel).linkDataArray = [...linkArray];
      if (diagram.layout.isValidLayout) { diagram.layout.isValidLayout = false; }
    }
  }

  linkingValidation(fromnode: go.Node,
    fromport: go.GraphObject,
    tonode: go.Node,
    toport: go.GraphObject,
    oldlink: go.Link) {

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
      } else {  // Link being moved
        oldlink = draggingTool.draggedParts.first().key as go.Link;
      }
    }

    // Only validate master data links
    if (oldlink.category === linkCategories.masterData) {
      // Prevent multiple master data links between the same pair of nodes
      const allLinks = fromnode.findLinksBetween(tonode);
      return !allLinks.any(function (link) {
        return (link.data.category === linkCategories.masterData
          // Don't count current link when checking if master data links already exist
          && oldlink.data.id !== link.data.id);
      });
    }

    return true;
  }

  // Hide all nodes except the specified node and all nodes directly linked to it
  hideNonDependencies(depNode: go.Node) {

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
  showDependencies(depNode: go.Node) {
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
  showAllNodes(diagram) {
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
}
