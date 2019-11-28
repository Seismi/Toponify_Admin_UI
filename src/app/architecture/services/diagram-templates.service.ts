import * as go from 'gojs';
import 'gojs/extensions/Figures.js';
import { layers, nodeCategories } from '@app/architecture/store/models/node.model';
import { Injectable } from '@angular/core';
import {CustomLink, GojsCustomObjectsService, updateShapeShadows, customIcons, defineRoundButton} from './gojs-custom-objects.service';
import { DiagramLevelService, Level } from './diagram-level.service';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { getFilterLevelQueryParams } from '@app/core/store/selectors/route.selectors';

const $ = go.GraphObject.make;

// Fix shadow display issue on some shapes
// updateShapeShadows();
defineRoundButton();

const nodeWidth = 300;

@Injectable()
export class DiagramTemplatesService {
  private currentFilterLevel: Level;
  constructor(
    private store: Store<RouterReducerState<RouterStateUrl>>,
    public diagramLevelService: DiagramLevelService,
    public gojsCustomObjectsService: GojsCustomObjectsService,
    public diagramChangesService: DiagramChangesService
  ) {
    this.store.select(getFilterLevelQueryParams).subscribe(filterLevel => (this.currentFilterLevel = filterLevel));
  }

  // Get standard options used for nodes
  getStandardNodeOptions(forPalette: boolean): object {
    return Object.assign(
      {
        selectionAdorned: true,
        isShadowed: true,
        resizable: false,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        locationObjectName: 'location panel'
      },
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: this.gojsCustomObjectsService.getPartContextMenu()
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
      name: 'shape'
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
            // Set locationSpot in order for palette to arrange link correctly
            locationSpot: go.Spot.TopCenter,
            contextMenu: this.gojsCustomObjectsService.getPartContextMenu(),
            // Correct locationSpot on selection highlight adornment when link in palette
            selectionAdornmentTemplate: $(
              go.Adornment,
              'Link',
              {
                locationSpot: new go.Spot(0.5, 0, 1, 0)
              },
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
            contextMenu: this.gojsCustomObjectsService.getPartContextMenu()
          }
    );
  }

  // Get item template for list of node children
  getItemTemplate(): go.Panel {
    return $(
      go.Panel,
      'Auto',
      {
        background: 'black'
      },
      $(
        go.Panel,
        '',
        {
          background: 'white',
          margin: new go.Margin(1),
          padding: new go.Margin(7, 2, 1, 2),
          width: nodeWidth - 10
        },
        $(
          go.TextBlock,
          {
            stroke: 'black',
            font: '18px calibri',
            textAlign: 'center',
            wrap: go.TextBlock.None,
            overflow: go.TextBlock.OverflowEllipsis,
            stretch: go.GraphObject.Horizontal
          },
          new go.Binding('text', 'name')
        )
      )
    );
  }

  // Get button for revealing the next level of dependencies
  getDependencyExpandButton(): go.Panel {
    return $(
      'Button',
      {
        alignment: go.Spot.TopRight,
        desiredSize: new go.Size(20, 20),
        click: function(event, button) {
          const node = button.part;
          this.diagramChangesService.showDependencies(node);
        }.bind(this)
      },
      $(go.TextBlock, '+', {
        alignment: go.Spot.Center,
        font: 'bold 18px calibri',
        desiredSize: new go.Size(20, 20),
        textAlign: 'center',
        verticalAlignment: go.Spot.Center
      }),
      // Only show button for nodes with hidden dependent nodes
      new go.Binding('visible', '', function(node) {
        const connectedNodes = node.findNodesConnected();
        return connectedNodes.any(function(connectedNode) {
          return !connectedNode.visible;
        });
      }).ofObject()
    );
  }

  // Get top button for expanding and collapsing node sections.
  //  Expands bottom node section if not already expanded.
  //  Otherwise, collapses middle section if expanded.
  //  Otherwise, collapses bottom section.
  getTopExpandButton(): go.Panel {
    return $(
      'RoundButton',
      {
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        click: function(event, button) {
          const node = button.part;

          const middleSection = node.findObject('middle');
          const bottomSection = node.findObject('bottom');
          const buttonTextBox = button.findObject('TopButtonText');

          if (middleSection.visible && bottomSection.visible) {
            middleSection.visible = false;
            buttonTextBox.text = '-';
          } else if (!middleSection.visible && bottomSection.visible) {
            bottomSection.visible = false;
            buttonTextBox.text = '+';
          } else {
            bottomSection.visible = true;
            buttonTextBox.text = '-';
          }

          // Expanding/collapsing node sections changes node size, therefore link routes may need updating
          node.findLinksConnected().each(function(link) {
          event.diagram.model.setDataProperty(link.data, 'updateRoute', true);
            link.invalidateRoute();
          });

        }.bind(this)
      },
      $(go.TextBlock, '-', {
        name: 'TopButtonText',
        alignment: go.Spot.Center,
        font: 'bold 18px calibri',
        desiredSize: new go.Size(25, 25),
        textAlign: 'center',
        verticalAlignment: go.Spot.Center
      })
    );
  }

  // Get bottom button for expanding and collapsing node sections.
  // Expands the middle section of nodes when clicked.
  getBottomExpandButton(): go.Panel {
    return $(
      'RoundButton',
      {
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        click: function(event, button): void {
          const node = button.part;
          const middleSection = node.findObject('middle');

          middleSection.visible = true;

          // Expanding/collapsing node sections changes node size, therefore link routes may need updating
          node.findLinksConnected().each(function(link) {
          event.diagram.model.setDataProperty(link.data, 'updateRoute', true);
            link.invalidateRoute();
          });

        }.bind(this)
      },
      $(go.TextBlock, '+', {
        alignment: go.Spot.Center,
        font: 'bold 18px calibri',
        desiredSize: new go.Size(25, 25),
        textAlign: 'center',
        verticalAlignment: go.Spot.Center
      }),
      // Button not visible when middle node section is collapsed
      new go.Binding('visible', 'visible', function (middleVisible) {
        return !middleVisible;
      }).ofObject('middle')
    );
  }

  // Calculate stroke for parts, based on impacted work packages
  getStrokeForImpactedWorkPackages(impactedPackages, part: go.Part): go.BrushLike {
    const allWorkpackages = part.diagram.model.modelData.workpackages;

    // return black by default if part not impacted by any work packages
    if (impactedPackages.length === 0) {
      return 'black';
    }

    // get colours for work packages impacted by
    const colours = allWorkpackages
      .filter(function(workpackage) {
        return impactedPackages.some(function(impactedPackage) {
          return impactedPackage.id === workpackage.id;
        });
      })
      .map(function(workpackage) {
        return workpackage.displayColour;
      });

    // arguments to pass to createCustomBrush
    const args = [colours];

    // if part is a link then calculate start and end points of the
    // brush based on the relative locations of the connected nodes
    if (part instanceof go.Link) {
      const fromLocation = part.fromNode ? part.fromNode.location : part.points.first();
      const toLocation = part.toNode ? part.toNode.location : part.points.last();
      let startAlign: string;
      let endAlign: string;

      // vertical brush direction
      if (fromLocation.y < toLocation.y) {
        startAlign = 'Top';
        endAlign = 'Bottom';
      } else {
        startAlign = 'Bottom';
        endAlign = 'Top';
      }
      // add horizontal brush direction
      if (fromLocation.x < toLocation.x) {
        startAlign = startAlign + 'Left';
        endAlign = endAlign + 'Right';
      } else {
        startAlign = startAlign + 'Right';
        endAlign = endAlign + 'Left';
      }
      // fromSpot
      args.push(go.Spot[startAlign]);
      // toSpot
      args.push(go.Spot[endAlign]);
    }

    return this.gojsCustomObjectsService.createCustomBrush.apply(null, args);
  }

  // Get alert indicator for RADIOs of the given type against nodes
  getRadioAlertIndicator(type: string): go.Panel {
    const radioColours = {
      risks: 'orange',
      assumptions: 'yellow',
      dependencies: 'blue',
      issues: 'red',
      opportunities: 'green'
    };

    return $(
      go.Panel,
      'Auto',
      {
        visible: false
      },
      new go.Binding('visible', 'relatedRadioCounts', function(counts) {
        return counts[type] > 0;
      }),
      $(go.Shape, 'circle', {
        fill: radioColours[type],
        desiredSize: new go.Size(25, 25),
        margin: new go.Margin(0, 1, 0, 1)
      }),
      $(
        go.TextBlock,
        {
          textAlign: 'center',
          stroke: radioColours[type] === 'yellow' ? 'black' : 'white',
          font: '12px calibri'
        },
        new go.Binding('text', 'relatedRadioCounts', function(counts) {
          return counts[type];
        })
      )
    );
  }

  // Get the whole set of indicators for the different types of RADIOs
  getRadioAlertIndicators(): go.Panel {
    return $(
      go.Panel,
      'Horizontal',
      {
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
        visible: false
      },
      new go.Binding('visible', 'showRadioAlerts').ofModel(),
      ...['risks', 'assumptions', 'dependencies', 'issues', 'opportunities'].map(
        function(type) {
          return this.getRadioAlertIndicator(type);
        }.bind(this)
      )
    );
  }

  // Get name and RADIO alert label for links
  getLinkLabel(): go.Panel {
    return $(
      go.Panel,
      'Auto',
      $(go.Shape, {
        figure: 'RoundedRectangle',
        fill: 'white',
        opacity: 0.85
      }),
      // Only show link label if link is visible, diagram is set to show name/RADIO alerts and any exist to show
      new go.Binding('visible', '', function(link) {
        if (link.findObject('shape').strokeWidth === 0) {
          return false;
        } else {
          if (!link.data.relatedRadioCounts) {
            return false;
          }

          const anyRadios = Object.keys(link.data.relatedRadioCounts).reduce(function(anyNonZero, key) {
            return anyNonZero || link.data.relatedRadioCounts[key] !== 0;
          }, false);

          return (
            (link.diagram.model.modelData.linkName && link.data.name !== '') ||
            (link.diagram.model.modelData.showRadioAlerts && anyRadios)
          );
        }
      }).ofObject(),
      $(
        go.Panel,
        'Vertical',
        $(
          go.TextBlock,
          {
            font: 'bold 14px calibri'
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'linkName').ofModel()
        ),
        this.getRadioAlertIndicators()
      )
    );
  }

  // Get top section of nodes, containing icon and name
  getTopSection() {
    return $(
      go.Panel,
      'Horizontal',
      {
        name: 'top',
        row: 0,
        alignment: go.Spot.TopCenter,
        stretch: go.GraphObject.Horizontal,
        minSize: new go.Size(NaN, 30),
        margin: new go.Margin(5),
      },
      // Node icon, to appear at the top left of the node
      $(go.Picture,
        {
          desiredSize: new go.Size(25, 25),
          source: '/assets/node-icons/data_set-master-data.svg'
        },
        new go.Binding('source', '', function(data): string {
          const imageFolderPath = '/assets/node-icons/';

          // Section of the image name determined by layer
          const layerImagePrefix = {
            [layers.system]: 'sys',
            [layers.dataSet]: 'data_set',
            [layers.dimension]: 'dim',
            [layers.reportingConcept]: 'rc'
          };

          // Section of the image name determined by category
          const categoryImageSuffix = {
            [nodeCategories.transactional]: 'transactional',
            [nodeCategories.analytical]: 'analytical',
            [nodeCategories.reporting]: 'reporting',
            [nodeCategories.masterData]: 'master-data',
            [nodeCategories.file]: 'files',
            [nodeCategories.physical]: 'physical',
            [nodeCategories.virtual]: 'virtual',
            [nodeCategories.masterData]: 'master-data',
            [nodeCategories.dimension]: '',
            [nodeCategories.list]: 'list',
            [nodeCategories.structure]: 'structure',
            [nodeCategories.key]: 'keyrc'
          };

          const separator = data.layer !== layers.dimension ? '-' : '';

          return [imageFolderPath,
            layerImagePrefix[data.layer],
            separator,
            categoryImageSuffix[data.category],
            '.svg'].join('');
        })
      ),
      // $(go.Shape, {figure: 'Rectangle', desiredSize: new go.Size(25, 25)}),
      $(
        go.TextBlock,
        {
          textAlign: 'left',
          font: 'bold italic 20px calibri',
          margin: new go.Margin(0, 5, 0, 5),
          desiredSize: new go.Size(nodeWidth - 70, NaN),
          wrap: go.TextBlock.None,
          overflow: go.TextBlock.OverflowEllipsis
        },
        new go.Binding('text', 'name'),
        new go.Binding('opacity', 'name',
          function(name) {return name ? 1 : 0; }
        ).ofModel()
       ),
      this.getTopExpandButton()
      /*$(
        go.Shape,
        {
          alignment: go.Spot.RightCenter,
          alignmentFocus: go.Spot.RightCenter,
          figure: 'Rectangle',
          desiredSize: new go.Size(25, 25)
        }
      )*/
    );
  }

  // Get middle section of nodes, containing description, owners and descendants
  getMiddleSection(): go.Panel {
    return $(
      go.Panel,
      'Vertical',
      {
        name: 'middle',
        row: 1,
        stretch: go.GraphObject.Horizontal,
        margin: new go.Margin(5)
      },
      $(
        go.TextBlock,
        {
          textAlign: 'center',
          stroke: 'black',
          font: '16px Calibri',
          maxSize: new go.Size(nodeWidth - 10, Infinity),
          margin: new go.Margin(5, 0, 0, 0)
        },
        new go.Binding('text', 'description'),
        new go.Binding('visible', 'description').ofModel()
      ),
      $(
        go.TextBlock,
        {
          textAlign: 'center',
          stroke: 'black',
          font: 'italic 16px Calibri',
          maxSize: new go.Size(nodeWidth - 10, Infinity),
          margin: new go.Margin(5, 0, 0, 0)
        },
        new go.Binding('text', 'owners',
          function (owners) {
            return owners.length > 0 ?
              'Owners - ' + owners.map(
                function(owner) {return owner.name; }
              ).join(', ') : '';
          }
        ),
        new go.Binding('visible', 'owners').ofModel()
      ),
      $(
        go.Panel,
        'Vertical',
        {
          stretch: go.GraphObject.Horizontal,
          row: 3
        },
        // Descendants list
        $(
          go.Panel,
          'Vertical',
          {
            name: 'Descendants List',
            // padding: 3,
            alignment: go.Spot.TopLeft,
            defaultAlignment: go.Spot.Left,
            stretch: go.GraphObject.Horizontal,
            itemCategoryProperty: '',
            itemTemplate: this.getItemTemplate()
          },
          new go.Binding('itemArray', 'descendants')
        ),
        new go.Binding('visible', 'nextLevel').ofModel()
      )
    );
  }

  // Get bottom section of nodes, containing tags and RADIO Alert indicators
  getBottomSection(): go.Panel {
    return $(
      go.Panel,
      'Vertical',
      {
        name: 'bottom',
        row: 2,
        stretch: go.GraphObject.Horizontal,
        margin: new go.Margin(2)
      },
      $(
        go.TextBlock,
        {
          textAlign: 'left',
          stroke: 'black',
          font: 'bold italic 18px Calibri',
          maxSize: new go.Size(nodeWidth - 10, Infinity),
          margin: new go.Margin(5, 0, 0, 0),
          stretch: go.GraphObject.Horizontal
        },
        new go.Binding('text', 'tags'),
        new go.Binding('visible', 'tags').ofModel()
      ),
      $(
        go.Panel,
        'Spot',
        {
          alignment: go.Spot.BottomCenter,
          alignmentFocus: go.Spot.BottomCenter
        },
        $(
          go.Shape,
          'rectangle',
          {
            desiredSize: new go.Size(nodeWidth - 10, 30),
            fill: null,
            stroke: null
          }
        ),
        this.getRadioAlertIndicators(),
        this.getBottomExpandButton()
        /*$(
          go.Shape,
          {
            alignment: go.Spot.RightCenter,
            alignmentFocus: go.Spot.RightCenter,
            figure: 'Rectangle',
            desiredSize: new go.Size(25, 25)
          }
        )*/
      )
    );
  }

  getNodeTemplate(forPalette: boolean = false): go.Node {
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      this.getStandardNodeOptions(forPalette),
      {
        doubleClick: this.diagramLevelService.changeLevelWithFilter.bind(this)
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return this.currentFilterLevel !== Level.usage;
        }.bind(this)
      ),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: this.gojsCustomObjectsService.getPartContextMenu()
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
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      $(
        go.Shape,
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(impactedPackages, shape.part);
          }.bind(this)
        ),
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
          defaultRowSeparatorStroke: 'black'
        },
        // this.getDependencyExpandButton(),
        this.getTopSection(),
        this.getMiddleSection(),
        this.getBottomSection()
      )
    );
  }

  // Get template for data links
  getLinkDataTemplate(forPalette: boolean = false): CustomLink {
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
      new go.Binding('relinkableFrom', 'id', function(id) {
        return id !== '00000000-0000-0000-0000-000000000000';
      }),
      new go.Binding('relinkableTo', 'id', function(id) {
        return id !== '00000000-0000-0000-0000-000000000000';
      }),
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'dataLinks').ofModel(),
      // Have the diagram position the link if no route set
      new go.Binding('isLayoutPositioned', 'routeMissing'),
      this.getStandardLinkOptions(forPalette),
      {
        doubleClick: this.diagramLevelService.displayMapView.bind(this.diagramLevelService)
      },
      $(
        go.Shape,
        {
          name: 'shape',
          isPanelMain: true,
          stroke: 'black',
          strokeWidth: 2.5
        },
        // On hide, set width to 0 instead of disabling visibility, so that link routes still calculate
        new go.Binding('strokeWidth', 'dataLinks', function(dataLinks) {
          return dataLinks ? 2.5 : 0;
        }).ofModel(),
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(impactedPackages, shape.part);
          }.bind(this)
        ),
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? { areaBackground: 'transparent' } : {}
      ),
      !forPalette ? this.getLinkLabel() : {},
      $(
        go.Shape, // The 'to' arrowhead
        {
          scale: 1.2,
          toArrow: 'Triangle'
        },
        new go.Binding('fill', 'stroke').ofObject('shape'),
        new go.Binding('stroke', 'stroke').ofObject('shape'),
        new go.Binding('visible', 'layer', function(layer) {
          return layer !== layers.system;
        })
      )
    );
  }

  // Get template for master data links
  getLinkMasterDataTemplate(forPalette: boolean = false): CustomLink {
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
      // Do not allow relinking map view dummy links
      new go.Binding('relinkableFrom', 'id', function(id) {
        return id !== '00000000-0000-0000-0000-000000000000';
      }),
      new go.Binding('relinkableTo', 'id', function(id) {
        return id !== '00000000-0000-0000-0000-000000000000';
      }),
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'masterDataLinks').ofModel(),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing'),
      this.getStandardLinkOptions(forPalette),
      {
        doubleClick: function(event, object) {
          if ([layers.system, layers.dataSet].includes(object.data.layer)) {
            this.diagramLevelService.displayMapView.call(this.diagramLevelService, event, object);
          }
        }.bind(this)
      },
      $(
        go.Shape,
        {
          name: 'shape',
          isPanelMain: true,
          stroke: 'Black',
          strokeWidth: 2.5,
          strokeDashArray: [5, 5]
        },
        // Show dotted line for map view dummy links
        new go.Binding('strokeDashArray', 'id', function(id) {
          if (id === '00000000-0000-0000-0000-000000000000') {
            return [2.5, 1.5];
          } else {
            return [5, 5];
          }
        }),
        // On hide, set width to 0 instead of disabling visibility, so that link routes still calculate
        new go.Binding('strokeWidth', 'masterDataLinks', function(dataLinks) {
          return dataLinks ? 2.5 : 0;
        }).ofModel(),
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(impactedPackages, shape.part);
          }.bind(this)
        ),
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? { areaBackground: 'transparent' } : {}
      ),
      !forPalette ? this.getLinkLabel() : {}
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

  getDataSetGroupTemplate(): go.Group {
    // Template for data set groups in mapping view
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
              // Get nodes connected to each node
              const aLinkedNodes = a.findNodesConnected();
              const bLinkedNodes = b.findNodesConnected();

              // Place unconnected nodes after nodes with links
              if (aLinkedNodes.count === 0 && bLinkedNodes.count !== 0) {
                return 1;
              } else if (aLinkedNodes.count !== 0 && bLinkedNodes.count === 0) {
                return -1;
              } else if (aLinkedNodes.count !== 0 && bLinkedNodes.count !== 0) {
                // Initialise variables to hold total heights of connected nodes for each compare node
                let aHeights = 0;
                let bHeights = 0;

                // Total y values of co-ordinates of centre of each node connected to node a
                while (aLinkedNodes.next()) {
                  aHeights = aHeights + aLinkedNodes.value.findObject('shape').getDocumentPoint(go.Spot.Center).y;
                }

                // Calculate average height by dividing by the number of linked nodes
                aHeights = aHeights / aLinkedNodes.count;

                // Total y values of co-ordinates of centre of each node connected to node b
                while (bLinkedNodes.next()) {
                  bHeights = bHeights + bLinkedNodes.value.findObject('shape').getDocumentPoint(go.Spot.Center).y;
                }

                // Calculate average height by dividing by the number of linked nodes
                bHeights = bHeights / bLinkedNodes.count;

                // Compare average connected node height to determine order
                if (aHeights > bHeights) {
                  return 1;
                } else if (bHeights > aHeights) {
                  return -1;
                }
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
        computesBoundsAfterDrag: true,
        computesBoundsIncludingLocation: true,
        computesBoundsIncludingLinks: false,
        locationSpot: go.Spot.TopCenter,
        locationObjectName: 'shape',
        isLayoutPositioned: true,
        layoutConditions: go.Part.LayoutStandard,
        selectable: false,
        avoidable: false,
        minSize: new go.Size(250, 0)
      },
      new go.Binding('location', 'location', go.Point.parse),
      $(
        go.Panel,
        'Auto',
        { stretch: go.GraphObject.Fill },
        $(go.Shape, {
          fill: '#ebe9ea',
          stroke: 'transparent',
          strokeWidth: 2,
          name: 'shape'
        }),
        $(
          go.Panel,
          'Vertical',
          { margin: 10 },
          $(
            go.TextBlock,
            {
              font: 'bold 20px calibri',
              textAlign: 'center',
              stroke: 'black',
              alignment: go.Spot.TopCenter,
              stretch: go.GraphObject.Horizontal,
              width: 180
            },
            new go.Binding('text', 'name')
          ),
          $(go.Placeholder, { alignment: go.Spot.TopCenter })
        )
      )
    );
  }
}
