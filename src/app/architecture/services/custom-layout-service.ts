import {Injectable} from '@angular/core';
import {PackedLayout} from '@app/architecture/official-gojs-extensions/PackedLayout';
import * as go from 'gojs';
import {endPointTypes, nodeCategories} from '@app/architecture/store/models/node.model';

let thisService;

@Injectable()
export class CustomLayoutService {

  public standardGroupLayout;
  public mapViewLayout;

  constructor() {
    thisService = this;
  }

  defineCustomLayouts() {
    this.defineStandardGroupLayout();
    this.defineMapViewLayout();
  }

  defineStandardGroupLayout() {
    function StandardGroupLayout() {
      PackedLayout.call(this);
    }

    go.Diagram.inherit(StandardGroupLayout, PackedLayout);

    StandardGroupLayout.prototype.initialOrigin = function(): go.Point {
      const memberArea = this.group.findObject('Group member area');
      const initialOriginLocal = new go.Point(memberArea.actualBounds.left + 10, memberArea.actualBounds.top + 12);
      return memberArea.getDocumentPoint(initialOriginLocal);
    };

    StandardGroupLayout.prototype.doLayout = function(coll: go.Diagram | go.Group | go.Iterable<go.Part>): void {
      if (this.group && !this.group.isSubGraphExpanded) {
        return;
      }
      const memberAreaBounds = this.group.findObject('Group member area').getDocumentBounds();
      const memberAreaSize = memberAreaBounds.size;
      this.size = new go.Size(Math.max(300, memberAreaSize.width - 20), Math.max(54, memberAreaSize.height - 24));

      this.group.memberParts.each(function(member) {
        if (!memberAreaBounds.containsRect(member.getDocumentBounds())) {
          member.isLayoutPositioned = true;
        }
      });

      // Do not attempt layout if no nodes need laying out - otherwise, an error occurs
      if (this.group.memberParts.all(
        function(member: go.Part): boolean {
          return !member.isLayoutPositioned;
        })
      ) {
        return;
      }

      PackedLayout.prototype.doLayout.call(this, coll);
    };

    this.standardGroupLayout = StandardGroupLayout;
  }

  defineMapViewLayout() {
    function MapViewLayout() {
      go.Layout.call(this);
    }
    go.Diagram.inherit(MapViewLayout, go.Layout);

    MapViewLayout.prototype.doLayout = function(coll: go.Diagram | go.Group | go.Iterable<go.Part>): void {
      const allParts = this.collectParts(coll);

      // Lists of source groups, target groups and transformation nodes
      const sourceGroups = new go.List<go.Group>();
      const targetGroups = new go.List<go.Group>();
      const transformationNodes = new go.List<go.Node>();

      let greatestSourceWidth = 0;
      let greatestTargetWidth = 0;

      // Populate node lists
      allParts.each(function(part: go.Part) {
        if (part.data.endPointType === endPointTypes.source) {
          sourceGroups.add(part as go.Group);
        } else if (part.data.endPointType === endPointTypes.target) {
          targetGroups.add(part as go.Group);
        } else if (part.category === nodeCategories.transformation && !part.data.isTemporary) {
          transformationNodes.add(part as go.Node);
        }
      });

      this.diagram.startTransaction('Map View Layout');

      // Set initial location to place nodes as the origin
      const nextLocation = new go.Point(0, 0);

      // Sort source groups so that groups without any linked members appear at the bottom
      sourceGroups.sort(function(a: go.Group, b: go.Group): number {
        const aLinks = a.findExternalLinksConnected().count;
        const bLinks = b.findExternalLinksConnected().count;

        if (aLinks === 0 && bLinks !== 0) {
          return 1;
        } else if (bLinks === 0 && aLinks !== 0) {
          return -1;
        } else {
          return 0;
        }
      });

      // Place source groups in a descending list
      sourceGroups.each(function(source: go.Group): void {
        source.move(nextLocation.copy(), true);
        // Set location of next source group to be below the previously set group with a small gap
        nextLocation.offset(0, source.actualBounds.height + 15);
      });

      // Function to return the number of member nodes connected between a given source and target group.
      //   Includes member nodes directly linked as well as nodes connected through a transformation node
      function countConnections(source: go.Group, target: go.Group): number {
        // Initialise connections count
        let totalConnections = 0;
        // For each node linked to a target member node...
        target.findExternalNodesConnected().each(function(node: go.Node): void {
          // ...if node is a member of the source group then increment count of connections
          if (node.containingGroup && node.containingGroup.key === source.key) {
            totalConnections++;
            // ...if node is transformation node then increase connection count by number of linked source group members
          } else if (node.category === nodeCategories.transformation) {
            node.findNodesInto().each(function(node2: go.Node): void {
              if (node2.containingGroup && node2.containingGroup.key === source.key) {
                totalConnections++;
              }
            });
          }
        });
        return totalConnections;
      }

      // Sort target groups according to number of connections to each source group
      targetGroups.sort(function(a: go.Group, b: go.Group): number {

        // Sort by connections to first source group, then each subsequent source group in order
        for (let i = 0; i < sourceGroups.count; i++) {
          const sourceGroup = sourceGroups.elt(i);

          const aLinks = countConnections(sourceGroup, a);
          const bLinks = countConnections(sourceGroup, b);

          // If one target group has more connections then use this to order them.
          //   Otherwise, continue and attempt to order using connections to subsequent source group.
          if (aLinks !== bLinks) {
            return bLinks - aLinks;
          }
        }

        // If both target groups have equal numbers of connections to all source groups
        //   then neither group has priority in ordering
        return 0;
      });

      sourceGroups.each(function(group: go.Group) {
        greatestSourceWidth = Math.max(group.actualBounds.width, greatestSourceWidth);
      });

      targetGroups.each(function(group: go.Group) {
        greatestTargetWidth = Math.max(group.actualBounds.width, greatestTargetWidth);
      });

      // Set initial location for target groups.
      // Place to the right of source groups.
      nextLocation.setTo(greatestSourceWidth / 2 + greatestTargetWidth / 2 + 300, 0);

      // Place target groups in a descending list
      targetGroups.each(function(target: go.Group): void {
        target.move(nextLocation.copy(), true);
        // Set location of next target group to be below the previously set group with a small gap
        nextLocation.offset(0, target.actualBounds.height + 15);
      });

      // Sort transformation nodes depending on vertical distance of linked nodes
      transformationNodes.sort(function(a: go.Node, b: go.Node): number {

        // Function to return average height of nodes linked to the given node
        function getAverageLinkedHeight(node) {
          let totalLinkedHeight = 0;
          // Sum the Y co-ordinate values of connected nodes
          node.findNodesConnected().each(function(connectedNode: go.Node) {
            totalLinkedHeight += connectedNode.location.y;
          });
          // Divide total by number of connections to work out the average
          return totalLinkedHeight / node.findNodesConnected().count;
        }

        const averageHeightA = getAverageLinkedHeight(a);
        const averageHeightB = getAverageLinkedHeight(b);

        // Sort based on difference between the averages for the two nodes
        return averageHeightA - averageHeightB;
      });

      // Calculate suitable gap between transformation nodes to ensure an even spread
      //    Determine available vertical space adjacent to the source and target groups
      const lowestGroupPoint = Math.max(
        // Set to 0 in case no source or target groups found
        sourceGroups.last() ? sourceGroups.last().actualBounds.bottom : 0,
        targetGroups.last() ? targetGroups.last().actualBounds.bottom : 0
      );
      //    Get a suitable gap between each node based on available space and number of transformation nodes
      const step = lowestGroupPoint / (transformationNodes.count + 1);

      // Set initial location for transformation nodes.
      // Place in between source and target groups.
      nextLocation.setTo(greatestSourceWidth / 2 + 150, step - 27);

      transformationNodes.each(function(trans: go.Node): void {
        trans.move(nextLocation.copy(), true);
        // Set location of the next node to be below the previous node, separated by the predetermined gap
        nextLocation.offset(0, step);
      });

      this.diagram.commitTransaction('Map View Layout');
    };

    this.mapViewLayout = MapViewLayout;
  }

}
