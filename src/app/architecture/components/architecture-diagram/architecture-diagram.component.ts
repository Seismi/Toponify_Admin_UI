import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnDestroy
} from '@angular/core';
import { DiagramService, Level, standardDisplayOptions } from '@app/architecture/services/diagram.service';
import * as go from 'gojs';
import { GuidedDraggingTool } from 'gojs/extensionsTS/GuidedDraggingTool';

// FIXME: this solution is temp, while not clear how it should work
export const viewLevelMapping = {
  [1]: Level.system,
  [2]: Level.model,
  [3]: Level.dimension,
  [4]: Level.element,
  [5]: Level.attribute,
  [9]: Level.map
};

@Component({
  selector: 'app-architecture-diagram',
  templateUrl: './architecture-diagram.component.html',
  styleUrls: ['./architecture-diagram.component.scss']
})
export class ArchitectureDiagramComponent implements OnInit, OnChanges, OnDestroy {
  private diagram: go.Diagram;

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  get model(): go.Model {
    return this.diagram.model;
  }

  @Input() nodes;

  @Input() links;

  @Input() viewLevel: number;

  @Input() mapView: boolean;

  @Input() showGrid: boolean;

  @Input() allowMove: boolean;

  @Output()
  nodeSelected = new EventEmitter();

  @Output()
  modelChanged = new EventEmitter();

  @Output()
  nodeDeleteRequested = new EventEmitter();

  @Output()
  linkDeleteRequested = new EventEmitter();

  get level() {
    return viewLevelMapping[this.viewLevel]
      ? viewLevelMapping[this.viewLevel]
      : viewLevelMapping[1];
  }

  constructor(public diagramService: DiagramService) {
    // Lets init url filtering
    this.diagramService.initializeUrlFiltering();
    // // Place GoJS license key here:
    // // (go as any).licenseKey = '...'
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    // Allow only one part selected at one time
    this.diagram.maxSelectionCount = 1;
    this.diagram.allowDrop = true;
    this.diagram.grid.visible = true;
    this.diagram.undoManager.isEnabled = false;
    this.diagram.allowCopy = false;
    this.diagram.toolManager.draggingTool = new GuidedDraggingTool();
    (this.diagram.toolManager.draggingTool as GuidedDraggingTool).horizontalGuidelineColor = 'blue';
    (this.diagram.toolManager.draggingTool as GuidedDraggingTool).verticalGuidelineColor = 'blue';
    (this.diagram.toolManager.draggingTool as GuidedDraggingTool).centerGuidelineColor = 'green';
    this.diagram.toolManager.draggingTool.dragsLink = true;
    this.diagram.toolManager.linkingTool.isEnabled = false;
    this.diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    this.diagram.toolManager.relinkingTool.linkValidation = diagramService.linkingValidation;
    this.diagram.model.modelData = Object.assign({}, standardDisplayOptions);

    // Override standard doActivate method on dragging tool to disable guidelines when dragging a link
    this.diagram.toolManager.draggingTool.doActivate = function(): void {

      go.DraggingTool.prototype.doActivate.call(this);

      // Only use drag guidelines for nodes and not for links
      this.isGuidelineEnabled = this.draggedParts.toKeySet().first() instanceof go.Node;
    };


    // Override standard hideContextMenu method on context menu tool to also hide any opened sub-menus
    this.diagram.toolManager.contextMenuTool.hideContextMenu = function(): void {
      if (this.currentContextMenu) {
        this.currentContextMenu.elements.each(function(button: go.Part): void {
          if (button.column === 1) {
            button.visible = false;
          }
        });
      }
      // After hiding submenus, perform standard hideContextMenu process
      go.ContextMenuTool.prototype.hideContextMenu.call(this);
    };

    // Set context menu
    this.diagram.contextMenu = diagramService.getBackgroundContextMenu();

    // Set node templates
    this.diagram.nodeTemplateMap.add(
      'transactional',
      diagramService.getSystemNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      'analytical',
      diagramService.getSystemNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      'file',
      diagramService.getSystemNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      'reporting',
      diagramService.getSystemNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      'physical',
      diagramService.getModelNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      'virtual',
      diagramService.getModelNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      'dimension',
      diagramService.getDimensionNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      'reporting concept',
      diagramService.getElementNodeTemplate()
    );

    // Set links templates
    this.diagram.linkTemplateMap.add(
      'data',
      diagramService.getLinkDataTemplate()
    );

    this.diagram.linkTemplateMap.add(
      'master data',
      diagramService.getLinkMasterDataTemplate()
    );

    this.diagram.groupTemplate = diagramService.getModelGroupTemplate();

    this.diagram.addDiagramListener(
      'ChangedSelection',
      this.handleChangedSelection.bind(this)
    );

    // Temporary
    this.diagram.addDiagramListener(
      'BackgroundDoubleClicked',
      function() {
        console.log();
      }.bind(this)
    );

    this.diagram.addDiagramListener(
      'ExternalObjectsDropped',
      diagramService.createObjects.bind(this.diagramService)
    );

    this.diagram.addDiagramListener(
      'SelectionMoved',
      diagramService.updatePosition.bind(this.diagramService)
    );

    this.diagram.addDiagramListener(
      'LinkRelinked',
      diagramService.updateLinkConnections.bind(this.diagramService)
    );

    this.diagram.addDiagramListener(
      'LinkReshaped',
      function(event: any) {
        event.subject = new go.Set([event.subject]);

        if (this.diagramService.standardDisplay) {
          this.diagramService.updatePosition(event);
        }
      }.bind(this)
    );

    // Override command handler delete method to emit delete event to angular
    this.diagram.commandHandler.deleteSelection = function(): void {

      const deletedPart = this.diagram.selection.first();

      // Delete links that have not yet been connected to a node at both ends
      if (deletedPart.data.isTemporary) {
        go.CommandHandler.prototype.deleteSelection.call(this.diagram.commandHandler);
        return;
      }

      if (deletedPart instanceof go.Node) {

        /*
        // FIXME: Temporary solution. Find out more stable more stable way to calculate node type
        const nodeTypes = {
          [1]: NodeType.System,
          [2]: NodeType.Model,
          [3]: NodeType.Dimension,
          [4]: NodeType.Element
        };*/

        this.nodeDeleteRequested.emit({node: deletedPart.data, /*type: nodeTypes[this.viewLevel]*/});
      } else { // part to be deleted is a link

        /*
        // FIXME: Temporary solution. Find out more stable more stable way to calculate node type
        const linkTypes = {
          [1]: LinkType.System,
          [2]: LinkType.Model
        };*/

        this.linkDeleteRequested.emit({link: deletedPart.data /*, type: linkTypes[this.viewLevel]*/});
      }

    }.bind(this);

    this.diagram.addDiagramListener('SelectionMoved', this.diagramService.relayoutGroups);

    // After diagram layout, redo group layouts in map view to correct link paths
    this.diagram.addDiagramListener('LayoutCompleted', function() {

      if (this.mapView && this.diagramService.groupLayoutInitial) {
        this.diagram.findTopLevelGroups().each(function(group) {group.invalidateLayout(); });
        if (this.diagram.model.nodeDataArray.length !== 0) {
          // Indicate that the initial layout for the groups has been performed
          this.diagramService.groupLayoutInitial = false;
          // Reset content alignment to the default after layout has been completed so that diagram can be scrolled
          this.diagram.contentAlignment = go.Spot.Default;
        }
      }

    }.bind(this));

    this.diagram.addModelChangedListener(this.handleModelChange.bind(this));
  }

  // Zoom out diagram
  decreaseZoom(): void {
    this.diagram.commandHandler.decreaseZoom();
  }

  // Zoom in diagram
  increaseZoom(): void {
    this.diagram.commandHandler.increaseZoom();
  }

  // Show all diagram in screen
  zoomToFit() {
    this.diagram.zoomToFit();
  }

  // Method to perform delete after user has confirmed
  deleteConfirmed(): void {
    go.CommandHandler.prototype.deleteSelection.call(this.diagram.commandHandler);
  }

  handleChangedSelection(event: any) {
    const node = event.diagram.selection.first();
    this.nodeSelected.emit(node);
  }

  handleModelChange(event: any) {
    if (event.isTransactionFinished) {
      console.log('Nodes:', this.diagram.model.nodeDataArray);
      console.log('Links:', (this.diagram.model as go.GraphLinksModel).linkDataArray);
      this.modelChanged.emit(event);
    }
  }

  ngOnInit() {
    this.diagramService.initializeUrlFiltering();
    this.diagram.div = this.diagramRef.nativeElement;

    this.diagramService.masterDataTemplate.subscribe(function(template) {
        this.diagram.nodeTemplateMap.add('master data', template);
      }.bind(this)
    );

    this.setLevel();
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

        this.diagram.model.setDataProperty(part.data, property, data[property]);
      }
    }.bind(this));
  }

  // Update diagram when display options have been changed
  updateDisplayOptions(event: any, option: string): void {

    const model = this.diagram.model;
    model.setDataProperty(model.modelData, option, event.checked);

    // In standard display mode if the display options are all set to their standard values
    this.diagramService.standardDisplay = Object.keys(standardDisplayOptions).every(function(displayOption) {
      return (standardDisplayOptions[displayOption] === model.modelData[displayOption]);
    });

    // Update the route of links after display change
    this.diagram.links.each(function(link) {
      // Set data property to indicate that link route should be updated
      link.diagram.model.setDataProperty(link.data, 'updateRoute', true);
      link.updateRoute();
    });
  }

  ngOnDestroy(): void {
    this.diagramService.destroyUrlFiltering();
  }

  setLevel() {
    this.diagramService.changeLevel(this.diagram, this.level);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.showGrid) {
      this.diagram.grid.visible = this.showGrid;
    }

    if (changes.allowMove) {
      this.diagram.allowMove = this.allowMove;
      this.diagram.allowDelete = this.allowMove;
    }

    if (
      changes.viewLevel &&
      changes.viewLevel.currentValue !== changes.viewLevel.previousValue
    ) {
      this.setLevel();
    }

    const filter = this.diagramService.filter.getValue();

    if (changes.nodes) {
      if (this.nodes && this.nodes.length > 0) {

        let nodeArray = this.nodes;
        // Check if filter is set
        if (filter && filter.filterNodeIds) {

          // Include only nodes specified in the filter
          nodeArray = nodeArray.filter(function (node) {
            return filter.filterNodeIds.includes(node.id);
          }, this);
        }

        if (this.diagramService.mapView) {
          nodeArray.push(this.diagramService.mapView.sourceModel);
          nodeArray.push(this.diagramService.mapView.targetModel);
        }

        this.diagram.model.nodeDataArray = [...nodeArray];
        if (this.diagram.layout.isValidLayout) { this.diagram.layout.isValidLayout = false; }
      }
    }

    if (changes.links) {
      if (this.links && this.links.length > 0) {

        const sourceProp = (this.diagram.model as any).linkFromKeyProperty;
        const targetProp = (this.diagram.model as any).linkToKeyProperty;

        let linkArray = this.links;

        // Check if filter is set
        if (filter && filter.filterNodeIds) {

          // Include only links between nodes that are both specified in the filter
          linkArray = linkArray.filter(function (link) {
            return filter.filterNodeIds.includes(link[sourceProp]) &&
              filter.filterNodeIds.includes(link[targetProp]);
          }, this);
        }

        (this.diagram.model as go.GraphLinksModel).linkDataArray = [...linkArray];
        if (this.diagram.layout.isValidLayout) { this.diagram.layout.isValidLayout = false; }
      }
    }

    // In map view, perform the layout when nodes and links are both defined
    if (changes.nodes || changes.links) {
      if (this.diagram.model.nodeDataArray.length > 0 && (this.diagram.model as go.GraphLinksModel).linkDataArray.length > 0) {
        if (this.diagramService.mapView) {
          this.diagram.layoutDiagram(true);
        }
      }
    }
  }
}
