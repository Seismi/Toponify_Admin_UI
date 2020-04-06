import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as go from 'gojs';
import {layers, nodeCategories} from '@app/architecture/store/models/node.model';
import { linkCategories } from '@app/architecture/store/models/node-link.model';
import { DiagramTemplatesService } from '../..//services/diagram-templates.service';
import { DiagramLevelService } from '../../services/diagram-level.service';

@Component({
  selector: 'app-architecture-palette',
  templateUrl: './architecture-palette.component.html',
  styleUrls: ['./architecture-palette.component.scss']
})
export class ArchitecturePaletteComponent implements OnInit {
  private palette: go.Palette;

  @ViewChild('paletteDiv')
  private paletteRef: ElementRef;

  constructor(
    private diagramTemplatesService: DiagramTemplatesService,
    private diagramLevelService: DiagramLevelService
  ) {
    this.palette = new go.Palette();
    this.palette.initialScale = 0.5;
    this.palette.animationManager.isEnabled = false;
    this.palette.model = new go.GraphLinksModel();
    this.palette.model.nodeKeyProperty = 'id';
    this.palette.model.nodeCategoryProperty = function(data): string {
      return data.category === nodeCategories.transformation ?
        nodeCategories.transformation : data.layer;
    };
    this.palette.autoScrollRegion = new go.Margin(0);
    this.palette.toolManager.toolTipDuration = 20000;
    this.palette.toolManager.draggingTool.dragsLink = true;
    this.diagramTemplatesService.forPalette = true;
    (this.palette.model as go.GraphLinksModel).linkKeyProperty = 'id';
    this.palette.model.modelData = {
      name: true,
      description: false,
      tags: false,
      owners: false,
      nextLevel: false,
      responsibilities: false,
      dataLinks: true,
      masterDataLinks: true,
      linkName: false,
      linkLabel: false,
      relatedRadioAlerts: false
    };

    // Display palette parts in a single column
    (this.palette.layout as go.GridLayout).wrappingColumn = 1;

    // Set node templates

    this.palette.nodeTemplate = diagramTemplatesService.getNodeTemplate(true);
    this.palette.nodeTemplateMap.add('transformation', diagramTemplatesService.getTransformationNodeTemplate(true));

    // Set group template
    this.palette.groupTemplate = diagramTemplatesService.getSystemGroupTemplate(true);

    // Set links templates
    this.palette.linkTemplateMap.add(linkCategories.data, diagramTemplatesService.getLinkDataTemplate(true));

    this.palette.linkTemplateMap.add(
      linkCategories.masterData,
      diagramTemplatesService.getLinkMasterDataTemplate(true)
    );

    this.palette.addDiagramListener('LayoutCompleted',
      function(event) {
        const diagram = event.diagram;
        let transformationNode, toTransformationLink, fromTransformationLink;
        diagram.nodes.each(function(node) {
          if (node.data.category === nodeCategories.transformation) {
            transformationNode = node;
            toTransformationLink = node.findLinksInto().first();
            fromTransformationLink = node.findLinksOutOf().first();
          }
        });

        if (toTransformationLink && fromTransformationLink) {

          transformationNode.ensureBounds();
          const transformationBounds = transformationNode.getDocumentBounds().copy();
          const halfHeight = transformationBounds.height / 2;
          const toRoute = [-20, 0, -10, 0, -10, -halfHeight, 0, -halfHeight]
            .map(function(coordinate: number, index: number): number {
                return index % 2 === 0 ? transformationBounds.left + coordinate :
                  transformationBounds.bottom + coordinate;
              }
            );

          const fromRoute = [0, halfHeight, 10, halfHeight, 10, 0, 20, 0]
            .map(function(coordinate: number, index: number): number {
                return index % 2 === 0  ? transformationBounds.right + coordinate :
                  transformationBounds.top + coordinate;
              }
            );

          diagram.model.setDataProperty(toTransformationLink.data, 'route', toRoute);
          diagram.model.setDataProperty(fromTransformationLink.data, 'route', fromRoute);
          // toTransformationLink.updateTargetBindings('route');
          // fromTransformationLink.updateTargetBindings('route');

        }
      }
    );

    this.palette.addDiagramListener('ChangedSelection',
      function (event) {
        console.log(event.subject.first() ? event.subject.first().data.route : '' );
      }
    );

  }

  updateDisplayOptions(event: any, option: string) {
    const model = this.palette.model;

    if (option === 'dataLinks' || option === 'masterDataLinks') {
      model.setDataProperty(model.modelData, option, event.checked);
    }
  }

  ngOnInit() {
    this.palette.div = this.paletteRef.nativeElement;

    // Subscribe to source of node data for the palette
    this.diagramLevelService.paletteNodes.subscribe(
      function(nodes) {
        this.palette.model.nodeDataArray = nodes;
      }.bind(this)
    );

    // Subscribe to source of link data for the palette
    this.diagramLevelService.paletteLinks.subscribe(
      function(links) {
        this.palette.model.linkDataArray = links;
      }.bind(this)
    );
  }
}
