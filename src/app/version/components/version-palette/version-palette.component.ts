import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {DiagramService, Level} from '@app/version/services/diagram.service';
import * as go from 'gojs';
@Component({
  selector: 'app-version-palette',
  templateUrl: './version-palette.component.html',
  styleUrls: ['./version-palette.component.scss']
})
export class VersionPaletteComponent implements OnInit {
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
      'relational',
      diagramService.getSystemNodeTemplate()
    );
    this.palette.nodeTemplateMap.add(
      'multidimensional',
      diagramService.getSystemNodeTemplate()
    );
    this.palette.nodeTemplateMap.add(
      'model',
      diagramService.getModelNodeTemplate()
    );
    this.palette.nodeTemplateMap.add(
      'dimension',
      diagramService.getDimensionNodeTemplate()
    );
    this.palette.nodeTemplateMap.add(
      'mdelement',
      diagramService.getElementNodeTemplate()
    );
    this.palette.nodeTemplateMap.add(
      'mdrule',
      diagramService.getRuleNodeTemplate()
    );
    this.palette.linkTemplateMap.add(
      'masterdata',
      diagramService.getLinkMasterDataTemplate(true)
    );
    this.palette.linkTemplateMap.add(
      'data',
      diagramService.getLinkDataTemplate(true)
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
