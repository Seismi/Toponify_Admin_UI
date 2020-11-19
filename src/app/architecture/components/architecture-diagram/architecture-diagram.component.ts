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
import { DiagramImageService } from '@app/architecture/services/diagram-image.service';
import { linkCategories } from '@app/architecture/store/models/node-link.model';
import { layers, nodeCategories } from '@app/architecture/store/models/node.model';
import * as go from 'gojs';
import {distinctUntilChanged} from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { DiagramLevelService, Level } from '../..//services/diagram-level.service';
import { DiagramListenersService } from '../../services/diagram-listeners.service';
import { DiagramPartTemplatesService } from '../../services/diagram-part-templates.service';
import {colourOptions} from '@app/architecture/store/models/layout.model';
import {DiagramLayoutChangesService} from '@app/architecture/services/diagram-layout-changes.service';
import {DiagramStructureChangesService} from '@app/architecture/services/diagram-structure-changes.service';
import {DiagramUtilitiesService} from '@app/architecture/services/diagram-utilities-service';
import {DiagramPanelTemplatesService} from '@app/architecture/services/diagram-panel-templates.service';
import {CustomLayoutService} from '@app/architecture/services/custom-layout-service';
import {CustomLinkShift, CustomToolsService} from '@app/architecture/services/custom-tools-service';

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
export class ArchitectureDiagramComponent implements OnInit, OnChanges, OnDestroy {
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

  @Input() viewLevel: Level;

  @Input() mapView: boolean;

  @Input() showGrid: boolean;

  @Input() allowMove = false;

  @Input() layoutSettings;

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

  @Output()
  updateNodeExpandState = new EventEmitter();

  @Output()
  updateLinkLabelState = new EventEmitter();

  @Output()
  updateTransformationNodeLabelState = new EventEmitter();

  @Output()
  updateGroupArea = new EventEmitter();

  @Output()
  updateNodeColour = new EventEmitter();

  @Output()
  updateLinkColour = new EventEmitter();

  @Output()
  updateDiagramLayout = new EventEmitter();

  get level() {
    return this.viewLevel ? this.viewLevel : Level.system;
  }

  constructor(
    private diagramPartTemplatesService: DiagramPartTemplatesService,
    private diagramLayoutChangesService: DiagramLayoutChangesService,
    private diagramStructureChangesService: DiagramStructureChangesService,
    private diagramLevelService: DiagramLevelService,
    private diagramListenersService: DiagramListenersService,
    private diagramImageService: DiagramImageService,
    private diagramUtilitiesService: DiagramUtilitiesService,
    private diagramPanelTemplatesService: DiagramPanelTemplatesService,
    private customLayoutService: CustomLayoutService,
    private customToolsService: CustomToolsService
  ) {

    this.diagramPanelTemplatesService.defineRoundButton();

    // Lets init url filtering
    this.diagramLevelService.initializeUrlFiltering();
    (go as any).licenseKey =
      '2bf843eab76358c511d35a25403e7efb0ef72d35cf834da2590517a3ed5d604123cce17155d28d94c0e848fd4a28c1dc8e973d7d9' +
      '54e013fee39d6df4bea82abb53471b712584587f7012390cead29a5ff2a79f297b473f1c8688aa7bbaec3ce0ce9e1c44bcb0eb33678062e567e';
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;
    this.diagram.grid.visible = true;
    this.diagram.undoManager.isEnabled = false;
    this.diagram.allowCopy = false;
    this.diagram.animationManager.isEnabled = false;
    this.diagram.autoScrollRegion = new go.Margin(120, 200, 135, 200);

    this.diagram.model.modelData = Object.assign({}, standardDisplayOptions);

    this.customToolsService.enableCustomTools(this.diagram);

    this.diagram.toolManager.mouseDownTools.add(new CustomLinkShift());

    // Set context menu
    this.diagram.contextMenu = diagramPartTemplatesService.getBackgroundContextMenu();

    this.customLayoutService.defineCustomLayouts();

    // Set node templates
    this.diagram.nodeTemplate = diagramPartTemplatesService.getNodeTemplate();
    this.diagram.nodeTemplateMap.add(
      nodeCategories.transformation,
      diagramPartTemplatesService.getTransformationNodeTemplate()
    );

    // Set links templates
    this.diagram.linkTemplateMap.add(linkCategories.data, diagramPartTemplatesService.getStandardLinkTemplate());

    this.diagram.linkTemplateMap.add(linkCategories.masterData, diagramPartTemplatesService.getStandardLinkTemplate());

    this.diagram.linkTemplateMap.add(linkCategories.copy, diagramPartTemplatesService.getLinkCopyTemplate());

    this.diagram.linkTemplateMap.add(linkCategories.warning, diagramPartTemplatesService.getLinkWarningTemplate());

    this.diagram.linkTemplateMap.add('', diagramPartTemplatesService.getLinkParentChildTemplate());

    // Set group templates
    this.diagram.groupTemplateMap.add(layers.system, diagramPartTemplatesService.getStandardGroupTemplate());
    this.diagram.groupTemplateMap.add(layers.data, diagramPartTemplatesService.getStandardGroupTemplate());
    this.diagram.groupTemplateMap.add('', diagramPartTemplatesService.getMapViewGroupTemplate());

    this.diagram.add(diagramPartTemplatesService.getInstructions());

    // Define all needed diagram listeners
    diagramListenersService.enableListeners(this.diagram);

    diagramLayoutChangesService.onUpdateDiagramLayout.subscribe(() => {
      this.updateDiagramLayout.emit();
    });
    diagramLayoutChangesService.onUpdatePosition.subscribe((data: { nodes: any[]; links: any[] }) => {
      this.updateNodeLocation.emit(data);
    });
    diagramLayoutChangesService.onUpdateExpandState.subscribe((data: { nodes: any[]; links: any[] }) => {
      this.updateNodeExpandState.emit(data);
    });
    diagramLayoutChangesService.onUpdateLinkLabelState.subscribe((link: any) => {
      this.updateLinkLabelState.emit(link);
    });
    diagramLayoutChangesService.onUpdateTransformationNodeLabelState
      .subscribe((data: { id: string, showLabel: boolean }) => {
        this.updateTransformationNodeLabelState.emit(data);
      });
    diagramLayoutChangesService.onUpdateNodeColour.subscribe((data: { id: string, colour: colourOptions }) => {
      this.updateNodeColour.emit(data);
    });
    diagramLayoutChangesService.onUpdateLinkColour.subscribe((link: any) => {
      this.updateLinkColour.emit(link);
    });

    this.diagramLayoutChangesService.onUpdateGroupsAreaState
      .pipe(distinctUntilChanged(function(prev, curr): boolean {
        return JSON.stringify(prev) === JSON.stringify(curr);
      }))
      .subscribe((data: { groups: any[]; links: any[] }) => {
        this.updateGroupArea.emit(data);
      });

    this.diagramStructureChangesService.onRequestNodeDelete.subscribe((node: any) => {
      this.nodeDeleteRequested.emit(node);
    });

    this.diagramStructureChangesService.onRequestLinkDelete.subscribe((link: any) => {
      this.linkDeleteRequested.emit(link);
    });
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

  // Recalculate the area that the diagram takes up.
  // Call when the diagram DIV changes size.
  updateDiagramArea(): void {
    this.diagram.requestUpdate();
  }

  centreDiagram(): void {
    const diagram = this.diagram;
    diagram.centerRect(diagram.computePartsBounds(diagram.nodes));
  }

  ngOnInit() {
    this.diagramLevelService.initializeUrlFiltering();
    this.diagram.div = this.diagramRef.nativeElement;
    this.diagram.allowDelete = false;

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

  getNodeFromId(id: string) {
    return this.diagram.findNodeForKey(id);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showGrid) {
      this.diagram.grid.visible = this.showGrid;
    }

    if (changes.layoutSettings) {
      const modelData = this.diagram.model.modelData;
      const layoutSettings = this.layoutSettings;

      const defaultLayoutSettings = {
        name: true,
        description: true,
        showRadioAlerts: true,
        tags: true,
        nextLevel: true,
        responsibilities: false,
        dataLinks: true,
        masterDataLinks: true,
        linkName: false,
        linkRadio: true
      };

      // Function to set model data properties in accordance with the layout settings.
      // If layout setting not available then set to default value.
      const setLayoutSetting = function(
        modelDataSetting: string,
        layoutSetting: string,
        partType: 'components' | 'links'
      ): void {
        modelData[modelDataSetting] =
          layoutSetting in layoutSettings[partType]
            ? layoutSettings[partType][layoutSetting]
            : defaultLayoutSettings[modelDataSetting];
      };

      if (layoutSettings) {
        setLayoutSetting('name', '', 'components');
        setLayoutSetting('description', 'showDescription', 'components');
        setLayoutSetting('showRadioAlerts', 'showRADIO', 'components');
        setLayoutSetting('tags', 'showTags', 'components');
        setLayoutSetting('nextLevel', 'showNextLevel', 'components');
        setLayoutSetting('responsibilities', '', 'components');
        setLayoutSetting('dataLinks', 'showDataLinks', 'links');
        setLayoutSetting('masterDataLinks', 'showMasterDataLinks', 'links');
        setLayoutSetting('linkName', 'showName', 'links');
        setLayoutSetting('linkRadio', 'showRadio', 'links');
      }

      this.diagram.updateAllTargetBindings('');
    }

    if (changes.allowMove) {
      this.diagram.allowMove = this.allowMove;
      this.diagramLayoutChangesService.layoutEditable = this.allowMove;
      this.diagram.allowReshape = this.allowMove;
      this.diagram.allowResize = this.allowMove;
      this.diagram.toolManager.resizingTool.isEnabled = this.allowMove;
      this.diagram.toolManager.linkReshapingTool.isEnabled = this.allowMove;
      const linkShiftingTool = this.diagram.toolManager.mouseDownTools.toArray().find(function(tool: go.Tool): boolean {
        return tool.name === 'LinkShifting';
      });
      linkShiftingTool.isEnabled = this.allowMove;

      this.diagram.updateAllTargetBindings('');

      // Handle changes tool-related adornments if a part is selected
      this.diagram.selection.each(function(part: go.Part): void {
        // Remove tool-related adornments from selected part (if any) for disabled tools
        if (!linkShiftingTool.isEnabled) {
          part.removeAdornment('LinkShiftingFrom');
          part.removeAdornment('LinkShiftingTo');
        }
        if (!part.diagram.toolManager.linkReshapingTool.isEnabled) {
          part.removeAdornment('LinkReshaping');
        }

        if (!part.diagram.toolManager.resizingTool.isEnabled) {
          part.removeAdornment('Resizing');
        }

        // Add tool-related adornments to selected link (if any) for enabled tools
        part.updateAdornments();
      });
    }

    if (changes.workPackageIsEditable) {
      const toolManager = this.diagram.toolManager;
      const allowEdit = this.workPackageIsEditable && ![Level.sources, Level.targets].includes(this.viewLevel);

      toolManager.relinkingTool.isEnabled = allowEdit;

      this.diagram.selection.each(function(part) {
        // Remove tool-related adornments from selected link (if any) for disabled tools
        if (!toolManager.relinkingTool.isEnabled) {
          part.removeAdornment('RelinkFrom');
          part.removeAdornment('RelinkTo');
        }

        // Add tool-related adornments to selected link (if any) for enabled tools
        part.updateAdornments();
      });

      this.diagram.allowDelete = allowEdit;

      this.diagramStructureChangesService.diagramEditable = allowEdit;
    }

    if (changes.viewLevel && changes.viewLevel.currentValue !== changes.viewLevel.previousValue) {
      this.diagramStructureChangesService.diagramEditable =
        this.workPackageIsEditable && ![Level.sources, Level.targets].includes(this.viewLevel);

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
      const nodesHasBeenChanged =
        changes.nodes && JSON.stringify(changes.nodes.currentValue) !== JSON.stringify(changes.nodes.previousValue);

      const linksHasBeenChanged =
        changes.links && JSON.stringify(changes.links.currentValue) !== JSON.stringify(changes.links.previousValue);

      const nodeKeyProp = this.diagram.model.nodeKeyProperty as string;

      const prevSelectedIds = this.diagram.selection.toArray().map(
        function(part: go.Part): string {return part.key as string; }
      );

      if (nodesHasBeenChanged) {
        this.diagramStructureChangesService.updateNodes(this.diagram, this.nodes);

        const nodeIds = this.nodes.map((node: any) => node[nodeKeyProp]);
        this.diagramStructureChangesService.updateLinks(this.diagram, this.links, nodeIds);

        this.diagram.startTransaction('Update link workpackage colours');
        this.diagram.links.each(function(link) {
          link.updateTargetBindings('impactedByWorkPackages');
        });
        this.diagram.commitTransaction('Update link workpackage colours');
      }
      if (linksHasBeenChanged) {
        const nodeIds = this.nodes.map((node: any) => node[nodeKeyProp]);

        this.diagramStructureChangesService.updateLinks(this.diagram, this.links, nodeIds);
      }
      if (nodesHasBeenChanged || linksHasBeenChanged) {
        // Preserve selection on update node or link arrays
        this.diagramUtilitiesService.preserveSelection(this.diagram, prevSelectedIds);
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

  getDiagramImage(): void {
    this.diagramImageService.downloadImage(this.diagram);
  }
}
