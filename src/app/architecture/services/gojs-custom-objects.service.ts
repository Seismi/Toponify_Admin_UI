import * as go from 'gojs';
import { LinkShiftingTool } from 'gojs/extensionsTS/LinkShiftingTool';
import {forwardRef, Inject, Injectable, OnDestroy} from '@angular/core';
import {DiagramLevelService, Level, lessDetailOrderMapping, moreDetailOrderMapping} from './diagram-level.service';
import { FilterService } from './filter.service';
import {Subject} from 'rxjs';
import {layers} from '@app/nodes/store/models/node.model';
import {linkCategories} from '@app/nodes/store/models/node-link.model';
import {DiagramChangesService} from '@app/architecture/services/diagram-changes.service';

const $ = go.GraphObject.make;

// Correct GoJS shapes with unwanted shadow behaviour
export function updateShapeShadows() {
  const shapesToCorrect = ['Cube2', 'Cylinder1', 'Process', 'InternalStorage'];

  shapesToCorrect.forEach(function(figure) {

    let figureDefinition = go.Shape.getFigureGenerators().getValue(figure);
    const definitionCopy = (figureDefinition as (a: go.Shape, b: number, c: number) => go.Geometry).bind(null);

    figureDefinition = function(shape, w, h) {

      // First, get standard shape generated by GoJS
      const resultShape = definitionCopy(shape, w, h);

      // Update shape to prevent shadows from appearing on it
      resultShape.figures.last().isShadowed = false;

      return resultShape;
    };

    // Apply updated figure generator definition
    go.Shape.defineFigureGenerator(figure, figureDefinition);

  });
}

// Customised link shifting tool that calls process to update the link route in the back end when finished
export class CustomLinkShift extends LinkShiftingTool {
  constructor() {
    super();
  }

  // Override mouseUp method
  public doMouseUp(): void {

    const shiftedLink = (this['_handle'].part as go.Adornment).adornedObject.part;
    this.diagram.raiseDiagramEvent('LinkReshaped', shiftedLink);

    LinkShiftingTool.prototype.doMouseUp.call(this);
  }

}

// Customised link that only updates its route when a tool that can affect link route is active
export class CustomLink extends go.Link {
  constructor() {
    super();
  }

  // Override computePoints method
  public computePoints(): boolean {

    // Leave link route as is if link is disconnected - prevents bug where links dragged from palette were flipping
    if (!this.fromNode && !this.toNode) {return true; }

    const toolManager = this.diagram.toolManager;
    const linkShiftingTool = toolManager.mouseDownTools.toArray().find(
      function(tool) {return tool.name === 'LinkShifting'; }
    );

    // Array of tools that can affect link routes
    const tools = [toolManager.draggingTool,
      toolManager.linkReshapingTool,
      toolManager.linkingTool,
      linkShiftingTool];

    // Always update route if "updateRoute" flag set or no route defined
    if (this.data.updateRoute || this.points.count === 0) {
      // Reset "updateRoute" flag
      this.diagram.model.setDataProperty(this.data, 'updateRoute', false);
      return go.Link.prototype.computePoints.call(this);
    }

    // Leave link route as it is if no tools active and link is not temporary
    if (!tools.some(function(tool) {return tool.isActive; })
      && !this.data.isTemporary) {
      return true;
    }

    // Call standard computePoints method
    return go.Link.prototype.computePoints.call(this);
  }
}

@Injectable()
export class GojsCustomObjectsService {

  // Observable to indicate that the detail tab should be displayed
  private showDetailTabSource = new Subject();
  public showDetailTab$ = this.showDetailTabSource.asObservable();
  // Observable to indicate that a new scope should be created for the selected node
  private createScopeWithNodeSource = new Subject();
  public createScopeWithNode$ = this.createScopeWithNodeSource.asObservable();
  // Observable to indicate that the grid display should be toggled
  private showHideGridSource = new Subject();
  public showHideGrid$ = this.showHideGridSource.asObservable();
  // Observable to indicate that the diagram should be zoomed in or out
  private zoomSource = new Subject();
  public zoom$ = this.zoomSource.asObservable();

  constructor(
    public filterService: FilterService,
    public diagramChangesService: DiagramChangesService,
    @Inject(forwardRef(function() {return DiagramLevelService; })) public diagramLevelService: DiagramLevelService
  ) {
  }

  // Context menu for when the background is right-clicked
  getBackgroundContextMenu(): go.Adornment {

    const thisService = this;

    return $(
      'ContextMenu',
      // Toggle the background grid on or off
      $('ContextMenuButton',
        $(go.TextBlock, 'Enable/Disable Grid', {}),
        {
          click: function(event, object) {
            thisService.showHideGridSource.next();
          }
        }
      ),
      // Zoom in a bit
      $('ContextMenuButton',
        $(go.TextBlock, 'Zoom in', {}),
        {
          click: function(event, object) {
            thisService.zoomSource.next('In');
          }
        }
      ),
      // Zoom out a bit
      $('ContextMenuButton',
        $(go.TextBlock, 'Zoom out', {}),
        {
          click: function(event, object) {
            thisService.zoomSource.next('Out');
          }
        }
      )
    );
  }

  // Context menu for when a node or link is right-clicked
  getPartContextMenu(): go.Adornment {

    const thisService = this;
    const diagramChangesService = this.diagramChangesService;

    return $(
      'ContextMenu',
      $('ContextMenuButton',
        $(go.TextBlock, 'Expand'),
        {
          click: function(event, object) {
            const part = (object.part as go.Adornment).adornedObject;
            part.doubleClick(event, part);
          }
        },
        new go.Binding('visible', '', function(object, event) {
          if (event.diagram.findNodeForData(object) !== null) {
            // Can only expand nodes if not reporting concept
            return object.layer !== layers.reportingConcept;
          } else {
            // Can only expand link if category is data and layer is data set
            return object.category === linkCategories.data &&
              object.layer === layers.dataSet;
          }
        })
      ),
      // View detail for the node/link in the right hand panel
      $('ContextMenuButton',
        $(go.TextBlock, 'View Detail', {}),
        {
          click: function(event, object) {
            thisService.showDetailTabSource.next();
          }
        }
      ),
      // Create a scope that includes the node
      $('ContextMenuButton',
        $(go.TextBlock, 'Create Scope', {}),
        {
          click: function(event, object) {
            thisService.createScopeWithNodeSource.next(object);
          }
        },
        new go.Binding('visible', '', function(object, event) {
          // Only show the create scope option for nodes
          return event.diagram.findNodeForData(object) !== null;
        })
      ),
      // Analyse dependencies of a node
      $('ContextMenuButton',
        $(go.TextBlock, 'Analyse Dependencies', {}),
        {
          click: function(event, object) {
            const part = (object.part as go.Adornment).adornedObject;
            diagramChangesService.hideNonDependencies(part as go.Node);
          }
        },
        new go.Binding('visible', '', function(object, event) {
          // Only show the analyse dependencies option for nodes..
          return event.diagram.findNodeForData(object) !== null &&
            // ..that are not in map view
            !object.group;
        })
      ),
      $('ContextMenuButton',
        $(go.TextBlock, 'Return to Architecture View', {}),
        {
          click: function(event, object) {
            diagramChangesService.showAllNodes(event.diagram);
          }
        },
        new go.Binding('visible', '', function(object, event) {
          // Only show the return to architecture option for nodes..
          return event.diagram.findNodeForData(object) !== null &&
            // ..and if some nodes in the diagram are hidden
            event.diagram.nodes.any(function(node) {
              return !node.visible;
            });
        })
      )
    );
  }

  // Create a linear gradient brush through the provided colours
  // Inputs:
  //    colours - array of colours to go through
  //    fromSpot - spot where brush should start
  //    toSpot - spot brush should end
  createCustomBrush(colours: string[], fromSpot = go.Spot.Top, toSpot = go.Spot.Bottom): go.Brush {

    // Replace any nulls in colours array with default black
    colours = colours.map(function(colour) {return colour || 'black'; });

    // Parameters for brush
    const newBrushParams: any = {};

    // -- Triple up colours in array in order to ensure less gradual --
    // -- transition between colours --
    const temp: string[] = [];

    colours.forEach(function(colour) {
      temp.push(colour);
      temp.push(colour);
      temp.push(colour);
    });

    colours = temp;

    // -- End of tripling up process --

    // Distribute points for colours evenly across the brush
    colours.forEach(function(colour, index) {
      newBrushParams[String(index / (colours.length - 1))] = colour;
    });

    // Set start and end spots for the brush
    newBrushParams.start = fromSpot;
    newBrushParams.end = toSpot;

    return $(go.Brush, 'Linear', newBrushParams);
  }
}
