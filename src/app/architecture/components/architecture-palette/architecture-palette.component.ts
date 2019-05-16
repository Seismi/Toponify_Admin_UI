import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {DiagramService, Level} from '@app/architecture/services/diagram.service';
import * as go from 'gojs';
import {nodeCategories} from '@app/nodes/store/models/node.model';
import {linkCategories} from '@app/nodes/store/models/node-link.model';
@Component({
  selector: 'app-architecture-palette',
  templateUrl: './architecture-palette.component.html',
  styleUrls: ['./architecture-palette.component.scss']
})
export class ArchitecturePaletteComponent implements OnInit {
  private palette: go.Palette;

  @ViewChild('paletteDiv')
  private paletteRef: ElementRef;

  /* @Input()
  set nodes(val: any) {
    this.palette.model.nodeDataArray = val;
  }
 */
  constructor(private diagramService: DiagramService) {
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
      diagramService.getSystemNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.analytical,
      diagramService.getSystemNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.file,
      diagramService.getSystemNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.reporting,
      diagramService.getSystemNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.physical,
      diagramService.getDataSetNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.virtual,
      diagramService.getDataSetNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.dimension,
      diagramService.getDimensionNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.list,
      diagramService.getReportingConceptNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.structure,
      diagramService.getReportingConceptNodeTemplate()
    );

    this.palette.nodeTemplateMap.add(
      nodeCategories.key,
      diagramService.getReportingConceptNodeTemplate()
    );

    // Set links templates
    this.palette.linkTemplateMap.add(
      linkCategories.data,
      diagramService.getLinkDataTemplate(true)
    );

    this.palette.linkTemplateMap.add(
      linkCategories.masterData,
      diagramService.getLinkMasterDataTemplate(true)
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

    this.diagramService.masterDataTemplate.subscribe(function(template) {
        this.palette.nodeTemplateMap.add(nodeCategories.masterData, template);
      }.bind(this)
    );
    // Subscribe to source of node data for the palette
    this.diagramService.paletteNodes.subscribe(function(nodes) {
        this.palette.model.nodeDataArray = nodes;
      }.bind(this)
    );

    this.diagramService.paletteLinks.subscribe(function(links) {
        this.palette.model.linkDataArray = links;
      }.bind(this)
    );

  }
}
