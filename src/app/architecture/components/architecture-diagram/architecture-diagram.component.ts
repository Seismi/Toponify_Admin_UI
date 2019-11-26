import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as go from 'gojs';
import { GuidedDraggingTool } from 'gojs/extensionsTS/GuidedDraggingTool';
import { linkCategories } from '@app/architecture/store/models/node-link.model';
import { layers } from '@app/architecture/store/models/node.model';
import { DiagramTemplatesService } from '../../services/diagram-templates.service';
import {
  DiagramLevelService,
  Level
} from '../..//services/diagram-level.service';
import { DiagramChangesService } from '../../services/diagram-changes.service';
import {
  CustomLinkShift,
  GojsCustomObjectsService
} from '../../services/gojs-custom-objects.service';
import { DiagramListenersService } from '../../services/diagram-listeners.service';

// FIXME: this solution is temp, while not clear how it should work
export const viewLevelMapping = {
  [1]: Level.system,
  [2]: Level.dataSet,
  [3]: Level.dimension,
  [4]: Level.reportingConcept,
  [8]: Level.systemMap,
  [9]: Level.dataSetMap,
  [10]: Level.usage
};

// Default display settings
const standardDisplayOptions = {
  name: true,
  description: false,
  tags: true,
  owners: false,
  nextLevel: true,
  responsibilities: false,
  dataLinks: true,
  masterDataLinks: true,
  linkName: false,
  linkLabel: false,
  showRadioAlerts: true
};

@Component({
  selector: 'app-architecture-diagram',
  templateUrl: './architecture-diagram.component.html',
  styleUrls: ['./architecture-diagram.component.scss']
})
export class ArchitectureDiagramComponent
  implements OnInit, OnChanges, OnDestroy {
  diagram: go.Diagram;

  private partsSelectedRef: Subscription = null;
  private modelChangeRef: Subscription = null;

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  get model(): go.Model {
    return this.diagram.model;
  }

  @Input() workpackageDetail;
  @Input('selectedId') set selectedId(id: string) {
    if (id) {
      this.selectById(id);
    }
  }

  @Input() workpackages;

  @Input() selectedWorkPackages;

  @Input() nodes;

  @Input() links;

  @Input() viewLevel: number;

  @Input() mapView: boolean;

  @Input() showGrid: boolean;

  @Input() allowMove = false;

  @Input() workPackageIsEditable = false;

  @Output()
  partsSelected = new EventEmitter();

  @Output()
  modelChanged = new EventEmitter();

  @Output()
  nodeDeleteRequested = new EventEmitter();

  @Output()
  linkDeleteRequested = new EventEmitter();

  @Output()
  updateNodeLocation = new EventEmitter();

  get level() {
    return viewLevelMapping[this.viewLevel]
      ? viewLevelMapping[this.viewLevel]
      : viewLevelMapping[1];
  }

  constructor(
    public diagramTemplatesService: DiagramTemplatesService,
    public diagramLevelService: DiagramLevelService,
    public diagramChangesService: DiagramChangesService,
    public gojsCustomObjectsService: GojsCustomObjectsService,
    public diagramListenersService: DiagramListenersService
  ) {
    // Lets init url filtering
    this.diagramLevelService.initializeUrlFiltering();
    (go as any).licenseKey = '2bf843eab76358c511d35a25403e7efb0ef72d35cf834da2590517a3ed5d604123cce17155d28d94c0e848fd4a28c1dc8e973d7d9' +
      '54e013fee39d6df4bea82abb53471b712584587f7012390cead29a5ff2a79f297b473f1c8688aa7bbaec3ce0ce9e1c44bcb0eb33678062e567e';
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;
    this.diagram.grid.visible = true;
    this.diagram.undoManager.isEnabled = false;
    this.diagram.allowCopy = false;
    this.diagram.animationManager.isEnabled = false;
    this.diagram.toolManager.draggingTool = new GuidedDraggingTool();
    (this.diagram.toolManager
      .draggingTool as GuidedDraggingTool).horizontalGuidelineColor = 'blue';
    (this.diagram.toolManager
      .draggingTool as GuidedDraggingTool).verticalGuidelineColor = 'blue';
    (this.diagram.toolManager
      .draggingTool as GuidedDraggingTool).centerGuidelineColor = 'green';
    this.diagram.toolManager.draggingTool.dragsLink = true;
    this.diagram.toolManager.mouseDownTools.add(new CustomLinkShift());
    this.diagram.toolManager.linkingTool.isEnabled = false;
    this.diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    this.diagram.toolManager.relinkingTool.linkValidation =
      diagramChangesService.linkingValidation;
    this.diagram.model.modelData = Object.assign({}, standardDisplayOptions);

    // Override standard doActivate method on dragging tool to disable guidelines when dragging a link
    this.diagram.toolManager.draggingTool.doActivate = function(): void {
      go.DraggingTool.prototype.doActivate.call(this);

      // Only use drag guidelines for nodes and not for links
      this.isGuidelineEnabled =
        this.draggedParts.toKeySet().first() instanceof go.Node;
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
    this.diagram.contextMenu = gojsCustomObjectsService.getBackgroundContextMenu();

    // Set node templates
    this.diagram.nodeTemplateMap.add(
      layers.system,
      diagramTemplatesService.getNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      layers.dataSet,
      diagramTemplatesService.getNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      layers.dimension,
      diagramTemplatesService.getNodeTemplate()
    );

    this.diagram.nodeTemplateMap.add(
      layers.reportingConcept,
      diagramTemplatesService.getNodeTemplate()
    );

    // Set links templates
    this.diagram.linkTemplateMap.add(
      linkCategories.data,
      diagramTemplatesService.getLinkDataTemplate()
    );

    this.diagram.linkTemplateMap.add(
      linkCategories.masterData,
      diagramTemplatesService.getLinkMasterDataTemplate()
    );

    this.diagram.linkTemplateMap.add(
      '',
      diagramTemplatesService.getLinkParentChildTemplate()
    );

    // Set group template
    this.diagram.groupTemplate = diagramTemplatesService.getDataSetGroupTemplate();

    // Override command handler delete method to emit delete event to angular
    this.diagram.commandHandler.deleteSelection = function(): void {

      // TEMP - no deletes for multiple parts for now
      if (this.diagram.selection.count !== 1) {return; }

      const deletedPart = this.diagram.selection.first();

      // Disallow delete of dummy links in map view
      if (deletedPart.data.id === '00000000-0000-0000-0000-000000000000') {return; }

      // Delete links that have not yet been connected to a node at both ends
      if (deletedPart.data.isTemporary) {
        go.CommandHandler.prototype.deleteSelection.call(
          this.diagram.commandHandler
        );
        return;
      }

      if (deletedPart instanceof go.Node) {
        this.nodeDeleteRequested.emit(deletedPart.data);
      } else {
        // part to be deleted is a link
        this.linkDeleteRequested.emit(deletedPart.data);
      }
    }.bind(this);

    // Define all needed diagram listeners
    diagramListenersService.enableListeners(this.diagram);
    diagramChangesService.onUpdatePosition.subscribe(
      (data: { nodes: any[]; links: any[] }) => {
        this.updateNodeLocation.emit(data);
      }
    );
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
    go.CommandHandler.prototype.deleteSelection.call(
      this.diagram.commandHandler
    );
  }

  // Recalculate the area that the diagram takes up.
  // Call when the diagram DIV changes size.
  updateDiagramArea(): void {
    this.diagram.requestUpdate();
  }

  ngOnInit() {
    this.diagramLevelService.initializeUrlFiltering();
    this.diagram.div = this.diagramRef.nativeElement;

    this.partsSelectedRef = this.diagramListenersService.partsSelected$.subscribe(
      function(node) {
        this.partsSelected.emit(node);
      }.bind(this)
    );

    this.modelChangeRef = this.diagramListenersService.modelChanged$.subscribe(
      function(event) {
        this.modelChanged.emit(event);
      }.bind(this)
    );

    this.setLevel();
  }

  ngOnDestroy(): void {
    this.diagramLevelService.destroyUrlFiltering();

    this.partsSelectedRef.unsubscribe();
    this.modelChangeRef.unsubscribe();
  }

  setLevel() {
    this.diagramLevelService.changeLevel(this.diagram, this.level);
  }

  // Call when you want to select a node
  selectNode(id: string): void {
    this.diagram.select(this.diagram.findPartForKey(id));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showGrid) {
      this.diagram.grid.visible = this.showGrid;
    }

    if (changes.allowMove) {
      this.diagram.allowMove = this.allowMove;
      this.diagram.allowDelete = this.allowMove;
      this.diagram.toolManager.linkReshapingTool.isEnabled = this.allowMove;
      const linkShiftingTool = this.diagram.toolManager.mouseDownTools
        .toArray()
        .find(function(tool) {
          return tool.name === 'LinkShifting';
        });
      linkShiftingTool.isEnabled = this.allowMove;

      // Handle changes tool-related adornments if a link is selected
      this.diagram.selection.each(function(part) {
        // Remove tool-related adornments from selected link (if any) for disabled tools
        if (!linkShiftingTool.isEnabled) {
          part.removeAdornment('LinkShiftingFrom');
          part.removeAdornment('LinkShiftingTo');
        }
        if (!part.diagram.toolManager.linkReshapingTool.isEnabled) {
          part.removeAdornment('LinkReshaping');
        }

        // Add tool-related adornments to selected link (if any) for enabled tools
        part.updateAdornments();
      });
    }

    if (changes.workPackageIsEditable) {
      const toolManager = this.diagram.toolManager;
      toolManager.relinkingTool.isEnabled = this.workPackageIsEditable;

      this.diagram.selection.each(function(part) {
        // Remove tool-related adornments from selected link (if any) for disabled tools
        if (!toolManager.relinkingTool.isEnabled) {
          part.removeAdornment('RelinkFrom');
          part.removeAdornment('RelinkTo');
        }

        // Add tool-related adornments to selected link (if any) for enabled tools
        part.updateAdornments();
      });
    }

    if (
      changes.viewLevel &&
      changes.viewLevel.currentValue !== changes.viewLevel.previousValue
    ) {
      this.setLevel();
    }

    if (changes.workpackages) {
      const model = this.diagram.model;

      // Update part colours on workpackage colour change
      model.setDataProperty(model.modelData, 'workpackages', this.workpackages);
      this.diagram.startTransaction('Update workpackage colours');
      this.diagram.nodes.each(function(node) {
        node.updateTargetBindings('impactedByWorkPackages');
      });
      this.diagram.links.each(function(link) {
        link.updateTargetBindings('impactedByWorkPackages');
      });
      this.diagram.commitTransaction('Update workpackage colours');
    }

    if (changes.links || changes.nodes) {
      const nodesHasBeenChanged =  changes.nodes &&
        JSON.stringify(changes.nodes.currentValue) !==
        JSON.stringify(changes.nodes.previousValue);

      const linksHasBeenChanged = changes.links &&
        JSON.stringify(changes.links.currentValue) !== JSON.stringify(changes.links.previousValue);

      const nodeKeyProp = this.diagram.model.nodeKeyProperty as string;

      if (nodesHasBeenChanged) {
        this.diagramChangesService.updateNodes(this.diagram, this.nodes);

        const nodeIds = this.nodes.map((node: any) => node[nodeKeyProp]);
        this.diagramChangesService.updateLinks(this.diagram, this.links, nodeIds);

        this.diagram.startTransaction('Update link workpackage colours');
        this.diagram.links.each(function(link) {
          link.updateTargetBindings('impactedByWorkPackages');
        });
        this.diagram.commitTransaction('Update link workpackage colours');
      }
      if (linksHasBeenChanged) {
        const nodeIds = this.nodes.map((node: any) => node[nodeKeyProp]);

        this.diagramChangesService.updateLinks(this.diagram, this.links, nodeIds);
      }
    }

    // In map view, perform the layout when nodes and links are both defined
    if (changes.nodes || changes.links) {
      if (
        this.diagram.model.nodeDataArray.length > 0 &&
        (this.diagram.model as go.GraphLinksModel).linkDataArray.length > 0
      ) {
        if (this.level.endsWith('map')) {
          this.diagram.layoutDiagram(true);
        }
      }
    }
  }
  selectById(id: string) {
    const part = this.diagram.findPartForKey(id);
    this.diagram.select(part);
  }
}
