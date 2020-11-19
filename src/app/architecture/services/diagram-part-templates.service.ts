import * as go from 'gojs';
import '@app/architecture/official-gojs-extensions/Figures';
import {
  layers,
  bottomOptions,
  nodeCategories
} from '@app/architecture/store/models/node.model';
import {Injectable} from '@angular/core';
import {DiagramLevelService, Level} from './diagram-level.service';
import {Store} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/core/store';
import {getFilterLevelQueryParams} from '@app/core/store/selectors/route.selectors';
import {Subject} from 'rxjs';
import { linkCategories } from '../store/models/node-link.model';
import {colourOptions,
  NodeColoursDark,
  NodeColoursLight
} from '@app/architecture/store/models/layout.model';
import {PackedLayout} from '@app/architecture/official-gojs-extensions/PackedLayout';
import {CustomLayoutService} from '@app/architecture/services/custom-layout-service';
import {DiagramUtilitiesService} from '@app/architecture/services/diagram-utilities-service';
import {DiagramPanelTemplatesService} from '@app/architecture/services/diagram-panel-templates.service';
import {ContextMenuService, SimpleButtonArguments} from '@app/architecture/services/context-menu-service';
import {DiagramLayoutChangesService} from '@app/architecture/services/diagram-layout-changes.service';
import {CustomLink, DiagramStructureChangesService} from '@app/architecture/services/diagram-structure-changes.service';
import {DiagramViewChangesService} from '@app/architecture/services/diagram-view-changes.service';

const $ = go.GraphObject.make;

let thisService: DiagramPartTemplatesService;
const containerColour = '#F8C195';

/*
This service provides the templates used to define each category part used in the diagram.
Parts are the top-level of gojs diagram objects and include nodes, links, context menus and
 the part for showing instructions in empty diagrams.
*/

@Injectable()
export class DiagramPartTemplatesService {
  private currentFilterLevel: Level;
  public forPalette = false;

  // Observable to indicate that a child is to be added to a node
  private addChildSource = new Subject();
  public addChild$ = this.addChildSource.asObservable();

  constructor(
    private store: Store<RouterReducerState<RouterStateUrl>>,
    private diagramLevelService: DiagramLevelService,
    private diagramLayoutChangesService: DiagramLayoutChangesService,
    private diagramStructureChangesService: DiagramStructureChangesService,
    private diagramViewChangesService: DiagramViewChangesService,
    private customLayoutService: CustomLayoutService,
    private diagramUtilitiesService: DiagramUtilitiesService,
    private diagramPanelTemplatesService: DiagramPanelTemplatesService,
    private contextMenuService: ContextMenuService
  ) {
    thisService = this;
    thisService.store.select(getFilterLevelQueryParams).subscribe(filterLevel => (thisService.currentFilterLevel = filterLevel));
  }

  // Get standard options used for nodes
  getStandardNodeOptions(forPalette: boolean): object {
    return Object.assign(
      {
        selectionAdorned: true,
        isShadowed: true,
        resizable: true,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        locationObjectName: 'location panel'
      },
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: thisService.getNodeContextMenu()
          }
        : {}
    );
  }

  // Get standard options used for node shapes
  getStandardNodeShapeOptions(): object {
    return {
      figure: 'RoundedRectangle',
      fill: 'white',
      stroke: 'black',
      strokeWidth: 1,
      portId: '',
      fromLinkable: true,
      toLinkable: true,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides,
      fromLinkableSelfNode: false,
      toLinkableSelfNode: false,
      fromLinkableDuplicates: true,
      toLinkableDuplicates: true,
      name: 'shape',
      minSize: new go.Size(300, NaN)
    };
  }

  // Get standard options used for links
  getStandardLinkOptions(forPalette: boolean): object {
    return Object.assign(
      {
        selectionAdorned: true,
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver,
        relinkableFrom: true,
        relinkableTo: true,
        fromEndSegmentLength: 10,
        toEndSegmentLength: 10,
        // Position by layout in palette
        isLayoutPositioned: forPalette
      },
      forPalette
        ? {
            // Correct locationSpot on selection highlight adornment when link in palette
            selectionAdornmentTemplate: $(
              go.Adornment,
              'Link',
              new go.Binding('locationSpot', '', function(linkData): go.Spot {
                if (linkData.from || linkData.to) {
                  return go.Spot.TopLeft;
                } else if (linkData.category === linkCategories.data) {
                  return new go.Spot(0.5, 0, 10, 0);
                } else if (linkData.category === linkCategories.masterData) {
                  return new go.Spot(0.5, 0, 50, 0);
                }
              }),
              $(go.Shape, {
                isPanelMain: true,
                fill: null,
                stroke: 'dodgerblue',
                strokeWidth: 3
              })
            ),
            toolTip: $(
              'ToolTip',
              $(
                go.TextBlock,
                {
                  width: 150
                },
                new go.Binding('text', 'tooltip')
              )
            )
          }
        : {
            // Enable context menu for links not in the palette
            contextMenu: thisService.getLinkContextMenu()
          }
    );
  }




  getTransformationNodeTemplate(forPalette: boolean = false): go.Node {
    return $(
      go.Node,
      'Auto',
      {
        layerName: 'Foreground'
      },
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      thisService.getStandardNodeOptions(forPalette),
      {
        contextMenu: thisService.getLinkContextMenu(),
        doubleClick: (forPalette) ? undefined : thisService.diagramLevelService.displayMapView,
        selectionObjectName: 'shape',
        resizable: false
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return thisService.diagramLevelService.isInStandardLevel() ||
            thisService.diagramLevelService.isInMapView();
        }
      ),
      forPalette ? {
        toolTip: $(
          'ToolTip',
          $(
            go.TextBlock,
            {
              width: 150
            },
            new go.Binding('text', 'tooltip')
          )
        )
      } : {},
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing', function(locationMissing) {
        return locationMissing || thisService.diagramLevelService.isInEndPointView();
      }),
      $(go.Panel,
        'Vertical',
        $(go.Panel,
          'Auto',
          $(go.Shape,
            thisService.getStandardNodeShapeOptions(),
            {
              desiredSize: new go.Size(60.3, 53.6),
              minSize: new go.Size(60.3, 53.6),
              name: 'shape'
            },
            new go.Binding(
              'stroke',
              'colour',
              function(colour) {
                return NodeColoursDark[colour];
              }
            ),
            new go.Binding(
              'fill',
              'colour',
              function(colour) {
                return NodeColoursLight[colour];
              }
            )
          ),
          $(go.Picture,
            {
              source: 'assets/node-icons/transformation.svg',
              alignment: go.Spot.Center,
              maxSize: new go.Size(82, 82),
              imageStretch: go.GraphObject.Uniform
            }
          ),
          thisService.diagramPanelTemplatesService.getDependencyExpandButton(true)
        ),
        !forPalette ? $(go.Shape,
          'LineV',
          {
            margin: -1.51,
            height: 5,
            strokeWidth: 3,
            stroke: 'black'
          },
          new go.Binding('stroke', 'colour',
            function(colour) {
              return NodeColoursDark[colour];
            }
          ),
          new go.Binding('visible').ofObject('label')
        ) : {},
        forPalette ? thisService.diagramPanelTemplatesService.getLabelForTransformation()
          : thisService.diagramPanelTemplatesService.getLinkLabel()
      ),
      // Dummy panel with no size and no contents.
      // Used to ensure node usage view lays out nodes vertically aligned.
      $(go.Panel, {
        alignment: go.Spot.TopCenter,
        desiredSize: new go.Size(0, 0),
        name: 'location panel'
      })
    );
  }

  getNodeTemplate(forPalette: boolean = false): go.Node {
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      thisService.getStandardNodeOptions(forPalette),
      {
        resizeObjectName: 'content table',
        doubleClick: function() {
          thisService.diagramViewChangesService.showRightPanelTabSource.next();
        }
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return thisService.diagramLevelService.isInStandardLevel() ||
            thisService.diagramLevelService.isInMapView();
        }
      ),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: thisService.getNodeContextMenu(false)
          }
        : {
            toolTip: $(
              'ToolTip',
              $(
                go.TextBlock,
                {
                  width: 150
                },
                new go.Binding('text', 'tooltip')
              )
            )
          },
      // Have the diagram position the node if no location set or in node usage, sources or targets view
      new go.Binding('isLayoutPositioned', 'locationMissing', function(locationMissing) {
        return locationMissing || [Level.usage, Level.sources, Level.targets].includes(thisService.diagramLevelService.currentLevel);
      }),
      $(
        go.Shape,
        new go.Binding(
          'stroke',
          'colour',
          function(colour) {
            return NodeColoursDark[colour];
          }
        ),
        new go.Binding(
          'fill',
          'colour',
          function(colour) {
            return NodeColoursLight[colour];
          }
        ),
        new go.Binding('fromSpot', 'group', function(group) {
          if (group) {
            return go.Spot.LeftRightSides;
          } else {
            return go.Spot.AllSides;
          }
        }),
        new go.Binding('toSpot', 'group', function(group) {
          if (group) {
            return go.Spot.LeftRightSides;
          } else {
            return go.Spot.AllSides;
          }
        }),
        thisService.getStandardNodeShapeOptions()
      ),
      // Dummy panel with no size and no contents.
      // Used to ensure node usage view lays out nodes vertically aligned.
      $(go.Panel, {
        alignment: go.Spot.TopCenter,
        desiredSize: new go.Size(0, 0),
        name: 'location panel'
      }),
      $(
        go.Panel,
        'Table',
        {
          name: 'content table',
          defaultRowSeparatorStroke: 'black',
          desiredSize: new go.Size(310, 40),
          minSize: new go.Size(310, 40),
        },
        new go.Binding('minSize', '', function(data) {
          let minHeight = 40;
          if (data.middleExpanded) {
            minHeight += 70;
          }
          if (data.bottomExpanded === bottomOptions.children) {
            minHeight += 30.43 * data.descendants.length;
            minHeight += 35;
          }
          return new go.Size(310, minHeight);
        }),
        new go.Binding('desiredSize', 'areaSize', go.Size.parse).makeTwoWay(go.Size.stringify),
        $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None}),
        $(go.RowColumnDefinition, { row: 1, sizing: go.RowColumnDefinition.None}),
        $(go.RowColumnDefinition,
          {
            row: 2,
            sizing: go.RowColumnDefinition.ProportionalExtra,
            stretch: go.GraphObject.Fill
          }
        ),
        new go.Binding(
          'defaultRowSeparatorStroke',
          'colour',
          function(colour) {
            return NodeColoursDark[colour];
          }
        ),
        thisService.diagramPanelTemplatesService.getTopSection(),
        thisService.diagramPanelTemplatesService.getMiddleSection(),
        thisService.diagramPanelTemplatesService.getBottomSection()
      )
    );
  }

  getStandardGroupTemplate(forPalette: boolean = false): go.Group {
    return $(
      go.Group,
      'Vertical',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      thisService.getStandardNodeOptions(forPalette),
      {
        layout: $(thisService.customLayoutService.standardGroupLayout,
          {
            isOngoing: false,
            isInitial: true,
            spacing: 12,
            packShape: PackedLayout.Rectangular,
            packMode: PackedLayout.Fit
          }
        ),
        subGraphExpandedChanged: thisService.diagramLayoutChangesService.groupSubGraphExpandChanged,
        selectionObjectName: 'main content',
        resizeObjectName: 'content table',
        doubleClick: function() {
          thisService.diagramViewChangesService.showRightPanelTabSource.next();
        },
        dragComputation: function(part, pt, gridpt) {
          // don't constrain top-level nodes
          const grp = part.containingGroup;
          // try to stay within the background Shape of the Group
          const back = grp ? grp.findObject('Group member area') : null;
          if (back === null) { return pt; }
          const p1 = back.getDocumentPoint(go.Spot.TopLeft);
          const p2 = back.getDocumentPoint(go.Spot.BottomRight);
          const b = part.actualBounds;
          const loc = part.location;

          p1.offset(loc.x - b.x, loc.y - b.y);
          p2.offset(loc.x - b.x, loc.y - b.y);

          // now limit the location appropriately
          const x = Math.max(p1.x, Math.min(pt.x, p2.x - b.width - 1));
          const y = Math.max(p1.y, Math.min(pt.y, p2.y - b.height - 1));

          return new go.Point(x, y);
        },
        // Update cursor when dragging a node over the group.
        // Indicates that node can be dropped to add it to the group.
        mouseDragEnter: function(event, thisNode, previous) {
          const draggingTool = event.diagram.toolManager.draggingTool;
          const groupableNode = thisService.diagramUtilitiesService.getGroupableDraggedNode(draggingTool);

          if (thisNode.data.layer === layers.system
            && thisService.diagramStructureChangesService.diagramEditable
            && groupableNode
          ) {
            event.diagram.currentCursor = `url(assets/cursors/cursor_plus.svg), default`;
          }
        },
        // Reset cursor on dragging node back outside of the node
        mouseDragLeave: function(event, thisNode, next) {
          if (next && next.part instanceof go.Group) {
            return;
          }
          event.diagram.currentCursor = 'copy';
        }
      },
      new go.Binding('isSubGraphExpanded', 'bottomExpanded',
        function(bottomExpanded): boolean {
          return bottomExpanded === bottomOptions.group;
        }
      ),
      new go.Binding(
        'movable',
        '',
        function() {
          return thisService.diagramLevelService.isInStandardLevel() ||
            thisService.diagramLevelService.isInMapView();
        }
      ),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: thisService.getNodeContextMenu(false)
          }
        : {
            toolTip: $(
              'ToolTip',
              $(
                go.TextBlock,
                {
                  width: 150
                },
                new go.Binding('text', 'tooltip')
              )
            )
          },
      // Have the diagram position the node if no location set or in node usage, sources or targets view
      new go.Binding('isLayoutPositioned', 'locationMissing', function(locationMissing) {
        return locationMissing || [Level.usage, Level.sources, Level.targets].includes(thisService.diagramLevelService.currentLevel);
      }),
      new go.Binding('background', 'system', function(system) {
        return system ? containerColour : null;
      }),
      $(go.TextBlock,
        thisService.diagramUtilitiesService.textFont('bold 20px'),
        {
          textAlign: 'center',
          stroke: 'black',
          alignment: go.Spot.TopCenter,
          stretch: go.GraphObject.Horizontal,
          overflow: go.TextBlock.OverflowEllipsis,
          wrap: go.TextBlock.None,
          visible: false,
          margin: new go.Margin(10, 10, 0, 10)
        },
        new go.Binding('text', 'system', function(system) {
          return system ? system.name : '';
        }),
        // Invisible when no system
        new go.Binding('visible', 'system', function(system) {
          return !!system;
        })
      ),
      $(go.Panel, 'Auto',
        // Shape to be the port to connect links to. Ensures that
        //  links only try to connect to the node if dragged to
        //  the edges
        $(go.Shape,
          'FramedRectangle',
          {
            parameter1: 0,
            parameter2: 0,
            stroke: null,
            fill: null,
            figure: 'FramedRectangle',
            strokeWidth: 1,
            portId: '',
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
            fromLinkableSelfNode: false,
            toLinkableSelfNode: false,
            fromLinkableDuplicates: true,
            toLinkableDuplicates: true
          }
        ),
        $(go.Panel, 'Auto',
          {
            name: 'main content'
          },
          new go.Binding('margin', 'system', function (system) {
            return system ? 10 : 0;
          }),
          $(go.Shape,
            'RoundedRectangle',
            {
              fill: 'white',
              stroke: 'black',
              strokeWidth: 1,
              shadowVisible: true
            },
            new go.Binding(
              'stroke',
              'colour',
              function(colour) {
                return NodeColoursDark[colour];
              }
            ),
            new go.Binding(
              'fill',
              'colour',
              function(colour) {
                return NodeColoursLight[colour];
              }
            )
          ),
          // Dummy panel with no size and no contents.
          // Used to ensure node usage view lays out nodes vertically aligned.
          $(go.Panel, {
            alignment: go.Spot.TopCenter,
            desiredSize: new go.Size(0, 0),
            name: 'location panel'
          }),
          $(
            go.Panel,
            'Table',
            {
              name: 'content table',
              defaultRowSeparatorStroke: 'black',
              desiredSize: new go.Size(310, 40),
              minSize: new go.Size(310, 40)
            },
            $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None}),
            $(go.RowColumnDefinition, { row: 1, sizing: go.RowColumnDefinition.None}),
            $(go.RowColumnDefinition,
              {
                row: 2,
                sizing: go.RowColumnDefinition.ProportionalExtra,
                stretch: go.GraphObject.Fill
              },
              new go.Binding('separatorStroke', 'bottomExpanded',
                function(bottom: bottomOptions): go.BrushLike {
                  return bottom === bottomOptions.group ? null : 'transparent';
                }
              )
            ),
            new go.Binding('minSize', '', function(data) {
              let minHeight = 40;
              let minWidth = 310;
              if (data.middleExpanded) {
                minHeight += 70;
              }
              if (data.bottomExpanded === bottomOptions.children) {
                minHeight += 30.43 * data.descendants.length;
                minHeight += 35;
              } else if (data.bottomExpanded === bottomOptions.groupList) {
                minHeight += 30.43 * data.members.length;
                minHeight += 35;
              } else if (data.bottomExpanded === bottomOptions.group) {
                minHeight += 62;
                minWidth += 20;
              }
              return new go.Size(minWidth, minHeight);
            }),
            new go.Binding('desiredSize', 'areaSize', go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding(
              'defaultRowSeparatorStroke',
              'colour',
              function(colour) {
                return NodeColoursDark[colour];
              }
            ),
            thisService.diagramPanelTemplatesService.getTopSection(
              forPalette,
              true,
              thisService.getNodeContextMenu.bind(thisService, true)
            ),
            thisService.diagramPanelTemplatesService.getMiddleSection(true),
            thisService.diagramPanelTemplatesService.getBottomSection()
          )
        )
      )
    );
  }

  getStandardLinkTemplate(forPalette: boolean = false): CustomLink {
    return $(
      CustomLink,
      new go.Binding('points', 'route').makeTwoWay(function(points) {
        const PointArray = points.toArray();
        const Path = [];

        for (let i = 0; i < PointArray.length; i++) {
          Path.push(PointArray[i].x);
          Path.push(PointArray[i].y);
        }
        return Path;
      }),
      forPalette ?
        // Set locationSpot in order for palette to arrange link correctly
        new go.Binding('locationSpot', '', function(linkData): go.Spot {
          return (linkData.from || linkData.to) ? go.Spot.TopLeft : go.Spot.TopCenter;
        }) : {},
      new go.Binding('relinkableFrom', '', function(linkData): boolean {
        return !(thisService.diagramLevelService.isInMapView()
          || thisService.diagramLevelService.isInEndPointView())
          || !!linkData.isTemporary;
      }),
      new go.Binding('relinkableTo', '', function(linkData): boolean {
        return !(thisService.diagramLevelService.isInMapView()
          || thisService.diagramLevelService.isInEndPointView())
          || !!linkData.isTemporary;
      }),
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'strokeWidth', function(width: number): boolean {
        return width !== 0;
      }).ofObject('shape'),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing', function(routeMissing) {
        return routeMissing || thisService.diagramLevelService.isInEndPointView();
      }),
      new go.Binding('fromSpot', 'fromSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
      new go.Binding('toSpot', 'toSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
      thisService.getStandardLinkOptions(forPalette),
      {
        doubleClick: function(event: go.InputEvent, object: go.Link): void {
          if (forPalette) {
            return;
          }

          if (object.data.layer !== layers.reportingConcept) {
            thisService.diagramLevelService.getMapViewForLink(event, object);
          }
        }
      },
      $(
        go.Shape,
        {
          name: 'shape',
          isPanelMain: true,
          stroke: 'Black',
          strokeWidth: 2.5
        },
        new go.Binding(
          'stroke',
          'colour',
          function(colour: string): string {
            return NodeColoursDark[colour];
          }
        ),
        new go.Binding('strokeDashArray', 'category', function(category: string): number[] {
          return category === linkCategories.masterData ? [5, 5] : [0];
        }),
        // On hide, set width to 0 instead of disabling visibility, so that link routes still calculate
        new go.Binding('strokeWidth', '', function(link: go.Link): number {
          const linkVisibleProp = link.category === linkCategories.data ? 'dataLinks' : 'masterDataLinks';
          return link.diagram.model.modelData[linkVisibleProp] ? 2.5 : 0;
        }).ofObject(),
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? { areaBackground: 'transparent' } : {}
      ),
      forPalette ? thisService.diagramPanelTemplatesService.getLinkLabelForPalette()
        : $(go.Panel, 'Auto',
        thisService.diagramPanelTemplatesService.getLinkLabel(),
        new go.Binding('visible', 'dataLinks').ofModel()
        ),
      $(
        go.Shape, // The 'to' arrowhead
        {
          scale: 1.2,
          toArrow: 'Triangle'
        },
        new go.Binding('fill', 'stroke').ofObject('shape'),
        new go.Binding('stroke', 'stroke').ofObject('shape'),
        new go.Binding('visible', 'strokeWidth',
          function(strokeWidth: number): boolean {
            return strokeWidth > 0;
          }
        ).ofObject('shape')
      )
    );
  }

  // Get template for copy links in map view
  getLinkCopyTemplate(): CustomLink {
    return $(
      CustomLink,
      thisService.getStandardLinkOptions(false),
      {
        relinkableFrom: false,
        relinkableTo: false,
        isLayoutPositioned: true
      },
      $(go.Shape, {
        name: 'shape',
        isPanelMain: true,
        stroke: 'Black',
        strokeWidth: 2.5,
        strokeDashArray: [2.5, 1.5]
      }),
      thisService.diagramPanelTemplatesService.getLinkLabel()
    );
  }

  getLinkParentChildTemplate() {
    return $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        selectable: false,
        isLayoutPositioned: true
      },
      $(go.Shape, {
        isPanelMain: true,
        stroke: 'black',
        strokeWidth: 1.5
      })
    );
  }

  // Template for links to unconnected sources/targets in sources/targets view
  getLinkWarningTemplate() {
    return $(
      go.Link,
      {
        selectable: false,
        isLayoutPositioned: true,
        routing: go.Link.Orthogonal,
        fromEndSegmentLength: 30 ,
        toEndSegmentLength: 30
      },
      $(go.Shape, {
        isPanelMain: true,
        stroke: 'transparent',
        strokeWidth: 0
      }),
      $(go.Panel, 'Vertical',
        {
          alignmentFocus: go.Spot.Center,
          segmentFraction: 1
        },
        new go.Binding('segmentIndex', '', function() {
          return thisService.diagramLevelService.currentLevel === Level.sources ? 1 : -2;
        }),
        $(go.Panel, 'Auto',
          {
            margin: 5
          },
          $(go.Shape, {
            figure: 'triangle',
            fill: 'yellow',
            stroke: 'black',
            desiredSize: new go.Size(40, 40)
          }),
          $(go.TextBlock,
            thisService.diagramUtilitiesService.textFont('bold 30px'),
            {
              text: '!',
              margin: new go.Margin(0, 0, 10, 0)
            }
          )
        ),
        $(go.Panel, 'Auto',
          {
            background: 'black',
            padding: 1
          },
          $(go.Shape,
            {
              fill: 'white'
            }
          ),
          $(go.TextBlock,
            thisService.diagramUtilitiesService.textFont('15px'),
            {
              text: 'No link found',
              textAlign: 'center',
              margin: 2
            }
          )
        )
      )
    );
  }

  getMapViewGroupTemplate(): go.Group {
    // Template for groups in mapping view
    return $(
      go.Group,
      'Vertical',
      {
        layout: $(go.GridLayout, {
          wrappingColumn: 1,
          spacing: new go.Size(NaN, 20),
          alignment: go.GridLayout.Location,
          isOngoing: true,
          isInitial: true,
          // Function to compare nodes for ordering during layout
          comparer: function(a, b) {
            // Only perform this comparison for initial layout. This prevents users' reordering of nodes from being overridden.
            if (thisService.diagramLevelService.groupLayoutInitial) {
              if (isNaN(a.data.sortOrder) || isNaN(b.data.sortOrder)) {
                return 0;
              } else if (a.data.sortOrder < b.data.sortOrder) {
                return -1;
              } else if (a.data.sortOrder > b.data.sortOrder) {
                return 1;
              } else {
                return 0;
              }
            }

            // Can reorder Reporting concepts
            const ay = a.location.y;
            const by = b.location.y;
            if (isNaN(ay) || isNaN(by)) {
              return 0;
            }
            if (ay < by) {
              return -1;
            }
            if (ay > by) {
              return 1;
            }
            return 0;
          }
        }),
        background: containerColour,
        computesBoundsAfterDrag: true,
        computesBoundsIncludingLocation: false,
        computesBoundsIncludingLinks: false,
        locationSpot: new go.Spot(0.5, 0, 0, -30),
        isLayoutPositioned: true,
        layoutConditions: go.Part.LayoutStandard,
        selectable: false,
        avoidable: false,
        padding: 0
      },
      new go.Binding('location', 'location', go.Point.parse),
      // No padding when containing data structure is not shown.
      //  Ensures that data structure panel is not shown.
      new go.Binding('padding', 'dataStructure', function(dataStructure) {
        return dataStructure ? 7 : 0;
      }),
      $(go.TextBlock,
        thisService.diagramUtilitiesService.textFont('bold 25px'),
        {
          textAlign: 'center',
          stroke: 'black',
          alignment: go.Spot.TopCenter,
          stretch: go.GraphObject.Horizontal,
          overflow: go.TextBlock.OverflowEllipsis,
          wrap: go.TextBlock.None,
          visible: false,
          margin: 10
        },
        new go.Binding('text', 'dataStructure', function(dataStructure) {
          return dataStructure ? dataStructure.name : '';
        }),
        // Invisible when no data structure
        new go.Binding('visible', 'dataStructure', function(dataStructure) {
          return !!dataStructure;
        })
      ),
      $(
        go.Panel,
        'Vertical',
        {
          minSize: new go.Size(300, 0)
        },
        $(
          go.Panel,
          'Auto',
          { stretch: go.GraphObject.Fill },
          $(go.Shape, {
            fill: '#ebe9ea',
            strokeWidth: 0,
            name: 'shape'
          }),
          $(
            go.Panel,
            'Vertical',
            { margin: 10 },
            $(
              go.TextBlock,
              thisService.diagramUtilitiesService.textFont('bold 20px'),
              {
                textAlign: 'center',
                stroke: 'black',
                alignment: go.Spot.TopCenter,
                stretch: go.GraphObject.Horizontal,
                overflow: go.TextBlock.OverflowEllipsis,
                wrap: go.TextBlock.None
              },
              new go.Binding('text', 'name')
            ),
            $(go.Placeholder, { alignment: go.Spot.TopCenter }),
            $('Button',
              {
                name: 'addChildButton',
                alignment: go.Spot.BottomCenter,
                margin: new go.Margin(15, 5, 0, 5),
                click: function(event: go.InputEvent, button: go.Panel): void {
                  thisService.addChildSource.next(button.part.data);
                }
              },
              // Disable button if moves not allowed in diagram
              new go.Binding('isEnabled', '', function(data): boolean {

                // Disallow adding children to nodes that inherit their children
                if (data.category === nodeCategories.dataSet ||
                  data.category === nodeCategories.masterDataSet) {
                  return false;
                }

                return thisService.diagramStructureChangesService.diagramEditable;
              }),
              // Hide child button for grouped data nodes
              new go.Binding('visible', 'dataStructure', function(dataStructure) {
                return !dataStructure;
              }),
              $(go.TextBlock, thisService.diagramUtilitiesService.textFont('bold 22px'), '+',
                {
                  alignment: go.Spot.Center,
                  desiredSize: new go.Size(300, 30),
                  textAlign: 'center',
                  verticalAlignment: go.Spot.Center
                },
                new go.Binding('stroke', 'isEnabled', function(enabled: boolean): string {
                  return enabled ? 'black' : '#AAAFB4';
                }).ofObject('addChildButton')
              ),
            )
          )
        )
      ),
      $('Button',
        {
          name: 'addDataStructureChildButton',
          alignment: go.Spot.BottomCenter,
          margin: new go.Margin(15, 5, 10, 5),
          visible: false,
          click: function(event: go.InputEvent, button: go.Panel): void {
            thisService.addChildSource.next(button.part.data.dataStructure);
          }
        },
        // Disable button if moves not allowed in diagram
        new go.Binding('isEnabled', '', function(): boolean {
          return thisService.diagramStructureChangesService.diagramEditable;
        }),
        // Invisible when no data structure
        new go.Binding('visible', 'dataStructure', function(dataStructure): boolean {
          return !!dataStructure;
        }),
        $(go.TextBlock, thisService.diagramUtilitiesService.textFont('bold 26px'), '+',
          {
            alignment: go.Spot.Center,
            desiredSize: new go.Size(310, 40),
            textAlign: 'center',
            verticalAlignment: go.Spot.Center,
          },
          new go.Binding('stroke', 'isEnabled', function(enabled: boolean): string {
            return enabled ? 'black' : '#AAAFB4';
          }).ofObject('addDataStructureChildButton')
        ),
      )
    );
  }

  getBackgroundContextMenu() {
    const buttons = [
      {
        text: 'Enable/Disable Grid',
        action: function(): void {
          thisService.diagramViewChangesService.showHideGridSource.next();
        }
      },
      {
        text: 'Zoom in',
        action: function(): void {
          thisService.diagramViewChangesService.zoomSource.next('In');
        }
      },
      {
        text: 'Zoom out',
        action: function(): void {
          thisService.diagramViewChangesService.zoomSource.next('Out');
        }
      },
      {
        text: 'Reorganise',
        action: function(diagram: go.Diagram): void {
          thisService.diagramLayoutChangesService.reorganise(diagram);
        },
        enabledPredicate: function(): boolean {
          return thisService.diagramLayoutChangesService.layoutEditable;
        }
      },
      {
        text: 'Reorganise Links',
        action: function(diagram: go.Diagram): void {
          thisService.diagramLayoutChangesService.reorganiseLinks(diagram);
        },
        enabledPredicate: function(): boolean {
          return thisService.diagramLayoutChangesService.layoutEditable;
        }
      }
    ];

    return thisService.contextMenuService.createSimpleContextMenu(buttons);
  }

  getNodeContextMenu(fixedPosition = false) {

    const editingLayout = function(): boolean {
      return thisService.diagramLayoutChangesService.layoutEditable;
    };

    function colourChangeButtonArgs(colour: string): SimpleButtonArguments {
      return {
        text: colour,
        action: function(node: go.Node): void {
          thisService.diagramLayoutChangesService.changeColours(node.diagram, colourOptions[colour.toLowerCase()]);
        },
        enabledPredicate: editingLayout
      };
    }

    const buttons = [
      {
        text: 'Show Status',
        action: function(node: go.Node): void {
          thisService.diagramLayoutChangesService.changeStatusForSelection(node.diagram);
        },
        enabledPredicate: editingLayout,
        textPredicate: function(node: go.Node): string {
          const anyStatusHidden = node.diagram.selection.any(
            function (part: go.Part): boolean {
              if ((part instanceof go.Node) && part.category !== nodeCategories.transformation) {
                return !part.data.middleExpanded;
              } else {
                return !part.data.showLabel;
              }
            }
          );
          return anyStatusHidden ? 'Show Status' : 'Hide Status';
        }
      },
      {
        text: 'View Detail',
        action: function(): void {
          thisService.diagramViewChangesService.showRightPanelTabSource.next();
        }
      },
      {
        text: 'Change Colour',
        subButtonArguments: [
          'Blue',
          'Red',
          'Green',
          'Purple',
          'Orange',
          'None'
        ].map(colourChangeButtonArgs),
        enabledPredicate: editingLayout
      },
      {
        text: 'Grouped Components',
        subButtonArguments: [
          {
            text: 'Expand',
            action: function(group: go.Group): void {
              const diagram = group.diagram;
              const anyCollapsed = diagram.selection.any(function(part: go.Part): boolean {
                if (part instanceof go.Group) {
                  return !part.isSubGraphExpanded;
                }
                return false;
              });

              diagram.selection.each(function(part: go.Part): void {
                if (part instanceof go.Group) {
                  diagram.model.setDataProperty(part.data, 'middleExpanded', true);

                  const newState = anyCollapsed ? bottomOptions.group : bottomOptions.none;
                  diagram.model.setDataProperty(part.data, 'bottomExpanded', newState);

                  thisService.diagramLayoutChangesService.nodeExpandChanged(part);
                }
              });
            },
            enabledPredicate: editingLayout,
            textPredicate: function(group: go.Group): string {
              const anyCollapsed = group.diagram.selection.any(function(part: go.Part): boolean {
                if (part instanceof go.Group) {
                  return !part.isSubGraphExpanded;
                }
                return false;
              });
              return anyCollapsed ? 'Expand' : 'Collapse';
            },
            visiblePredicate: function(node: go.Node) {
              return node instanceof go.Group;
            }
          },
          {
            text: 'Show as List (groups)',
            action: function(group: go.Node): void {
              const diagram = group.diagram;
              const anyHidden = diagram.selection.any(function(part: go.Part): boolean {
                if (part instanceof go.Group) {
                  return part.data.bottomExpanded !== bottomOptions.groupList;
                }
                return false;
              });

              diagram.selection.each(function(part: go.Part): void {
                if (part instanceof go.Group) {
                  const newState = anyHidden ? bottomOptions.groupList : bottomOptions.none;
                  diagram.model.setDataProperty(part.data, 'middleExpanded', true);
                  diagram.model.setDataProperty(part.data, 'bottomExpanded', newState);

                  thisService.diagramLayoutChangesService.nodeExpandChanged(part);
                }
              });
            },
            enabledPredicate: editingLayout,
            textPredicate: function(group: go.Node): string {
              const anyHidden = group.diagram.selection.any(function(part: go.Part): boolean {
                if (part instanceof go.Group) {
                  return part.data.bottomExpanded !== bottomOptions.groupList;
                }
                return false;
              });
              return anyHidden ? 'Show as List' : 'Hide List';
            }
          },
          {
            text: 'Display (groups)',
            action: function(group: go.Group): void {
              thisService.diagramLevelService.displayGroupMembers(group);
            },
            enabledPredicate: function(group: go.Group): boolean {
              return group.diagram.selection.count === 1;
            },
            textPredicate: function() {
              return 'Display';
            }
          },
          {
            text: 'Add Sub-item',
            action: function(group: go.Group): void {
              if (group.data.layer === layers.data) {
                thisService.diagramStructureChangesService.addNewSharedSubItemSource.next(group.data);
              } else {
                thisService.diagramStructureChangesService.addNewSubItemSource.next(group.data);
              }
            },
            enabledPredicate: function(group: go.Group): boolean {

              if (group.diagram.selection.count !== 1) {
                return false;
              }

              return thisService.diagramStructureChangesService.diagramEditable &&
                thisService.diagramLevelService.currentLevel !== Level.usage &&
                !group.data.isShared;
            }
          },
          {
            text: 'Add to Group',
            action: function(group: go.Group): void {
              const selectedNodes = new go.Set<go.Group>();

              // Ignore links and transformation nodes when adding to new group
              group.diagram.selection.each(function(part: go.Part): void {
                if (part instanceof go.Group) {
                  selectedNodes.add(part);
                }
              });
              thisService.diagramStructureChangesService.addSystemToGroupSource.next(selectedNodes);
            },
            enabledPredicate: function(group: go.Group): boolean {
              return thisService.diagramStructureChangesService.diagramEditable &&
                thisService.diagramLevelService.currentLevel !== Level.usage &&
                group.data.layer !== layers.data;
            },
            textPredicate: function(group: go.Group): string {
              if (thisService.diagramLevelService.currentLevel === Level.system
                && group.diagram.selection.count > 1) {
                return 'Add/Move to Group';
              }

              return group.data.group ? 'Move to Group' : 'Add to Group';
            }
          }
        ]
      },
      {
        text: 'Child Nodes',
        visiblePredicate: function(node: go.Node): boolean {
          return node.data.layer !== layers.reportingConcept;
        },
        textPredicate: function(node: go.Node): string {
          if (node.data.layer === layers.data) {
            return 'Dimensions';
          } else if (node.data.layer === layers.dimension) {
            return 'Reporting Layer';
          } else {
            return 'Data Nodes';
          }
        },
        subButtonArguments: [
          {
            text: 'Show as List (child nodes)',
            action: function(node: go.Node): void {
              const diagram = node.diagram;
              const anyHidden = diagram.selection.any(function(part: go.Part): boolean {
                if (part instanceof go.Group) {
                  return part.data.bottomExpanded !== bottomOptions.children;
                }
                return false;
              });

              const newState = anyHidden ? bottomOptions.children : bottomOptions.none;

              diagram.selection.each(function(part: go.Part): void {

                if (part instanceof go.Node && part.data.category !== nodeCategories.transformation) {
                  diagram.model.setDataProperty(part.data, 'bottomExpanded', newState);
                  diagram.model.setDataProperty(part.data, 'middleExpanded', true);

                  thisService.diagramLayoutChangesService.nodeExpandChanged(part);
                }
              });

            },
            enabledPredicate: editingLayout,
            textPredicate: function(node: go.Node): string {
              const anyHidden = node.diagram.selection.any(function(part: go.Part): boolean {
                return part.data.bottomExpanded !== bottomOptions.children;
              });
              return anyHidden ? 'Show as List' : 'Hide List';
            }
          },
          {
            text: 'Display (child nodes)',
            action: function(node: go.Node): void {
              thisService.diagramLevelService.changeLevelWithFilter(node);
            },
            enabledPredicate: function(node: go.Node): boolean {
              return node.diagram.selection.count === 1;
            },
            textPredicate: function(): string {
              return 'Display';
            }
          },
          {
            text: 'Add child node',
            action: function(): void {
              thisService.diagramStructureChangesService.addChildNodeSource.next();
            },
            enabledPredicate: function(node: go.Node): boolean {
              if (node.diagram.selection.count !== 1) {
                return false;
              }
              return thisService.diagramStructureChangesService.diagramEditable &&
                ![nodeCategories.dataSet, nodeCategories.masterDataSet].includes(node.data.category);
            },
            textPredicate: function(node: go.Node): string {
              if (node.data.layer === layers.system) {
                return 'Add data node';
              } else if (node.data.layer === layers.data) {
                return 'Add dimension';
              } else {
                return 'Add reporting concept';
              }
            }
          }
        ]
      },
      {
        text: 'Analyse',
        enabledPredicate: function(node: go.Node): boolean {
          return node.diagram.selection.count === 1;
        },
        subButtonArguments: [
          {
            text: 'Dependencies',
            action: function(menuNode: go.Node): void {
              const anyHidden: boolean = menuNode.diagram.nodes.any(function(node: go.Node): boolean {
                return !node.visible;
              });

              if (anyHidden) {
                thisService.diagramViewChangesService.showAllNodes(menuNode.diagram);
              } else {
                thisService.diagramViewChangesService.hideNonDependencies(menuNode);
              }

            },
            enabledPredicate: function(): boolean {
              return !thisService.diagramLevelService.isInMapView();
            }
          },
          {
            text: 'Use Across Levels',
            action: function(node: go.Node): void {
              thisService.diagramLevelService.displayUsageView(node);
            },
            enabledPredicate: function(): boolean {
              return !thisService.diagramLevelService.isInMapView();
            }
          },
          {
            text: 'View Sources',
            action: function(node: go.Node): void {
              thisService.diagramLevelService.displaySourcesView(node);
            },
            visiblePredicate: function(node: go.Node): boolean {
              return [nodeCategories.dataSet, nodeCategories.masterDataSet].includes(node.data.category)
                && node.data.isShared;
            }
          },
          {
            text: 'View targets',
            action: function(node: go.Node): void {
              thisService.diagramLevelService.displayTargetsView(node);
            },
            visiblePredicate: function(node: go.Node): boolean {
              return [nodeCategories.dataSet, nodeCategories.masterDataSet].includes(node.data.category)
                && node.data.isShared;
            }
          }
        ]
      },
      {
        text: 'Set as Master',
        action: function(node: go.Node): void {
          thisService.diagramStructureChangesService.setAsMasterSource.next(node.data);
        },
        visiblePredicate: function(node: go.Node): boolean {
          return node.data.layer === layers.data;
        },
        enabledPredicate: function(node: go.Node): boolean {
          return thisService.diagramStructureChangesService.diagramEditable &&
            node.data.category !== nodeCategories.dataStructure &&
            node.data.isShared &&
            !node.containingGroup.data.isShared;
        }
      }
    ];

    return thisService.contextMenuService.createTwoLevelContextMenu('buttonMenu', buttons, fixedPosition);
  }

  getLinkContextMenu(): go.Adornment {

    function colourChangeButtonArgs(colour: string): SimpleButtonArguments {
      return {
        text: colour,
        action: function(link: go.Part): void {
          thisService.diagramLayoutChangesService.changeColours(link.diagram, colourOptions[colour.toLowerCase()]);
        },
        enabledPredicate: editingLayout
      };
    }

    const editingLayout = function(): boolean {
      return thisService.diagramLayoutChangesService.layoutEditable;
    };

    return thisService.contextMenuService.createTwoLevelContextMenu(
      'LinkMenu', [
        {
          text: 'Show Status',
          action: function(link: go.Part): void {
            thisService.diagramLayoutChangesService.changeStatusForSelection(link.diagram);
          },
          enabledPredicate: editingLayout,
          textPredicate: function(link: go.Link): string {
            const anyStatusHidden = link.diagram.selection.any(
              function (part: go.Part): boolean {
                if ((part instanceof go.Node) && part.category !== nodeCategories.transformation) {
                  return !part.data.middleExpanded;
                } else {
                  return !part.data.showLabel;
                }
              }
            );
            return anyStatusHidden ? 'Show Status' : 'Hide Status';
          }
        },
        {
          text: 'View Detail',
          action: function(): void {
            thisService.diagramViewChangesService.showRightPanelTabSource.next();
          }
        },
        {
          text: 'Change Colour',
          subButtonArguments: [
            'Blue',
            'Red',
            'Green',
            'Purple',
            'Orange',
            'None'
          ].map(colourChangeButtonArgs),
          enabledPredicate: editingLayout
        },
        {
          text: 'Expand',
          action: function(link: go.Part): void {
            link.doubleClick(new go.InputEvent(), link);
          },
          visiblePredicate: function(link: go.Part): boolean {
            // Cannot expand from the reporting layer
            return link.data.layer !== layers.reportingConcept;
          }
        }
      ]
    );
  }

  // returns the gojs object containing a guide with instructions for users
  getInstructions(): go.Part {

    return $(go.Part,
      'Horizontal',
      {
        name: 'Guide',
        selectable: false,
        layerName: 'Grid',
        padding: 10
      },
      $(go.TextBlock,
        thisService.diagramUtilitiesService.textFont('italic 30px'),
        {
          name: 'instructions',
          stroke: '#D6D6D6',
          textAlign: 'center'
        }
      )
    );
  }
}
