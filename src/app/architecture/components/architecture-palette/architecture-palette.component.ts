import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as go from 'gojs';
import {nodeCategories} from '@app/nodes/store/models/node.model';
import {linkCategories} from '@app/nodes/store/models/node-link.model';
import {DiagramTemplatesService} from '../..//services/diagram-templates.service';
import {DiagramLevelService} from '../../services/diagram-level.service';
@Component({
  selector: 'app-architecture-palette',
  templateUrl: './architecture-palette.component.html',
  styleUrls: ['./architecture-palette.component.scss']
})
export class ArchitecturePaletteComponent implements OnInit {
  private palette: go.Palette;

  @ViewChild('paletteDiv')
  private paletteRef: ElementRef;

  constructor( private diagramTemplatesService: DiagramTemplatesService,
    private diagramLevelService: DiagramLevelService
  ) {
    this.palette = new go.Palette();
    this.palette.initialScale = 0.5;
    this.palette.model = new go.GraphLinksModel();
    this.palette.model.nodeKeyProperty = 'id';
    this.palette.autoScrollRegion = new go.Margin(0);
    (this.palette.model as go.GraphLinksModel).linkKeyProperty = 'id';
    this.palette.model.modelData = {
      name: true,
      description: false,
      tags: false,
      owner: false,
      nextLevel: false,
      responsibilities: false,
      dataLinks: true,
      masterDataLinks: true,
      linkName: false,
      linkLabel: false
    };

    (this.palette.layout as go.GridLayout).wrappingColumn = 1;

    this.palette.nodeTemplateMap.add(
      nodeCategories.transactional,
      diagramTemplatesService.getSystemNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.analytical,
      diagramTemplatesService.getSystemNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.file,
      diagramTemplatesService.getSystemNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.reporting,
      diagramTemplatesService.getSystemNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.physical,
      diagramTemplatesService.getDataSetNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.virtual,
      diagramTemplatesService.getDataSetNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.dimension,
      diagramTemplatesService.getDimensionNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.list,
      diagramTemplatesService.getReportingConceptNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.structure,
      diagramTemplatesService.getReportingConceptNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.key,
      diagramTemplatesService.getReportingConceptNodeTemplate()
    );

    // Set links templates
    this.palette.linkTemplateMap.add(
      linkCategories.data,
      diagramTemplatesService.getLinkDataTemplate(true)
    );

    this.palette.linkTemplateMap.add(
      linkCategories.masterData,
      diagramTemplatesService.getLinkMasterDataTemplate(true)
    );
  }

  updateDisplayOptions(event, option) {

    const model = this.palette.model;

    if (option === 'dataLinks' || option === 'masterDataLinks') {
      model.setDataProperty(model.modelData, option, event.checked);
    }
  }

  ngOnInit() {
    this.palette.div = this.paletteRef.nativeElement;

    this.diagramLevelService.masterDataTemplate.subscribe(function(template) {
        this.palette.nodeTemplateMap.add(nodeCategories.masterData, template);
      }.bind(this)
    );
    // Subscribe to source of node data for the palette
    this.diagramLevelService.paletteNodes.subscribe(function(nodes) {
        this.palette.model.nodeDataArray = nodes;
      }.bind(this)
    );

    this.diagramLevelService.paletteLinks.subscribe(function(links) {
        this.palette.model.linkDataArray = links;
      }.bind(this)
    );

  }
}
