import * as go from 'gojs';
import 'gojs/extensions/Figures.js';
import {nodeCategories, layers} from '@app/nodes/store/models/node.model';
import {Injectable} from '@angular/core';
import {CustomLink} from './gojs-custom-objects.service';
import {FilterService} from './filter.service';

const $ = go.GraphObject.make;

@Injectable()
export class DiagramTemplatesService {

  constructor(
    public filterService: FilterService
  ) {}

  // Get item template for list of node children
  getItemTemplate() {
    return $(go.Panel,
      'Auto',
      {
        background: 'black',
        stretch: go.GraphObject.Horizontal
      },
      $(go.Panel,
        'Horizontal',
        {
          background: 'white',
          margin: new go.Margin(1)
        },
        $(go.TextBlock,
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

  getSystemNodeTemplate() {

    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        selectionAdorned: true,
        resizable: false,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        isShadowed: false,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        // doubleClick: this.changeLevelWithFilter.bind(this),
        // TEMP
        isLayoutPositioned: true
      },
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      $(
        go.Shape,
        new go.Binding('figure', 'category', function (category) {
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
        // Bind height for transactional system to make consistent
        //  with previously used GoJs 1.8 shape
        new go.Binding('minSize', 'category', function (category) {
          if (category === 'transactional') {
            return new go.Size(NaN, 157.14285714285714);
          } else {
            return new go.Size(NaN, NaN);
          }
        }),
        {
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
        }
      ),
      $(go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        // System name
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'bold 16px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
        ),
        // System description
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'italic 15px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description').ofModel()
        ),
        // System tags
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'tags',
            function (tags) {
              return tags ? ('Tags - ' + tags) : '';
            }
          ),
          new go.Binding('visible', 'tags').ofModel()
        ),
        // System owners
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'owner',
            function (owner) {
              return owner ? ('Owner - ' + owner) : '';
            }
          ),
          new go.Binding('visible', 'owner').ofModel()
        ),
        $(go.Panel, 'Vertical',
          {
            stretch: go.GraphObject.Horizontal
          },
          // Data set list header
          $(go.TextBlock,
            {
              text: 'Data Sets',
              row: 1,
              alignment: go.Spot.Center,
              stroke: 'black',
              font: 'bold 15.25px calibri',
              margin: new go.Margin(5, 0, 0, 0)
            },
            // Hide data sets header if system has no data sets
            new go.Binding('visible', 'descendants',
              function (descendants) {
                return descendants.length > 0;
              }
            )
          ),
          // Data set list
          $(go.Panel, 'Vertical',
            {
              name: 'Data_Set_List',
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'descendants')
          ),
          new go.Binding('visible', 'nextLevel').ofModel()
        )
      )
    );
  }

  getDataSetNodeTemplate() {

    // Template for Data Set
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        selectionAdorned: true,
        resizable: false,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        isShadowed: false,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        // doubleClick: this.changeLevelWithFilter.bind(this),
        // TEMP
        isLayoutPositioned: true
      },
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(go.Shape, 'Rectangle', {
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        portId: '',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        name: 'shape',
        fromLinkableDuplicates: true,
        toLinkableDuplicates: true
      }),
      $(go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        $(go.TextBlock,
          {
            alignment: go.Spot.TopRight,
            background: null,
            font: 'bold 20px calibri'
          },
          new go.Binding('text',
            'category',
            function (category) {
              if (category === nodeCategories.virtual) {
                return 'V';
              } else if (category === nodeCategories.masterData) {
                return 'MD';
              } else {
                // Physical data set
                return '';
              }
            }
          )
        ),
        // Data set name
        $(
          go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'bold 16px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
        ),
        // Data set description
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'italic 15px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description').ofModel()
        ),
        // Data set tags
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text', 'tags', function (tags) {
            return tags ? 'Tags - ' + tags : '';
          }),
          new go.Binding('visible', 'tags').ofModel()
        ),
        // Data set owners
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'owner',
            function (owner) {
              return owner ? ('Owner - ' + owner) : '';
            }
          ),
          new go.Binding('visible', 'owner').ofModel()
        ),
        $(go.Panel, 'Vertical',
          {
            stretch: go.GraphObject.Horizontal
          },
          // Dimension list header
          $(go.TextBlock,
            {
              text: 'Dimensions',
              row: 1,
              alignment: go.Spot.Center,
              stroke: 'black',
              font: 'bold 15.25px calibri',
              margin: new go.Margin(5, 0, 0, 0)
            },
            // Hide dimensions header if data set has no dimensions
            new go.Binding('visible', 'descendants',
              function (descendants) {
                return descendants.length > 0;
              }
            )
          ),
          // Dimension list
          $(go.Panel, 'Vertical',
            {
              name: 'Dimension_List',
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'descendants')
          ),
          new go.Binding('visible', 'nextLevel').ofModel()
        )
      )
    );
  }

  getDimensionNodeTemplate() {

    // Template for dimension
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        selectionAdorned: true,
        resizable: false,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        isShadowed: false,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        // doubleClick: this.changeLevelWithFilter.bind(this),
        // TEMP
        isLayoutPositioned: true
      },
      // Have the diagram position the node if no location set
      // this.mapView ? {} : new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(go.Shape,
        'Rectangle',
        {
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1,
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          // fromSpot: go.Spot.AllSides,
          // toSpot: go.Spot.AllSides,
          name: 'shape',
          fromLinkableDuplicates: false,
          toLinkableDuplicates: false
        },
        new go.Binding('fromSpot', 'group', function (group) {
          if (this.mapView) {
            if (this.mapView.sourceModel.id === group) {
              return go.Spot.RightSide;
            } else {
              return go.Spot.LeftSide;
            }
          } else {
            return go.Spot.AllSides;
          }
        }.bind(this)),
        new go.Binding('toSpot', 'group', function (group) {
          if (this.mapView) {
            if (this.mapView.sourceModel.id === group) {
              return go.Spot.RightSide;
            } else {
              return go.Spot.LeftSide;
            }
          } else {
            return go.Spot.AllSides;
          }
        }.bind(this))
      ),
      $(go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        $(go.TextBlock,
          {
            alignment: go.Spot.TopRight,
            background: null,
            font: 'bold 20px calibri',
            text: 'D'
          }
        ),
        // Dimension name
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'bold 16px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
        ),
        // Dimension description
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'italic 15px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description').ofModel()
        ),
        // Dimension tags
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'tags',
            function (tags) {
              return tags ? ('Tags - ' + tags) : '';
            }
          ),
          new go.Binding('visible', 'tags').ofModel()
        ),
        // Dimension owners
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'owner',
            function (owner) {
              return owner ? ('Owner - ' + owner) : '';
            }
          ),
          new go.Binding('visible', 'owner').ofModel()
        ),
        $(go.Panel, 'Vertical',
          {
            stretch: go.GraphObject.Horizontal
          },
          // Reporting concept list header
          $(go.TextBlock,
            {
              text: 'Reporting Concepts',
              row: 1,
              alignment: go.Spot.Center,
              stroke: 'black',
              font: 'bold 15.25px calibri',
              margin: new go.Margin(5, 0, 0, 0)
            },
            // Hide reporting concepts header if dimension has no reporting concepts
            new go.Binding('visible', 'descendants',
              function (descendants) {
                return descendants.length > 0;
              }
            )
          ),
          // Reporting concept list
          $(go.Panel, 'Vertical',
            {
              name: 'Reporting concept_List',
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'descendants')
          ),
          new go.Binding('visible', 'nextLevel').ofModel()
        )
      )
    );
  }

  getReportingConceptNodeTemplate() {

    // Template for reporting concept nodes
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        selectionAdorned: true,
        resizable: false,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        isShadowed: false,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        // TEMP
        isLayoutPositioned: true
      },
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(go.Shape,
        new go.Binding('figure', 'category', function (category) {
          if (category === 'key') {
            return 'SquareArrow';
          } else if (category === 'list') {
            return 'Process';
          } else {
            return 'InternalStorage';
          }
        }),
        {
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1,
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          name: 'shape',
          fromLinkableDuplicates: false,
          toLinkableDuplicates: false
        }
      ),
      $(go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        // Reporting concept name
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'bold 16px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
        ),
        // Reporting concept description
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'italic 15px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description').ofModel()
        ),
        // Reporting concept tags
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'tags',
            function (tags) {
              return tags ? ('Tags - ' + tags) : '';
            }
          ),
          new go.Binding('visible', 'tags').ofModel()
        ),
        // Reporting concept owners
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'owner',
            function (owner) {
              return owner ? ('Owner - ' + owner) : '';
            }
          ),
          new go.Binding('visible', 'owner').ofModel()
        ),
        $(go.Panel, 'Vertical',
          {
            stretch: go.GraphObject.Horizontal
          },
          // Attribute list header
          $(go.TextBlock,
            {
              text: 'Attributes',
              row: 1,
              alignment: go.Spot.Center,
              stroke: 'black',
              font: 'bold 15.25px calibri',
              margin: new go.Margin(5, 0, 0, 0),
              visible: false
            },
            // Hide attributes header if Reporting concept has no attributes
            new go.Binding('visible', 'attributes',
              function (attributes) {
                return attributes.length > 0;
              }
            )
          ),
          // Attribute list
          $(go.Panel, 'Vertical',
            {
              name: 'Attribute_List',
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'attributes')
          ),
          new go.Binding('visible', 'nextLevel').ofModel()
        )
      )
    );
  }

  CustomLink() {
    go.Link.call(this);
  }

  getLinkDataTemplate(forPalette: boolean = false) {
    return $(
      CustomLink,
      new go.Binding('points', 'route').makeTwoWay(function (points) {
        const PointArray = points.toArray();
        const Path = [];

        for (let i = 0; i < PointArray.length; i++) {
          Path.push(PointArray[i].x);
          Path.push(PointArray[i].y);
        }

        return Path;
      }),
      new go.Binding('visible', 'dataLinks').ofModel(),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing',
        function (routeMissing) {
          return routeMissing || !this.standardDisplay;
        }.bind(this)
      ),
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
        // doubleClick: this.displayMapView.bind(this),
        // TEMP
        isLayoutPositioned: true
      },
      forPalette ? {
        // Set locationSpot in order for palette to arrange link correctly
        locationSpot: go.Spot.TopCenter,
        // Correct locationSpot on selection highlight adornment when link in palette
        selectionAdornmentTemplate: $(go.Adornment, 'Link', {
            locationSpot: new go.Spot(0.5, 0, 1, 0)
          },
          $(go.Shape, {
            isPanelMain: true, fill: null, stroke: 'dodgerblue', strokeWidth: 3
          })
        )
      } : {},
      $(go.Shape, {
          isPanelMain: true,
          stroke: 'black',
          strokeWidth: 2.5
        },
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? {areaBackground: 'transparent'} : {}
      ),
      !forPalette ?
        $(go.Panel, 'Vertical',
          $(go.TextBlock,
            {
              font: 'bold 14px calibri'
            },
            new go.Binding('areaBackground', 'name',
              function (name) {
                return (name ? 'white' : null);
              }
            ),
            new go.Binding('text', 'name'),
            new go.Binding('visible', 'linkName').ofModel()
          ),
          $(go.TextBlock,
            {
              font: '13px calibri'
            },
            new go.Binding('areaBackground', 'label',
              function (label) {
                return (label ? 'white' : null);
              }
            ),
            new go.Binding('text', 'label'),
            new go.Binding('visible', 'linkLabel').ofModel()
          )
        ) : {},
      $(
        go.Shape, // The 'to' arrowhead
        {
          scale: 1.2,
          stroke: 'Black',
          toArrow: 'Triangle'
        },
        new go.Binding('visible', 'layer',
          function(layer) {return layer !== layers.system; }
        )
      )
    );
  }

  getLinkMasterDataTemplate(forPalette: boolean = false) {
    return $(
      CustomLink,
      new go.Binding('points', 'route').makeTwoWay(function (points) {

        const PointArray = points.toArray();
        const Path = [];

        for (let i = 0; i < PointArray.length; i++) {
          Path.push(PointArray[i].x);
          Path.push(PointArray[i].y);
        }

        return Path;
      }),
      new go.Binding('visible', 'masterDataLinks').ofModel(),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing',
        function (routeMissing) {
          return routeMissing || !this.standardDisplay;
        }.bind(this)
      ),
      {
        selectionAdorned: true,
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver,
        relinkableFrom: true,
        relinkableTo: true,
        // contextMenu: PartContextMenu,
        fromEndSegmentLength: 20,
        toEndSegmentLength: 20,
        // Position by layout in palette
        isLayoutPositioned: true // forPalette
      },
      forPalette ? {
        // Set locationSpot in order for palette to arrange link correctly
        locationSpot: go.Spot.TopCenter,
        // Correct locationSpot on selection highlight adornment when link in palette
        selectionAdornmentTemplate: $(go.Adornment, 'Link', {
            locationSpot: go.Spot.TopCenter
          },
          $(go.Shape, {
            isPanelMain: true, fill: null, stroke: 'dodgerblue', strokeWidth: 3
          })
        )
      } : {},
      $(go.Shape, {
          isPanelMain: true,
          stroke: 'Black',
          strokeWidth: 2.5,
          strokeDashArray: [5, 5]
        },
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? {areaBackground: 'transparent'} : {}
      ),
      !forPalette ?
        $(go.Panel, 'Vertical',
          $(go.TextBlock,
            {
              font: 'bold 14px calibri'
            },
            new go.Binding('areaBackground', 'name',
              function (name) {
                return (name ? 'white' : null);
              }
            ),
            new go.Binding('text', 'name'),
            new go.Binding('visible', 'linkName').ofModel()
          ),
          $(go.TextBlock,
            {
              font: '13px calibri'
            },
            new go.Binding('areaBackground', 'label',
              function (label) {
                return (label ? 'white' : null);
              }
            ),
            new go.Binding('text', 'label'),
            new go.Binding('visible', 'linkLabel').ofModel()
          )
        ) : {},
    );
  }

  getModelGroupTemplate() {
    // Template for model groups in mapping view
    return $(
      go.Group,
      'Vertical', {
        layout: $(go.GridLayout, {
          wrappingColumn: 1,
          spacing: new go.Size(NaN, 20),
          alignment: go.GridLayout.Location,
          isOngoing: true,
          isInitial: true,
          // Function to compare nodes for ordering during layout
          comparer: function (a, b) {
            // Only perform this comparison for initial layout. This prevents users' reordering of nodes from being overridden.
            if (this.groupLayoutInitial) {
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
        locationSpot: go.Spot.TopCenter,
        locationObjectName: 'shape',
        isLayoutPositioned: true,
        layoutConditions: go.Part.LayoutStandard,
        selectable: false,
        avoidable: false,
        minSize: new go.Size(250, 0)
      },
      new go.Binding('location', 'location', go.Point.parse),
      $(go.Panel, 'Auto',
        {stretch: go.GraphObject.Fill},
        $(go.Shape,
          {
            fill: '#ebe9ea',
            stroke: 'transparent',
            strokeWidth: 2,
            name: 'shape'
          }
        ),
        $(go.Panel,
          'Vertical',
          {margin: 10},
          $(go.TextBlock,
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
          $(go.Placeholder, {alignment: go.Spot.TopCenter})
        )
      )
    );
  }
}
