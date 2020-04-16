import * as go from 'gojs';
import 'gojs/extensions/Figures.js';
import {layers, middleOptions, nodeCategories, Tag, TagColour} from '@app/architecture/store/models/node.model';
import {Injectable} from '@angular/core';
import {CustomLink, defineRoundButton, GojsCustomObjectsService} from './gojs-custom-objects.service';
import {DiagramLevelService, Level} from './diagram-level.service';
import {DiagramChangesService} from '@app/architecture/services/diagram-changes.service';
import {Store} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/core/store';
import {getFilterLevelQueryParams} from '@app/core/store/selectors/route.selectors';
import {linkCategories} from '@app/architecture/store/models/node-link.model';
import {Subject} from 'rxjs';

function textFont(style?: string): Object {
  const font = getComputedStyle(document.body).getPropertyValue('--default-font');
  return {
    font: `${style} ${font}`
  };
}

const $ = go.GraphObject.make;

// Create definition for button with round shape
defineRoundButton();

// Custom layout for system groups.
//   Based on GridLayout but with custom initialOrigin method.
function SystemGroupLayout() {
  go.GridLayout.call(this);
}

go.Diagram.inherit(SystemGroupLayout, go.GridLayout);

SystemGroupLayout.prototype.initialOrigin = function(): go.Point {
  const memberArea = this.group.resizeObject;
  const initialOriginLocal = new go.Point(memberArea.actualBounds.centerX, memberArea.actualBounds.top + 12);
  return memberArea.getDocumentPoint(initialOriginLocal);
};
// End system group layout

const nodeWidth = 300;

@Injectable()
export class DiagramTemplatesService {
  private currentFilterLevel: Level;
  public forPalette = false;

  // Observable to indicate that a child set is to be added to a node
  private addChildSource = new Subject();
  public addChild$ = this.addChildSource.asObservable();

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
        locationObjectName: 'location panel',
        dragComputation: this.gojsCustomObjectsService.avoidNodeOverlap.bind(this.gojsCustomObjectsService)
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
            contextMenu: this.gojsCustomObjectsService.getLinkContextMenu()
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
          textFont('18px'),
          {
            stroke: 'black',
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
      },
      new go.Binding('fill', 'backgroundColour')
      ),
      $(go.Panel,
        'Horizontal',
        {
          stretch: go.GraphObject.Vertical,
          margin: new go.Margin(2, 2, 0, 2)
        },
        $(go.Picture,
          {
            desiredSize: new go.Size(25, 25),
            imageStretch: go.GraphObject.Uniform
          },
          new go.Binding('source', 'iconName',
            function(iconName) {
              if (iconName) {
                return `/assets/tag-icons/${iconName}.svg`;
              } else {
                return '';
              }
            }
          ),
          new go.Binding('visible', 'iconName',
            function(iconName) {
              return !!iconName;
            }
          )
        ),
        $(
          go.TextBlock,
          textFont('bold italic 20px'),
          {
            wrap: go.TextBlock.None
          },
          new go.Binding('text', 'name'),
          new go.Binding('stroke', 'textColour')
        )
      )
    );
  }

  // Template for tag icons as displayed in node's title row
  getTitleTagIconTemplate(): go.Panel {
    return $(go.Panel,
      'Auto',
      $(go.Picture,
        {
          desiredSize: new go.Size(25, 25)
        },
        new go.Binding('source', 'iconName',
          function(iconName: string): string {
            return `assets/tag-icons/${iconName}.svg`;
          }
        )
      )
    );
  }

  // Get button for revealing the next level of dependencies
  getDependencyExpandButton(forTransformation = false): go.Panel {
    return $(
      'Button',
      forTransformation ? {
        alignment: go.Spot.TopRight,
        margin: new go.Margin(2, 2, 0, 0)
      } : {
        column: 4,
        row: 0,
        alignment: go.Spot.Right,
        margin: new go.Margin(0, 0, 0, 5)
      },
      {
        name: 'DependencyExpandButton',
        desiredSize: new go.Size(20, 20),
        click: function(event, button) {
          const node = button.part;
          this.diagramChangesService.showDependencies(node);
        }.bind(this)
      },
      $(go.TextBlock, textFont('bold 18px'), '+', {
        alignment: go.Spot.Center,
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
        column: 3,
        row: 0,
        name: 'TopExpandButton',
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        visible: (this.forPalette) ? false : true,
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
        textFont('bold 18px'),
        {
          alignment: go.Spot.Center,
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
        row: 0,
        column: 3,
        name: 'TopMenuButton',
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        visible: (this.forPalette) ? false : true,
        click: function(event, button) {
          const menu = this.gojsCustomObjectsService.getPartButtonMenu(true);
          event.diagram.select(button.part);
          menu.adornedObject = button.part;

          button.part.adornments.first().zOrder = 0;
          button.part.updateAdornments();

          button.part.addAdornment('ButtonMenu', menu);

          // Ensure that menu does not appear outside of diagram bounds
          this.diagramChangesService.updateViewAreaForMenu(menu);

        }.bind(this)
      },
      $(
        go.TextBlock,
        textFont('bold 18px'),
          {
            alignment: go.Spot.Center,
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
      )
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
        visible: (this.forPalette) ? false : true,
        click: function(event, button): void {
          const node = button.part;

          event.diagram.model.setDataProperty(node.data, 'middleExpanded', middleOptions.children);

          this.diagramChangesService.nodeExpandChanged(node);
        }.bind(this)
      },
      $(
        go.TextBlock,
        textFont('bold 18px'),
        '+',
        {
          alignment: go.Spot.Center,
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
        textFont('12px'),
        {
          textAlign: 'center',
          stroke: radioColours[type] === 'yellow' ? 'black' : 'white',
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
            (link.diagram.model.modelData.linkRadio && anyRadios)
          );
        }
      }).ofObject(),
      $(
        go.Panel,
        'Vertical',
        $(
          go.TextBlock,
          textFont('bold 14px'),
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'linkName').ofModel()
        ),
        this.getRadioAlertIndicators()
      )
    );
  }

  // Get top section of nodes, containing icons and name
  getTopSection(isSystem = false): go.Panel {
    return $(
      go.Panel,
      'Table',
      {
        name: 'top',
        row: 0,
        alignment: go.Spot.TopCenter,
        stretch: go.GraphObject.Horizontal,
        minSize: new go.Size(nodeWidth, 30),
        margin: new go.Margin(5),
        maxSize: new go.Size(nodeWidth, 30)
      },
      new go.Binding('maxSize', 'middleExpanded', function(middleExpanded) {
        return middleExpanded !== middleOptions.group ?
          new go.Size(nodeWidth, 30) : new go.Size(NaN, 30);
      }),
      $(go.RowColumnDefinition, { column: 0, maximum: 50}),
      $(go.RowColumnDefinition, { column: 1 }),
      $(go.RowColumnDefinition, { column: 2 }),
      $(go.RowColumnDefinition, { column: 3, width: 25 }),
      $(go.RowColumnDefinition, { column: 4 }),
      this.getDependencyExpandButton(),
      $(go.Panel,
        'Horizontal',
        {
          column: 0,
          row: 0,
          alignment: go.Spot.Left,
        },
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
        // Icon to indicate that the system group contains group members
        isSystem ? $(go.Picture,
          {
            desiredSize: new go.Size(25, 25),
            source: '/assets/node-icons/group.svg'
          },
          new go.Binding('visible', 'members', function(groupMembers) {
            return groupMembers.length > 0;
          })
        ) : {}
      ),
      $(go.Panel,
        'Horizontal',
        {
          column: 1,
          row: 0,
        },
        // Panel to contain tag icons
        $(go.Panel,
          'Horizontal',
          {
            itemTemplate: this.getTitleTagIconTemplate()
          },
          new go.Binding('itemArray', 'tags',
            function(tags: Tag[]): Tag[] {
              let iconTags = tags.concat();

              // Filter out any tags without an icon
              iconTags = iconTags.filter(
                function(tag: Tag): boolean {
                  return !!tag.iconName;
                }
              );
              // Restrict tag icons in title row to a maximum of five
              iconTags = iconTags.slice(0, 5);

              return iconTags;
            }
          )
        ),
        // Ellipsis to indicate that there are additional tag
        //  icons associated with the node
        $(go.TextBlock,
          '...',
          textFont('bold 18px'),
          {
            margin: new go.Margin(0, 0, 0, 4)
          },
          // Should only be visible if there are more than five
          //  tags with icons against the  node
          new go.Binding('visible', 'tags',
            function(tags: Tag[]): boolean {
              return tags.filter(
                function (tag: Tag): boolean {
                  return !!tag.iconName;
                }
              ).length > 5;
            }
          )
        )
      ),
      $(
        go.TextBlock,
        textFont('bold italic 20px'),
        {
          column: 2,
          row: 0,
          textAlign: 'left',
          margin: new go.Margin(0, 5, 0, 5),
          wrap: go.TextBlock.None,
          overflow: go.TextBlock.OverflowEllipsis,
          stretch: go.GraphObject.Horizontal,
          alignment: go.Spot.Left,
          toolTip: $('ToolTip', $(go.TextBlock, new go.Binding('text', 'name')))
        },
        new go.Binding('text', 'name'),
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
        textFont('16px'),
        {
          textAlign: 'center',
          stroke: 'black',
          stretch: go.GraphObject.Horizontal,
          maxSize: new go.Size(nodeWidth - 10, Infinity),
          margin: new go.Margin(5, 0, 0, 0)
        },
        new go.Binding('text', 'description'),
        new go.Binding('visible', 'description').ofModel()
      ) : {},
      $(
        go.TextBlock,
        textFont('italic 16px'),
        {
          textAlign: 'center',
          stroke: 'black',
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
        new go.Binding('visible', '', function(node): boolean {
          return node.diagram.model.modelData.owners &&
            node.data.middleExpanded !== middleOptions.group;
        }).ofObject()
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
          isSystem ? $(go.TextBlock, textFont('italic 18px'),
            'Data sets',
            {
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
          $(go.TextBlock, textFont('italic 18px'),
            'Grouped Items',
            {
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
            height: 200,
            minSize: new go.Size(nodeWidth + 20, 200)
          },
          new go.Binding('desiredSize', 'areaSize', go.Size.parse).makeTwoWay(go.Size.stringify),
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
          function(tags: Tag[]): Tag[] {
            if (tags.length === 0) {
              return tags;
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
  getTruncatedTags(tags: Tag[]): Tag[] {
    let tagGroup;

    const tagArray = tags.concat();

    // Temporary part to measure size from
    tagGroup = createTempPanel.call(this, tagArray);

    // If size of tag section too big then...
    if (tagGroup.naturalBounds.right > nodeWidth - 4) {
      // ...add an ellipsis to the end of the tag list to show that some tags are not shown...
      tagArray.push({
        id: '00000000-0000-0000-0000-000000000000',
        name: '...',
        applicableTo: [],
        textColour: TagColour.black,
        backgroundColour: TagColour.white,
        iconName: null
      });

      // ...and remove each tag before the ellipsis until the section fits
      do {
        tagArray.splice(-2, 1);
        tagGroup = createTempPanel.call(this, tagArray);
      } while (tagGroup.naturalBounds.right > nodeWidth - 4);
    }

    return tagArray;

    // Create a temporary part with the given tags
    function createTempPanel(array: Tag[]): go.Panel {
      const panel = $(go.Part, 'Horizontal', {
        itemTemplate: this.getTagTemplate(),
        itemArray: array
      });
      panel.ensureBounds();
      return panel;
    }
  }

  getTransformationNodeTemplate(forPalette: boolean = false): go.Node {
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      this.getStandardNodeOptions(false),
      {
        contextMenu: null,
        doubleClick: (forPalette) ? undefined : this.diagramLevelService.displayMapView.bind(this.diagramLevelService)
      },
      new go.Binding(
        'movable',
        '',
        function() {
          return this.currentFilterLevel !== Level.usage;
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
      // Have the diagram position the node if no location set or in node usage view
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      $(go.Shape,
        this.getStandardNodeShapeOptions(),
        {
          desiredSize: new go.Size(60.3, 53.6)
        },
        // Bind stroke to multicoloured brush based on work packages impacted by
        new go.Binding(
          'stroke',
          'impactedByWorkPackages',
          function(impactedPackages, shape) {
            return this.getStrokeForImpactedWorkPackages(impactedPackages, shape.part);
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
      $(go.Picture,
        {
          source: 'assets/node-icons/transformation.svg',
          alignment: go.Spot.Center,
          maxSize: new go.Size(82, 82),
          imageStretch: go.GraphObject.Uniform
        }
      ),
      this.getDependencyExpandButton(true)
    );
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
          if (event.targetObject.name.includes('Button') || forPalette) {
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
      // Have the diagram position the node if no location set or in node usage view
      new go.Binding('isLayoutPositioned', 'locationMissing', function(locationMissing) {
        return locationMissing || this.currentFilterLevel === Level.usage;
      }.bind(this)),
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
        layout: $(SystemGroupLayout as any,
          {
            wrappingColumn: 1,
            isOngoing: false,
            isInitial: true,
            alignment: go.GridLayout.Location,
            spacing: new go.Size(NaN, 12)
          },
        ),
        subGraphExpandedChanged: this.diagramChangesService.systemSubGraphExpandChanged.bind(this.diagramChangesService),
        resizeObjectName: 'Group member area',
        doubleClick: function(event, node) {

          // Do not proceed for double clicks on buttons on the node
          if (event.targetObject.name.includes('Button') || forPalette) {
            return;
          }

          this.gojsCustomObjectsService.showDetailTabSource.next();

        }.bind(this),
        dragComputation: function(part, pt, gridpt) {
          // don't constrain top-level nodes
          const grp = part.containingGroup;
          if (grp === null) { return this.gojsCustomObjectsService.avoidNodeOverlap(part, pt, gridpt); }
          // try to stay within the background Shape of the Group
          const back = grp.resizeObject;
          if (back === null) { return pt; }
          const p1 = back.getDocumentPoint(go.Spot.TopLeft);
          const p2 = back.getDocumentPoint(go.Spot.BottomRight);
          const b = part.actualBounds;
          const loc = part.location;

          p1.offset(loc.x - b.x, loc.y - b.y);
          p2.offset(loc.x - b.x, loc.y - b.y);

          // now limit the location appropriately
          const x = Math.max(p1.x, Math.min(pt.x, p2.x - b.width - 1)) ;
          const y = Math.max(p1.y, Math.min(pt.y, p2.y - b.height - 1));
          const newPoint = new go.Point(x, y);

          return this.gojsCustomObjectsService.avoidNodeOverlap(part, newPoint, newPoint);
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
      new go.Binding('resizable', 'middleExpanded', function(middleExpanded) {
        return middleExpanded === middleOptions.group;
      }),
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
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing', function(locationMissing) {
        return locationMissing || this.currentFilterLevel === Level.usage;
      }.bind(this)),
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
      new go.Binding('relinkableFrom', '', function() {
        return !this.currentFilterLevel.includes('map');
      }.bind(this)),
      new go.Binding('relinkableTo', '', function() {
        return !this.currentFilterLevel.includes('map');
      }.bind(this)),
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'dataLinks').ofModel(),
      // Have the diagram position the link if no route set
      new go.Binding('isLayoutPositioned', 'routeMissing'),
      new go.Binding('fromSpot', 'fromSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
      new go.Binding('toSpot', 'toSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
      this.getStandardLinkOptions(forPalette),
      {
        doubleClick: (forPalette) ? undefined :
          this.diagramChangesService.getMapViewForLink.bind(this.diagramChangesService)
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
        new go.Binding('visible', 'strokeWidth',
          function(strokeWidth: number): boolean {
            return strokeWidth > 0;
          }
        ).ofObject('shape')
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
      new go.Binding('relinkableFrom', '', function() {
        return !this.currentFilterLevel.includes('map');
      }.bind(this)),
      new go.Binding('relinkableTo', '', function() {
        return !this.currentFilterLevel.includes('map');
      }.bind(this)),
      // Disable select for links that are set to not be shown
      new go.Binding('selectable', 'masterDataLinks').ofModel(),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing'),
      this.getStandardLinkOptions(forPalette),
      {
        doubleClick: function(event: go.InputEvent, object: go.Link): void {
          if (forPalette) {
            return;
          }

          if ([layers.system, layers.dataSet].includes(object.data.layer)) {
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
      !forPalette ? this.getLinkLabel() : {},
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
        computesBoundsAfterDrag: true,
        computesBoundsIncludingLocation: false,
        computesBoundsIncludingLinks: false,
        locationSpot: new go.Spot(0.5, 0, 0, -30),
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
            textFont('bold 20px'),
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
              click: function() {
                this.addChildSource.next();
              }.bind(this)
            },
            // Disable button if moves not allowed in diagram
            new go.Binding('isEnabled', '', function(node) {
              return this.gojsCustomObjectsService.diagramEditable;
            }.bind(this)),
            $(go.TextBlock, textFont('bold 22px'), '+',
              {
                alignment: go.Spot.Center,
                desiredSize: new go.Size(300, 30),
                textAlign: 'center',
                verticalAlignment: go.Spot.Center
              },
              new go.Binding('stroke', 'isEnabled', function(enabled) {
                return enabled ? 'black' : '#AAAFB4';
              }).ofObject('addChildButton')
            ),
          )
        )
      )
    );
  }
}
