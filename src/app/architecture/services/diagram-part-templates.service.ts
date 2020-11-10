import * as go from 'gojs';
import '@app/architecture/official-gojs-extensions/Figures';
import {
  layers,
  bottomOptions,
  nodeCategories,
  Tag,
  TagColour,
  WorkPackageImpact,
  GroupInfo
} from '@app/architecture/store/models/node.model';
import {Injectable} from '@angular/core';
import {CustomLink, defineRoundButton} from './gojs-custom-objects.service';
import {DiagramLevelService, Level} from './diagram-level.service';
import {DiagramChangesService} from '@app/architecture/services/diagram-changes.service';
import {Store} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/core/store';
import {getFilterLevelQueryParams} from '@app/core/store/selectors/route.selectors';
import {Subject} from 'rxjs';
import { linkCategories } from '../store/models/node-link.model';
import {colourOptions,
  NodeColoursDark,
  NodeColoursLight,
  NodeDetailTab
} from '@app/architecture/store/models/layout.model';
import {PackedLayout} from '@app/architecture/official-gojs-extensions/PackedLayout';
import {CustomLayoutService} from '@app/architecture/services/custom-layout-service';
import {DiagramUtilitiesService} from '@app/architecture/services/diagram-utilities-service';
import {DiagramPanelTemplatesService} from '@app/architecture/services/diagram-panel-templates.service';
import {ContextMenuService} from '@app/architecture/services/context-menu-service';

const $ = go.GraphObject.make;

// Create definition for button with round shape
defineRoundButton();

let thisService;
const containerColour = '#F8C195';

@Injectable()
export class DiagramPartTemplatesService {
  private currentFilterLevel: Level;
  public forPalette = false;

  // Observable to indicate that a child is to be added to a node
  private addChildSource = new Subject();
  public addChild$ = this.addChildSource.asObservable();

  constructor(
    private store: Store<RouterReducerState<RouterStateUrl>>,
    public diagramLevelService: DiagramLevelService,
    // public gojsCustomObjectsService: GojsCustomObjectsService,
    public diagramChangesService: DiagramChangesService,
    public customLayoutService: CustomLayoutService,
    public diagramUtilitiesService: DiagramUtilitiesService,
    public diagramPanelTemplatesService: DiagramPanelTemplatesService,
    public contextMenuService: ContextMenuService
  ) {
    this.store.select(getFilterLevelQueryParams).subscribe(filterLevel => (this.currentFilterLevel = filterLevel));
    thisService = this;
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
            contextMenu: this.gojsCustomObjectsService.getPartButtonMenu(false)
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
            contextMenu: this.gojsCustomObjectsService.getLinkContextMenu()
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
      this.getStandardNodeOptions(forPalette),
      {
        contextMenu: this.gojsCustomObjectsService.getLinkContextMenu(),
        doubleClick: (forPalette) ? undefined : this.diagramLevelService.displayMapView.bind(this.diagramLevelService),
        selectionObjectName: 'shape',
        resizable: false
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return ![Level.usage, Level.sources, Level.targets].includes(this.currentFilterLevel);
        }.bind(this)
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
        return locationMissing || [Level.sources, Level.targets].includes(this.currentFilterLevel);
      }.bind(this)),
      $(go.Panel,
        'Vertical',
        $(go.Panel,
          'Auto',
          $(go.Shape,
            this.getStandardNodeShapeOptions(),
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
      this.getStandardNodeOptions(forPalette),
      {
        resizeObjectName: 'content table',
        doubleClick: function(event, node) {
          this.gojsCustomObjectsService.showRightPanelTabSource.next();
        }.bind(this)
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return ![Level.usage, Level.sources, Level.targets].includes(this.currentFilterLevel);
        }.bind(this)
      ),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: this.gojsCustomObjectsService.getPartButtonMenu(false, false)
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
        return locationMissing || [Level.usage, Level.sources, Level.targets].includes(this.currentFilterLevel);
      }.bind(this)),
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
        this.getStandardNodeShapeOptions()
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
      this.getStandardNodeOptions(forPalette),
      {
        layout: $(thisService.customLayoutService.StandardGroupLayout,
          {
            isOngoing: false,
            isInitial: true,
            spacing: 12,
            packShape: PackedLayout.Rectangular,
            packMode: PackedLayout.Fit
          }
        ),
        subGraphExpandedChanged: this.diagramChangesService.groupSubGraphExpandChanged.bind(this.diagramChangesService),
        selectionObjectName: 'main content',
        resizeObjectName: 'content table',
        doubleClick: function(event, node) {
          this.gojsCustomObjectsService.showRightPanelTabSource.next();
        }.bind(this),
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
        }.bind(this),
        // Update cursor when dragging a node over the group.
        // Indicates that node can be dropped to add it to the group.
        mouseDragEnter: function(event, thisNode, previous) {
          const draggingTool = event.diagram.toolManager.draggingTool;
          const groupableNode = this.diagramChangesService.getGroupableDraggedNode(draggingTool);

          if (thisNode.data.layer === layers.system
            && this.diagramChangesService.diagramEditable
            && groupableNode
          ) {
            event.diagram.currentCursor = `url(assets/cursors/cursor_plus.svg), default`;
          }
        }.bind(this),
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
          return ![Level.usage, Level.sources, Level.targets].includes(this.currentFilterLevel);
        }.bind(this)
      ),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: this.gojsCustomObjectsService.getPartButtonMenu(false)
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
        return locationMissing || [Level.usage, Level.sources, Level.targets].includes(this.currentFilterLevel);
      }.bind(this)),
      new go.Binding('background', 'system', function(system) {
        return system ? containerColour : null;
      }),
      $(go.TextBlock,
        thisService.diagramUtilities.textFont('bold 20px'),
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
            }.bind(this)),
            new go.Binding('desiredSize', 'areaSize', go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding(
              'defaultRowSeparatorStroke',
              'colour',
              function(colour) {
                return NodeColoursDark[colour];
              }
            ),
            thisService.diagramPanelTemplatesService.getTopSection(true),
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
        return !(this.currentFilterLevel.includes('map') || [Level.sources, Level.targets].includes(this.currentFilterLevel))
          || !!linkData.isTemporary;
      }.bind(this)),
      new go.Binding('relinkableTo', '', function(linkData): boolean {
        return !(this.currentFilterLevel.includes('map') || [Level.sources, Level.targets].includes(this.currentFilterLevel))
          || !!linkData.isTemporary;
      }.bind(this)),
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'strokeWidth', function(width: number): boolean {
        return width !== 0;
      }).ofObject('shape'),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing', function(routeMissing) {
        return routeMissing || [Level.sources, Level.targets].includes(this.currentFilterLevel);
      }.bind(this)),
      new go.Binding('fromSpot', 'fromSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
      new go.Binding('toSpot', 'toSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
      this.getStandardLinkOptions(forPalette),
      {
        doubleClick: function(event: go.InputEvent, object: go.Link): void {
          if (forPalette) {
            return;
          }

          if (object.data.layer !== layers.reportingConcept) {
            this.diagramChangesService.getMapViewForLink.call(this.diagramChangesService, event, object);
          }
        }.bind(this)
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
          return link.diagram.model[linkVisibleProp] ? 2.5 : 0;
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
      this.getStandardLinkOptions(false),
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
          return this.currentFilterLevel === Level.sources ? 1 : -2;
        }.bind(this)),
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
            thisService.diagramUtilities.textFont('bold 30px'),
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
            thisService.diagramUtilities.textFont('15px'),
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
            if (this.diagramLevelService.groupLayoutInitial) {
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
          }.bind(this)
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
        thisService.diagramUtilities.textFont('bold 25px'),
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
              thisService.diagramUtilities.textFont('bold 20px'),
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
                  this.addChildSource.next(button.part.data);
                }.bind(this)
              },
              // Disable button if moves not allowed in diagram
              new go.Binding('isEnabled', '', function(data): boolean {

                // Disallow adding children to nodes that inherit their children
                if (data.category === nodeCategories.dataSet ||
                  data.category === nodeCategories.masterDataSet) {
                  return false;
                }

                return this.diagramChangesService.diagramEditable;
              }.bind(this)),
              // Hide child button for grouped data nodes
              new go.Binding('visible', 'dataStructure', function(dataStructure) {
                return !dataStructure;
              }),
              $(go.TextBlock, thisService.diagramUtilities.textFont('bold 22px'), '+',
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
            this.addChildSource.next(button.part.data.dataStructure);
          }.bind(this)
        },
        // Disable button if moves not allowed in diagram
        new go.Binding('isEnabled', '', function(): boolean {
          return this.diagramChangesService.diagramEditable;
        }.bind(this)),
        // Invisible when no data structure
        new go.Binding('visible', 'dataStructure', function(dataStructure): boolean {
          return !!dataStructure;
        }),
        $(go.TextBlock, thisService.diagramUtilities.textFont('bold 26px'), '+',
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
        action: function(event: go.InputEvent, object) {
        }
      },
      {
        text: 'Zoom in',
        action: function(event: go.InputEvent, object) {
        }
      },
      {
        text: 'Zoom out',
        action: function(event: go.InputEvent, object) {
        }
      },
      {
        text: 'Reorganise',
        action: function(event: go.InputEvent, object) {
        }
      },
      {
        text: 'Reorganise Links',
        action: function(event: go.InputEvent, object) {
        }
      }
    ];

    thisService.contextMenuService.createSimpleContextMenu(buttons);
  }
}
