import * as go from 'gojs';
import 'gojs/extensions/Figures.js';
import {layers, middleOptions, nodeCategories} from '@app/architecture/store/models/node.model';
import { Injectable } from '@angular/core';
import { CustomLink, GojsCustomObjectsService, customIcons, defineRoundButton } from './gojs-custom-objects.service';
import { DiagramLevelService, Level } from './diagram-level.service';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { getFilterLevelQueryParams } from '@app/core/store/selectors/route.selectors';

const $ = go.GraphObject.make;

// Create definition for button with round shape
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

  getTagTemplate(): go.Panel {
    return $(
      go.Panel,
      'Auto',
      {
        margin: new go.Margin(0, 5, 0, 0)
      },
      $(go.Shape, 'RoundedRectangle', {
        fill: 'white',
        height: 27
      }),
      $(
        go.TextBlock,
        {
          font: 'bold italic 20px calibri',
          wrap: go.TextBlock.None,
          margin: new go.Margin(2, 2, 0, 2)
        },
        new go.Binding('text', '')
      )
    );
  }

  // Get button for revealing the next level of dependencies
  getDependencyExpandButton(): go.Panel {
    return $(
      'Button',
      {
        name: 'DependencyExpandButton',
        alignment: go.Spot.LeftCenter,
        desiredSize: new go.Size(20, 20),
        margin: new go.Margin(0, 5, 0, 0),
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
        name: 'TopExpandButton',
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        click: function(event, button) {
          const node = button.part;

          event.diagram.model.setDataProperty(
            node.data,
            'bottomExpanded',
            (node.data.middleExpanded === middleOptions.children) || !node.data.bottomExpanded
          );
          event.diagram.model.setDataProperty(node.data, 'middleExpanded', middleOptions.none);

          this.diagramChangesService.nodeExpandChanged(node);
        }.bind(this)
      },
      $(
        go.TextBlock,
        {
          alignment: go.Spot.Center,
          font: 'bold 18px calibri',
          desiredSize: new go.Size(25, 25),
          textAlign: 'center',
          verticalAlignment: go.Spot.Center
        },
        // Grey out text when button disabled
        new go.Binding('text', '', function(data) {
          return (data.middleExpanded === middleOptions.children) || data.bottomExpanded ? '-' : '+';
        }),
        new go.Binding('stroke', 'isEnabled', function(enabled) {
          return enabled ? 'black' : '#AAAFB4';
        }).ofObject('TopExpandButton')
      ),
      // Disable button if moves not allowed in diagram
      new go.Binding('isEnabled', '', function(node) {
        return node.diagram.allowMove;
      }).ofObject()
    );
  }

  // Get menu button for system nodes.
  //  When clicked, provides a menu with actions to take, relating to the node.
  getTopMenuButton(): go.Panel {
    return $(
      'RoundButton',
      {
        name: 'TopMenuButton',
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        click: function(event, button) {
          const menu = this.gojsCustomObjectsService.getPartButtonMenu();
          event.diagram.select(button.part);
          menu.adornedObject = button.part;

          button.part.adornments.first().zOrder = 0;
          button.part.updateAdornments();

          button.part.addAdornment('ButtonMenu', menu);
        }.bind(this)
      },
      $(
        go.TextBlock,
          {
            alignment: go.Spot.Center,
            font: 'bold 18px calibri',
            desiredSize: new go.Size(25, 25),
            textAlign: 'center',
            verticalAlignment: new go.Spot(0.5, 0, 0, -1.5),
            text: '...',
            angle: 90
          },
        // Grey out text when button disabled
        new go.Binding('stroke', 'isEnabled', function(enabled) {
          return enabled ? 'black' : '#AAAFB4';
        }).ofObject('TopMenuButton')
      ),
      // Disable menu when layout not editable
      new go.Binding('isEnabled', '', function(node: go.Node): boolean {
         return node.diagram.allowMove;
      }).ofObject()
    );
  }

  // Get bottom button for expanding and collapsing node sections.
  // Expands the middle section of nodes when clicked.
  getBottomExpandButton(): go.Panel {
    return $(
      'RoundButton',
      {
        name: 'BottomExpandButton',
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        click: function(event, button): void {
          const node = button.part;

          event.diagram.model.setDataProperty(node.data, 'middleExpanded', middleOptions.children);

          this.diagramChangesService.nodeExpandChanged(node);
        }.bind(this)
      },
      $(
        go.TextBlock,
        '+',
        {
          alignment: go.Spot.Center,
          font: 'bold 18px calibri',
          desiredSize: new go.Size(25, 25),
          textAlign: 'center',
          verticalAlignment: go.Spot.Center
        },
        // Grey out text when button disabled
        new go.Binding('stroke', 'isEnabled', function(enabled: boolean): string {
          return enabled ? 'black' : '#AAAFB4';
        }).ofObject('TopExpandButton')
      ),
      // Disable button if moves not allowed in diagram
      new go.Binding('isEnabled', '', function(node: go.Node): boolean {
        return node.diagram.allowMove;
      }).ofObject(),
      // Button not visible when middle node section is collapsed
      new go.Binding('visible', 'middleExpanded', function(middleExpanded) {
        return middleExpanded === middleOptions.none;
      })
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
  getTopSection(isSystem = false): go.Panel {
    return $(
      go.Panel,
      'Horizontal',
      {
        name: 'top',
        row: 0,
        alignment: go.Spot.TopCenter,
        stretch: go.GraphObject.Horizontal,
        minSize: new go.Size(NaN, 30),
        margin: new go.Margin(5)
      },
      this.getDependencyExpandButton(),
      // Node icon, to appear at the top left of the node
      $(
        go.Picture,
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

          return [
            imageFolderPath,
            layerImagePrefix[data.layer],
            separator,
            categoryImageSuffix[data.category],
            '.svg'
          ].join('');
        })
      ),
      $(
        go.TextBlock,
        {
          textAlign: 'left',
          font: 'bold italic 20px calibri',
          margin: new go.Margin(0, 5, 0, 5),
          wrap: go.TextBlock.None,
          overflow: go.TextBlock.OverflowEllipsis,
          toolTip: $('ToolTip', $(go.TextBlock, new go.Binding('text', 'name')))
        },
        new go.Binding('text', 'name'),
        // Size name textblock to account for presence/absence of dependency expand button
        new go.Binding('width', 'visible', function(expandButtonVisible: boolean): number {
          return expandButtonVisible ? nodeWidth - 95 : nodeWidth - 70;
        }).ofObject('DependencyExpandButton'),
        new go.Binding('opacity', 'name', function(name: boolean): number {
          return name ? 1 : 0;
        }).ofModel()
      ),
      isSystem ? this.getTopMenuButton() : this.getTopExpandButton()
    );
  }

  // Get middle section of nodes, containing description, owners and descendants
  getMiddleSection(isSystem = false): go.Panel {
    return $(
      go.Panel,
      'Vertical',
      {
        name: 'middle',
        row: 1,
        stretch: go.GraphObject.Horizontal,
        margin: new go.Margin(5),
        visible: false
      },
      new go.Binding('visible', 'middleExpanded',
        function(middleExpanded) {
          return middleExpanded !== middleOptions.none;
        }
      ),
      // Do not show description for systems
      !isSystem ? $(
        go.TextBlock,
        {
          textAlign: 'center',
          stroke: 'black',
          font: '16px Calibri',
          stretch: go.GraphObject.Horizontal,
          maxSize: new go.Size(nodeWidth - 10, Infinity),
          margin: new go.Margin(5, 0, 0, 0)
        },
        new go.Binding('text', 'description'),
        new go.Binding('visible', 'description').ofModel()
      ) : {},
      $(
        go.TextBlock,
        {
          textAlign: 'center',
          stroke: 'black',
          font: 'italic 16px Calibri',
          stretch: go.GraphObject.Horizontal,
          maxSize: new go.Size(nodeWidth - 10, Infinity),
          margin: new go.Margin(5, 0, 0, 0)
        },
        new go.Binding('text', 'owners', function(owners: any[]): string {
          return owners.length > 0
            ? 'Owners - ' +
                owners
                  .map(function(owner): string {
                    return owner.name;
                  })
                  .join(', ')
            : '';
        }),
        new go.Binding('visible', 'owners').ofModel()
      ),
      $(
        go.Panel,
        'Vertical',
        {
          stretch: go.GraphObject.Horizontal
        },
        // Descendants list
        $(go.Panel,
          'Vertical',
          {
            alignment: go.Spot.TopLeft,
            stretch: go.GraphObject.Horizontal
          },
          isSystem ? $(go.TextBlock,
            'Data sets',
            {
              font: 'italic 18px calibri',
              textAlign: 'center',
              stretch: go.GraphObject.Horizontal,
              margin: new go.Margin(0, 0, 2, 0)
            }
          ) : {},
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
            new go.Binding('itemArray', 'descendants'),
            new go.Binding('visible', 'nextLevel').ofModel()
          ),
          new go.Binding('visible', 'middleExpanded',
            function(middleExpanded) {
              return middleExpanded === middleOptions.children;
            }
          )
        ),
        // Grouped members list
        $(go.Panel,
          'Vertical',
          {
            alignment: go.Spot.TopLeft,
            defaultAlignment: go.Spot.Left,
            stretch: go.GraphObject.Horizontal
          },
          $(go.TextBlock,
            'Grouped Items',
            {
              font: 'italic 18px calibri',
              textAlign: 'center',
              alignment: go.Spot.TopCenter,
              stretch: go.GraphObject.Horizontal,
              margin: new go.Margin(0, 0, 2, 0)
            }
          ),
          $(go.Panel,
            'Vertical',
            {
              name: 'Groups List',
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemCategoryProperty: '',
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'members')
          ),
          new go.Binding('visible', 'middleExpanded',
            function (middleExpanded) {
              return middleExpanded === middleOptions.groupList;
            }
          )
        ),
        // Area for grouped systems to appear in
        $(go.Shape,
          {
            name: 'Group member area',
            figure: 'rectangle',
            stroke: null,
            fill: null,
            stretch: go.GraphObject.Horizontal,
            height: 200
          },
          new go.Binding('visible', 'middleExpanded',
            function(middleExpanded) {
              return middleExpanded === middleOptions.group;
            }
          )
        )
      )
    );
  }

  // Get bottom section of nodes, containing tags and RADIO Alert indicators
  getBottomSection(isSystem = false): go.Panel {
    return $(
      go.Panel,
      'Vertical',
      {
        name: 'bottom',
        row: 2,
        stretch: go.GraphObject.Horizontal,
        margin: new go.Margin(2)
      },
      new go.Binding('visible', 'bottomExpanded').makeTwoWay(),
      $(
        go.Panel,
        'Horizontal',
        {
          maxSize: new go.Size(296, NaN),
          itemTemplate: this.getTagTemplate(),
          alignment: go.Spot.LeftCenter,
          margin: new go.Margin(3, 0, 3, 0)
        },
        new go.Binding(
          'itemArray',
          'tags',
          function(tags: string): string[] {
            if (tags.trim() === '') {
              return [];
            }

            return this.getTruncatedTags(tags);
          }.bind(this)
        ),
        new go.Binding('visible', 'tags').ofModel()
      ),
      $(
        go.Panel,
        'Spot',
        {
          alignment: go.Spot.BottomCenter,
          alignmentFocus: go.Spot.BottomCenter
        },
        $(go.Panel, '', {
          desiredSize: new go.Size(nodeWidth - 10, 30)
        }),
        this.getRadioAlertIndicators(),
        isSystem ? {} : this.getBottomExpandButton()
      )
    );
  }

  // Gets an array of tags, truncated to fit in the node if necessary
  getTruncatedTags(tags: string): string[] {
    let tagGroup;

    // Tags separated by commas. Also, trim any excess whitespace.
    const tagArray = tags.split(',').map(function(tag) {
      return tag.trim();
    });

    // Temporary part to measure size from
    tagGroup = createTempPanel.call(this, tagArray);

    // If size of tag section too big then...
    if (tagGroup.naturalBounds.right > nodeWidth - 4) {
      // ...add an ellipsis to the end of the tag list to show that some tags are not shown...
      tagArray.push('...');

      // ...and remove each tag before the ellipsis until the section fits
      do {
        tagArray.splice(-2, 1);
        tagGroup = createTempPanel.call(this, tagArray);
      } while (tagGroup.naturalBounds.right > nodeWidth - 4);
    }

    return tagArray;

    // Create a temporary part with the given tags
    function createTempPanel(array: string[]): go.Panel {
      const panel = $(go.Part, 'Horizontal', {
        itemTemplate: this.getTagTemplate(),
        itemArray: array
      });
      panel.ensureBounds();
      return panel;
    }
  }

  getNodeTemplate(forPalette: boolean = false): go.Node {
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      this.getStandardNodeOptions(forPalette),
      {
        doubleClick: function(event, node) {
          // Do not proceed for double clicks on buttons on the node
          if (event.targetObject.name.includes('Button')) {
            return;
          }

          this.diagramLevelService.changeLevelWithFilter.call(this, event, node);
        }.bind(this)
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
          defaultRowSeparatorStroke: 'black'
        },
        this.getTopSection(),
        this.getMiddleSection(),
        this.getBottomSection()
      )
    );
  }

  getSystemGroupTemplate(forPalette: boolean = false): go.Group {
    return $(
      go.Group,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      this.getStandardNodeOptions(forPalette),
      {
        doubleClick: function(event, node) {

          // Do not proceed for double clicks on buttons on the node
          if (event.targetObject.name.includes('Button')) {
            return;
          }

          this.gojsCustomObjectsService.showDetailTabSource.next();

        }.bind(this)
      },
      new go.Binding('isSubGraphExpanded', 'middleExpanded',
        function(middleExpanded): boolean {
          return middleExpanded === middleOptions.group;
        }
      ),
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
        new go.Binding('fromSpot', 'group', function(group) {
          if (group) {
            return go.Spot.LeftRightSides;
          } else {
            return go.Spot.AllSides;
          }
        }),
        new go.Binding('toSpot', 'group', function(group) {
          if (group) {return go.Spot.LeftRightSides;
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
          defaultRowSeparatorStroke: 'black'
        },
        this.getTopSection(true),
        this.getMiddleSection(true),
        this.getBottomSection(true)
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
      // Prevent links to/from nodes in collapsed groups from being visible
      new go.Binding('visible', '', function(link): boolean {
        if (link.toNode && link.fromNode) {
          return link.fromNode.isVisible() && link.toNode.isVisible();
        } else {
          return true;
        }
      }).ofObject(),
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
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'masterDataLinks').ofModel(),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing'),
      // Prevent links to/from nodes in collapsed groups from being visible
      new go.Binding('visible', '', function(link): boolean {
        if (link.toNode && link.fromNode) {
          return link.fromNode.isVisible() && link.toNode.isVisible();
        } else {
          return true;
        }
      }).ofObject(),
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

  // Get template for master data links
  getLinkCopyTemplate(): CustomLink {
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
      this.getLinkLabel()
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
