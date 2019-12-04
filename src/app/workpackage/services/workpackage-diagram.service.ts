import * as go from 'gojs';
import { Injectable } from '@angular/core';

const $ = go.GraphObject.make;

// Colours for workpackages of each status
const statusColours = {
  merged: 'black',
  superseded: 'grey',
  approved: 'green',
  submitted: 'yellow',
  draft: 'blue'
};

@Injectable()
export class WorkPackageDiagramService {
  constructor() {}

  // Get layout for workpackage tree diagram
  getLayout() {
    return $(go.LayeredDigraphLayout, {
      direction: 90,
      isRouting: true
    });
  }

  // Get model for workpackage tree diagram
  getModel(workPackages) {
    return $(go.GraphLinksModel, {
      nodeKeyProperty: 'id',
      isReadOnly: true,
      nodeDataArray: JSON.parse(JSON.stringify(workPackages)),
      linkDataArray: this.getLinksForPackages(workPackages)
    });
  }

  // Check if a node is in a branch containing only merged/superseded workpackages
  isInMergedSupersededBranch(workpackage): boolean {
    if (['superseded', 'merged'].includes(workpackage.data.status)) {
      // If node is merged/superseded then check whether all subsequent nodes are merged/superseded
      return workpackage.findNodesOutOf().all(
        function(successor): boolean {
          return this.isInMergedSupersededBranch(successor);
        }.bind(this)
      );
    } else {
      return false;
    }
  }

  // Create links connecting work packages and their baselines
  getLinksForPackages(workPackages) {
    const links = [];

    workPackages.forEach(function(workPackage) {
      if (workPackage.id === '00000000-0000-0000-0000-000000000000') {
        return;
      }

      workPackage.baseline.forEach(function(baseline) {
        links.push({
          from: baseline.id,
          to: workPackage.id
        });
      });
    });

    return links;
  }

  // Get node template for nodes in workpackage tree diagram
  getNodeTemplate() {
    return $(
      go.Node,
      'Auto',
      // Node should be hidden if all nodes in the current branch have status "merged" or "superseded"
      new go.Binding(
        'visible',
        '',
        function(node): boolean {
          return !this.isInMergedSupersededBranch(node);
        }.bind(this)
      ).ofObject(),
      $(
        go.Shape,
        {
          figure: 'Rectangle',
          stroke: 'black',
          strokeWidth: 1,
          fromLinkable: true,
          toLinkable: true,
          name: 'shape'
        },
        // Get fill colour based on workpackage status and whether workpackage has errors
        new go.Binding('fill', '', function(data) {
          if (data.hasErrors) {
            return 'red';
          } else {
            return statusColours[data.status];
          }
        })
      ),
      $(
        go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        // Text showing workpackage name
        $(
          go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'white',
            font: 'bold 16px calibri',
            maxSize: new go.Size(200, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name')
        ),
        // Text showing workpackage status
        $(
          go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'white',
            font: 'italic 15px calibri',
            maxSize: new go.Size(200, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'status')
        )
      )
    );
  }

  // Get link template for links in workpackage tree diagram
  getLinkTemplate() {
    return $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        isLayoutPositioned: true
      },
      $(go.Shape, {
        isPanelMain: true,
        stroke: 'black',
        strokeWidth: 1.5
      })
    );
  }
}
