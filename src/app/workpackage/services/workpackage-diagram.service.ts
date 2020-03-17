import * as go from 'gojs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SetWorkpackageEditMode } from '@app/workpackage/store/actions/workpackage.actions';
import { Store } from '@ngrx/store';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';

const $ = go.GraphObject.make;

// Colours for workpackages of each status
const statusColours = {
  merged: 'black',
  superseded: 'grey',
  approved: 'green',
  submitted: 'yellow',
  draft: 'blue'
};

function textFont(style?: string): Object {
  const font = getComputedStyle(document.body).getPropertyValue('--default-font');
  return {
    font: `${style} ${font}`
  };
}

@Injectable({
  providedIn: 'root'
})
export class WorkPackageDiagramService {
  constructor(private router: Router, private workpackageStore: Store<WorkPackageState>) {}

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

  // Get standard options used for node shapes
  getStandardNodeShapeOptions(): go.Shape {
    return $(
      go.Shape,
      {
        figure: 'RoundedRectangle',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1
      }
    );
  }

  // Get work package icon
  getIcon(): go.Picture {
    return $(
      go.Picture,
      {
        desiredSize: new go.Size(20, 20),
        source: '/assets/node-icons/work-package.svg'
      }
    );
  }

  // Get work package name
  getName(): go.TextBlock {
    return $(
      go.TextBlock,
      textFont('bold 16px'),
      {
        textAlign: 'center',
        stroke: 'black',
        margin: new go.Margin(3, 10, 0, 10),
      },
      new go.Binding('text', 'name')
    );
  }

  // Get work package status
  getStatus() {
    return $(
      go.Panel,
      'Auto', {
        alignment: go.Spot.Right
      },
      $(go.Shape, 'RoundedRectangle',
        new go.Binding('fill', '', (data) => {
          if (data.hasErrors) {
            return 'red';
          } else {
            return statusColours[data.status];
          }
        })
      ),
      $(
        go.TextBlock,
        textFont('italic 15px'),
        {
          textAlign: 'center',
          stroke: 'white'
        },
        new go.Binding('text', 'status')
      )
    );
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
      {
        movable: false,
        doubleClick: function(event, node) {
          this.router.navigate(['/topology'], {
            queryParams: { workpackages: node.key },
            queryParamsHandling: 'merge'
          });
          this.workpackageStore.dispatch(new SetWorkpackageEditMode({ id: node.key, newState: false }));
        }.bind(this)
      },
      // Node should be hidden if all nodes in the current branch have status "merged" or "superseded"
      new go.Binding(
        'visible',
        '',
        function(node): boolean {
          return !this.isInMergedSupersededBranch(node);
        }.bind(this)
      ).ofObject(),
      this.getStandardNodeShapeOptions(),
      $(
        go.Panel,
        'Horizontal',
        {
          padding: 8
        },
          this.getIcon(),
          this.getName(),
          this.getStatus()
        )
      );
  }

  // Get link template for links in workpackage tree diagram
  getLinkTemplate() {
    return $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        isLayoutPositioned: true,
        selectable: false
      },
      $(go.Shape, {
        isPanelMain: true,
        stroke: 'black',
        strokeWidth: 1.5
      })
    );
  }
}
