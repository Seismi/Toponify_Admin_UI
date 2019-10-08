import * as go from 'gojs';
import 'gojs/extensions/Figures.js';
import {
  layers,
  nodeCategories
} from '@app/architecture/store/models/node.model';
import { Injectable } from '@angular/core';
import {
  CustomLink,
  GojsCustomObjectsService,
  updateShapeShadows
} from './gojs-custom-objects.service';
import { FilterService } from './filter.service';
import { DiagramLevelService, Level } from './diagram-level.service';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

const $ = go.GraphObject.make;

// Fix shadow display issue on some shapes
updateShapeShadows();

@Injectable()
export class DiagramTemplatesService {
  constructor(
    public filterService: FilterService,
    public diagramLevelService: DiagramLevelService,
    public gojsCustomObjectsService: GojsCustomObjectsService,
    public diagramChangesService: DiagramChangesService
  ) {}

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
        background: 'black',
        stretch: go.GraphObject.Horizontal
      },
      $(
        go.Panel,
        'Horizontal',
        {
          background: 'white',
          margin: new go.Margin(1)
        },
        $(
          go.TextBlock,
          {
            stroke: 'black',
            font: '14px calibri'
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
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

  // Calculate stroke for parts, based on impacted work packages
  getStrokeForImpactedWorkPackages(
    impactedPackages,
    part: go.Part
  ): go.BrushLike {
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
      const fromLocation = part.fromNode
        ? part.fromNode.location
        : part.points.first();
      const toLocation = part.toNode
        ? part.toNode.location
        : part.points.last();
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
        margin: new go.Margin(5, 1, 5, 1)
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
        row: 1,
        alignment: go.Spot.BottomRight,
        visible: false
      },
      new go.Binding('visible', 'showRadioAlerts').ofModel(),
      ...['risks',
        'assumptions',
        'dependencies',
        'issues',
        'opportunities'
      ].map(function(type) {return this.getRadioAlertIndicator(type); }.bind(this))
    );
  }

  // Get name label for links
  getLinkLabel(): go.Panel {
    return $(
      go.Panel,
      'Vertical',
      $(
        go.TextBlock,
        {
          font: 'bold 14px calibri'
        },
        new go.Binding('areaBackground', 'name', function(name) {
          return name ? 'white' : null;
        }),
        new go.Binding('text', 'name'),
        new go.Binding('visible', 'linkName').ofModel()
      ),
      $(
        go.TextBlock,
        {
          font: '13px calibri'
        },
        new go.Binding('areaBackground', 'label', function(label) {
          return label ? 'white' : null;
        }),
        new go.Binding('text', 'label'),
        new go.Binding('visible', 'linkLabel').ofModel()
      )
    );
  }

  // Get standard sections for nodes
  // Sections included:
  //   name
  //   description
  //   tags
  //   owner
  // Returns an array of node sections
  getStandardNodeSections(): go.TextBlock[] {
    const sections = [
      {
        sectionName: 'name',
        font: 'bold 16px calibri',
        initialText: ''
      },
      {
        sectionName: 'description',
        font: 'italic 15px calibri',
        initialText: ''
      },
      {
        sectionName: 'tags',
        font: '15px calibri',
        initialText: 'Tags - '
      },
      {
        sectionName: 'owner',
        font: '15px calibri',
        initialText: 'Owner - '
      }
    ];

    return sections.map(function(section) {
      return $(
        go.TextBlock,
        {
          textAlign: 'center',
          stroke: 'black',
          font: section.font,
          maxSize: new go.Size(100, Infinity),
          margin: new go.Margin(0, 0, 5, 0)
        },
        new go.Binding('text', section.sectionName, function(input) {
          return input ? section.initialText + input : '';
        }),
        new go.Binding('visible', section.sectionName).ofModel()
      );
    });
  }

  // Get list of descendants for nodes.
  //   Input: header (title to be displayed above list)
  getDescendantsNodeSection(header: string): go.Panel {
    return $(
      go.Panel,
      'Vertical',
      {
        stretch: go.GraphObject.Horizontal
      },
      // Descendants list header
      $(
        go.TextBlock,
        {
          text: header,
          alignment: go.Spot.Center,
          stroke: 'black',
          font: 'bold 15.25px calibri',
          margin: new go.Margin(5, 0, 0, 0)
        },
        // Hide descendants header if node has no descendants
        new go.Binding('visible', 'descendants', function(descendants) {
          return descendants.length > 0;
        })
      ),
      // Descendants list
      $(
        go.Panel,
        'Vertical',
        {
          name: header + '_List',
          padding: 3,
          alignment: go.Spot.TopLeft,
          defaultAlignment: go.Spot.Left,
          stretch: go.GraphObject.Horizontal,
          itemCategoryProperty: '',
          itemTemplate: this.getItemTemplate()
        },
        new go.Binding('itemArray', 'descendants')
      ),
      new go.Binding('visible', 'nextLevel').ofModel()
    );
  }

  // Get template for system nodes
  getSystemNodeTemplate(forPalette: boolean = false): go.Node {
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      this.getStandardNodeOptions(forPalette),
      {
        doubleClick: this.diagramLevelService.changeLevelWithFilter.bind(this)
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return this.filterService.getFilter().filterLevel !== Level.usage;
        }.bind(this)
      ),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: this.gojsCustomObjectsService.getPartContextMenu()
          }
        : {},
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      $(
        go.Shape,
        new go.Binding('figure', 'category', function(category) {
          if (category === nodeCategories.transactional) {
            return 'Cylinder1';
          } else if (category === nodeCategories.analytical) {
            return 'Cube2';
          } else if (category === nodeCategories.file) {
            return 'Document';
          } else if (category === nodeCategories.masterData) {
            return 'ManualInput';
          } else {
            // Reporting
            return 'RoundedRectangle';
          }
        }),
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(
              impactedPackages,
              shape.part
            );
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
          margin: new go.Margin(5, 4, 0, 4)
        },
        // Bind height for transactional system to make consistent
        //  with previously used GoJs 1.8 shape
        new go.Binding('minSize', 'category', function(category) {
          if (category === 'transactional') {
            return new go.Size(100, 140);
          } else {
            return new go.Size(100, 100);
          }
        }),
        $(
          go.Panel,
          'Vertical',
          {
            row: 0,
            alignment: go.Spot.TopCenter,
            minSize: new go.Size(90, NaN)
          },
          this.getDependencyExpandButton(),
          ...this.getStandardNodeSections(),
          this.getDescendantsNodeSection('Data Sets')
        ),
        this.getRadioAlertIndicators()
      )
    );
  }

  // Get template for data set nodes
  getDataSetNodeTemplate(forPalette: boolean = false): go.Node {
    // Template for Data Set
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      this.getStandardNodeOptions(forPalette),
      {
        doubleClick: this.diagramLevelService.changeLevelWithFilter.bind(this)
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return this.filterService.getFilter().filterLevel !== Level.usage;
        }.bind(this)
      ),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: this.gojsCustomObjectsService.getPartContextMenu()
          }
        : {},
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(
        go.Shape,
        'Rectangle',
        this.getStandardNodeShapeOptions(),
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(
              impactedPackages,
              shape.part
            );
          }.bind(this)
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
          minSize: new go.Size(100, 100),
          margin: new go.Margin(5, 4, 0, 4)
        },
        $(
          go.Panel,
          'Vertical',
          {
            alignment: go.Spot.TopCenter,
            row: 0,
            minSize: new go.Size(90, NaN)
          },
          this.getDependencyExpandButton(),
          $(
            go.TextBlock,
            {
              alignment: go.Spot.TopRight,
              background: null,
              font: 'bold 20px calibri'
            },
            new go.Binding('text', 'category', function(category) {
              if (category === nodeCategories.virtual) {
                return 'V';
              } else if (category === nodeCategories.masterData) {
                return 'MD';
              } else {
                // Physical data set
                return '';
              }
            }),
            new go.Binding('visible', 'category', function(category) {
              return category !== nodeCategories.physical;
            })
          ),
          ...this.getStandardNodeSections(),
          this.getDescendantsNodeSection('Dimensions')
        ),
        this.getRadioAlertIndicators()
      )
    );
  }

  // Get template for dimension nodes
  getDimensionNodeTemplate(forPalette: boolean = false): go.Node {
    // Template for dimension
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      this.getStandardNodeOptions(forPalette),
      {
        doubleClick: this.diagramLevelService.changeLevelWithFilter.bind(this)
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return this.filterService.getFilter().filterLevel !== Level.usage;
        }.bind(this)
      ),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: this.gojsCustomObjectsService.getPartContextMenu()
          }
        : {},
      // Have the diagram position the node if no location set
      this.filterService.getFilter().filterLevel === Level.map
        ? {}
        : new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(
        go.Shape,
        'Rectangle',
        this.getStandardNodeShapeOptions(),
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(
              impactedPackages,
              shape.part
            );
          }.bind(this)
        ),
        new go.Binding(
          'fromSpot',
          'group',
          function(group) {
            if (group) {
              return go.Spot.LeftRightSides;
            } else {
              return go.Spot.AllSides;
            }
          }.bind(this)
        ),
        new go.Binding(
          'toSpot',
          'group',
          function(group) {
            if (group) {
              return go.Spot.LeftRightSides;
            } else {
              return go.Spot.AllSides;
            }
          }.bind(this)
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
          minSize: new go.Size(100, 100),
          margin: new go.Margin(5, 4, 0, 4)
        },
        $(
          go.Panel,
          'Vertical',
          {
            alignment: go.Spot.TopCenter,
            minSize: new go.Size(90, NaN)
          },
          this.getDependencyExpandButton(),
          $(go.TextBlock, {
            alignment: go.Spot.TopRight,
            background: null,
            font: 'bold 20px calibri',
            text: 'D'
          }),
          ...this.getStandardNodeSections(),
          this.getDescendantsNodeSection('Reporting Concepts')
        ),
        this.getRadioAlertIndicators()
      )
    );
  }

  // Get template for reporting concept nodes
  getReportingConceptNodeTemplate(forPalette: boolean = false): go.Node {
    // Template for reporting concept nodes
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      new go.Binding(
        'movable',
        '',
        function() {
          return this.filterService.getFilter().filterLevel !== Level.usage;
        }.bind(this)
      ),
      this.getStandardNodeOptions(forPalette),
      !forPalette
        ? {
            // Enable context menu for nodes not in the palette
            contextMenu: this.gojsCustomObjectsService.getPartContextMenu()
          }
        : {},
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(
        go.Shape,
        new go.Binding('figure', 'category', function(category) {
          if (category === 'key') {
            return 'SquareArrow';
          } else if (category === 'list') {
            return 'Process';
          } else {
            return 'InternalStorage';
          }
        }),
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(
              impactedPackages,
              shape.part
            );
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
          minSize: new go.Size(100, 100)
        },
        // Ensure that the panel does not overlap the border lines
        // on the shapes for list and structure reporting elements
        new go.Binding('margin', 'category', function(category) {
          if (
            [nodeCategories.list, nodeCategories.structure].includes(category)
          ) {
            return new go.Margin(15, 4, 0, 14);
          } else {
            return new go.Margin(5, 4, 0, 4);
          }
        }),
        $(
          go.Panel,
          'Vertical',
          {
            alignment: go.Spot.TopCenter,
            minSize: new go.Size(90, NaN)
          },
          this.getDependencyExpandButton(),
          ...this.getStandardNodeSections()
        ),
        this.getRadioAlertIndicators()
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
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'dataLinks').ofModel(),
      // Have the diagram position the link if no route set
      new go.Binding('isLayoutPositioned', 'routeMissing'),
      this.getStandardLinkOptions(forPalette),
      {
        doubleClick: this.diagramLevelService.displayMapView.bind(
          this.diagramLevelService
        )
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
            return this.getStrokeForImpactedWorkPackages(
              impactedPackages,
              shape.part
            );
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
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'masterDataLinks').ofModel(),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing'),
      this.getStandardLinkOptions(forPalette),
      $(
        go.Shape,
        {
          isPanelMain: true,
          stroke: 'Black',
          strokeWidth: 2.5,
          strokeDashArray: [5, 5]
        },
        // On hide, set width to 0 instead of disabling visibility, so that link routes still calculate
        new go.Binding('strokeWidth', 'masterDataLinks', function(dataLinks) {
          return dataLinks ? 2.5 : 0;
        }).ofModel(),
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(
              impactedPackages,
              shape.part
            );
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
                  aHeights =
                    aHeights +
                    aLinkedNodes.value
                      .findObject('shape')
                      .getDocumentPoint(go.Spot.Center).y;
                }

                // Calculate average height by dividing by the number of linked nodes
                aHeights = aHeights / aLinkedNodes.count;

                // Total y values of co-ordinates of centre of each node connected to node b
                while (bLinkedNodes.next()) {
                  bHeights =
                    bHeights +
                    bLinkedNodes.value
                      .findObject('shape')
                      .getDocumentPoint(go.Spot.Center).y;
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
