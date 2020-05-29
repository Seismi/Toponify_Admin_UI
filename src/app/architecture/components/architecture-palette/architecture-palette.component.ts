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
    this.palette.allowHorizontalScroll = false;
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

    (this.palette.layout as go.GridLayout).spacing = new go.Size(35, 35);

    // Set node templates

    this.palette.nodeTemplate = diagramTemplatesService.getNodeTemplate(true);
    this.palette.nodeTemplateMap.add('transformation', diagramTemplatesService.getTransformationNodeTemplate(true));

    // Set group template
    this.palette.groupTemplateMap.add('system', diagramTemplatesService.getStandardGroupTemplate());
    this.palette.groupTemplateMap.add('data', diagramTemplatesService.getStandardGroupTemplate());

    // Set links templates
    this.palette.linkTemplateMap.add(linkCategories.data, diagramTemplatesService.getLinkDataTemplate(true));

    this.palette.linkTemplateMap.add(
      linkCategories.masterData,
      diagramTemplatesService.getLinkMasterDataTemplate(true)
    );

    // After palette parts laid out, arrange the transformation node links to connect to the
    //  appropriate side of the transformation node.
    this.palette.addDiagramListener('LayoutCompleted',
      function(event: go.DiagramEvent): void {
        const diagram = event.diagram;

        // Fix palette bounds to prevent issue where dragging transformation node with links
        //  can cause the palette to resize.
        diagram.fixedBounds = diagram.documentBounds;

        let transformationNode, toTransformationLink, fromTransformationLink;

        // If any node in the palette is a transformation node then find any attached links
        diagram.nodes.each(function(node) {
          if (node.data.category === nodeCategories.transformation) {
            transformationNode = node;
            toTransformationLink = node.findLinksInto().first();
            fromTransformationLink = node.findLinksOutOf().first();
          }
        });

        // Only proceed if links attached to transformation node are found
        if (toTransformationLink && fromTransformationLink) {

          transformationNode.ensureBounds();

          const transformationBounds = transformationNode.getDocumentBounds().copy();
          const halfHeight = transformationBounds.height / 2;

          // Calculate route for link going to transformation node, based on relative position
          //  of the transformation node.
          const toRoute = [-50, -10, -25, -10, -25, -halfHeight, 0, -halfHeight]
            .map(function(coordinate: number, index: number): number {
                // even/odd indices represent an x/y-coordinate respectively
                return index % 2 === 0 ? transformationBounds.left + coordinate :
                  transformationBounds.bottom + coordinate;
              }
            );

          // Calculate route for link going from transformation node, based on relative position
          //  of the transformation node.
          const fromRoute = [0, halfHeight, 25, halfHeight, 25, 10, 50, 10]
            .map(function(coordinate: number, index: number): number {
                // even/odd indices represent an x/y-coordinate respectively
                return index % 2 === 0  ? transformationBounds.right + coordinate :
                  transformationBounds.top + coordinate;
              }
            );

          // Apply calculated routes to the links
          diagram.model.setDataProperty(toTransformationLink.data, 'route', toRoute);
          diagram.model.setDataProperty(fromTransformationLink.data, 'route', fromRoute);

        }
      }
    );

    // Listener to ensure that the transformation node and attached links are always
    //  selected together.
    this.palette.addDiagramListener('ChangedSelection',
      function (event: go.DiagramEvent): void {
        const selection = event.subject;
        const updatedSelection = selection.copy();
        selection.each(function(part: go.Part): void {
          // Ensure node is not selected without its links
          if (part instanceof go.Node) {
            updatedSelection.addAll(part.findLinksConnected());
          // Ensure link is not selected without its attached node and connected links
          } else if (part instanceof go.Link) {
            [part.toNode, part.fromNode].forEach(function(node) {
              if (node) {
                updatedSelection.add(node);
                updatedSelection.addAll(node.findLinksConnected());
              }
            });
          }
        });

        // Only update the palette selection if any additional parts need selecting.
        //  Prevents the ChangedSelection listener being called infinitely.
        if (selection.count < updatedSelection.count) {
          event.diagram.selectCollection(updatedSelection);
        }
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
