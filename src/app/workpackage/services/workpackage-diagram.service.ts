import * as go from 'gojs';
import {Injectable} from '@angular/core';

const $ = go.GraphObject.make;

@Injectable()
export class WorkPackageDiagramService {
  constructor() {
  }

  getLayout() {
    return $(go.LayeredDigraphLayout, {
    });
  }

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

  getNodeTemplate() {
    return $(go.Node,
      'Auto',
      $(go.Shape,
        {
          figure: 'Rectangle',
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1,
          fromLinkable: true,
          toLinkable: true,
          name: 'shape'
        }
      )
    );
  }
}
