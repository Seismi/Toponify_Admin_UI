import * as go from 'gojs';
import {Injectable} from '@angular/core';
import {Level, DiagramLevelService} from './diagram-level.service';
import {FilterService} from './filter.service';
import {linkCategories} from '@app/nodes/store/models/node-link.model';

const $ = go.GraphObject.make;

// Default display options, under which parts in the diagram will have their positions saved
export const standardDisplayOptions = {
  name: true,
  description: false,
  tags: true,
  owner: false,
  nextLevel: true,
  responsibilities: false,
  dataLinks: true,
  masterDataLinks: true,
  linkName: false,
  linkLabel: false
};

// TEMPORARY HARD CODED COLOURS FOR WORK PACKAGES
const workPackageColours = ['green', 'orange', 'blue'];

@Injectable()
export class DiagramChangesService {

  constructor(
    public diagramLevelService: DiagramLevelService,
    public filterService: FilterService
  ) {
  }

  // Indicates whether the default display settings are currently active
  standardDisplay = true;

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

    // Only implemented for system, data set and dimension views so far
    if (![Level.system, Level.dataSet, Level.dimension].includes(currentLevel)) {return ; }

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

    // Update position of each part
    partsToUpdate.each(function(part: go.Part) {

      if (part instanceof go.Link) {
        // Ignore disconnected links
        if (part.fromNode && part.toNode) {

          // Replace routes. Will need to be updated to replace individual route for the current view when views are implemented.
          /* *REPLACE*
          links.push({
            [currentLevel.toLowerCase() + 'Link']: {
              data: {id: part.key,
                route: this.standardDisplay ? [{view: 'Default', points: part.data.route}] : []
              }
            },
            versionId: this.versionId
          });*/
        }
      } else {  // Part is a node

        // Replace locations. Will need to be updated to replace individual location for the current view when views are implemented.
        /* *REPLACE*
        this.store.dispatch(new updateNodeActionMapping[currentLevel]({
          [currentLevel.toLowerCase()]: {
            data: {id: part.key, location: [{view: 'Default', locationCoordinates: part.data.location}]}
          },
          versionId: this.versionId
        }));*/
      }
    }.bind(this));

    if (links.length > 0) {
      // *REPLACE* this.store.dispatch( new updateLinkActionMapping[currentLevel](links) );
    }
  }

  // Update diagram when display options have been changed
  updateDisplayOptions(event: any, option: string, diagram: go.Diagram): void {

    const model = diagram.model;
    model.setDataProperty(model.modelData, option, event.checked);

    // In standard display mode if the display options are all set to their standard values
    this.standardDisplay = Object.keys(standardDisplayOptions).every(function(displayOption) {
      return (standardDisplayOptions[displayOption] === model.modelData[displayOption]);
    });

    // Update the route of links after display change
    diagram.links.each(function(link) {
      // Set data property to indicate that link route should be updated
      diagram.model.setDataProperty(link.data, 'updateRoute', true);
      link.updateRoute();
    }.bind(this));
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

  updateNodes(diagram, nodes, selectedWorkPackages) {
    if (nodes && nodes.length > 0) {

      const filter = this.filterService.filter.getValue();
      const currentLevel = filter.filterLevel.toLowerCase();

      let nodeArray = JSON.parse(JSON.stringify(nodes));

      // Apply selected work packages
      if (selectedWorkPackages && selectedWorkPackages.length > 0) {
        selectedWorkPackages.forEach(function(workPackage, index) {

          const nodeChanges = workPackage.changes.nodes;

          // Additions
          nodeChanges.additions.forEach(function(addition) {
            if (addition.layer === currentLevel) {
              Object.assign({colour: workPackageColours[index]}, addition);
              nodeArray.push(addition);
            }
          });

          // Updates
          nodeChanges.updates.forEach(function(update) {
            const updatedNode = nodeArray.find(function(node) {return node.id === update.id; });
            if (updatedNode) {
              update = Object.assign({}, update);
              delete update.id;
              delete update.layer;
              Object.assign(updatedNode, update, {colour: workPackageColours[index]});
            }
          });

          // Deletions
          nodeChanges.deletions.forEach(function(deletion) {
            const nodeIndex = nodeArray.indexOf(function(node) {return node.id === deletion.id; });
            if (nodeIndex !== -1) {nodeArray.splice(nodeIndex, 1); }
          });
        });
      }

      // Check if filter is set
      if (filter && filter.filterNodeIds) {

        // Include only nodes specified in the filter
        nodeArray = nodeArray.filter(function (node) {
          return filter.filterNodeIds.includes(node.id);
        }, this);
      }

      if (this.diagramLevelService.mapView) {
        nodeArray.push(this.diagramLevelService.mapView.sourceModel);
        nodeArray.push(this.diagramLevelService.mapView.targetModel);
      }

      // Temporary - create copy to fix bug that arises when using sample data from json server
      nodeArray = JSON.parse(JSON.stringify(nodeArray));

      diagram.model.nodeDataArray = [...nodeArray];
      if (diagram.layout.isValidLayout) { diagram.layout.isValidLayout = false; }
    }
  }

  updateLinks(diagram, links, selectedWorkPackages) {
    if (links && links.length > 0) {

      const filter = this.filterService.filter.getValue();
      const currentLevel = filter.filterLevel.toLowerCase();

      const sourceProp = diagram.model.linkFromKeyProperty;
      const targetProp = diagram.model.linkToKeyProperty;

      let linkArray = JSON.parse(JSON.stringify(links));

      // Apply selected work packages
      if (selectedWorkPackages && selectedWorkPackages.length > 0) {
        selectedWorkPackages.forEach(function(workPackage, index) {

          const linkChanges = workPackage.changes.nodeLinks;

          // Additions
          linkChanges.additions.forEach(function(addition) {
            if (addition.layer === currentLevel) {
              Object.assign({colour: workPackageColours[index]}, addition);
              linkArray.push(addition);
            }
          });

          // Updates
          linkChanges.updates.forEach(function(update) {
            const updatedLink = linkArray.find(function(link) {return link.id === update.id; });
            if (updatedLink) {
              update = Object.assign({}, update);
              delete update.id;
              delete update.layer;
              Object.assign(updatedLink, update, {colour: workPackageColours[index]});
            }
          });

          // Deletions
          linkChanges.deletions.forEach(function(deletion) {
            const linkIndex = linkArray.indexOf(function(link) {return link.id === deletion.id; });
            if (linkIndex !== -1) {linkArray.splice(linkIndex, 1); }
          });
        });
      }

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
}
