import * as go from 'gojs';
import 'gojs/extensions/Figures.js';
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
import {CustomLink, defineRoundButton, GojsCustomObjectsService} from './gojs-custom-objects.service';
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
import {PackedLayout} from 'gojs/extensionsTS/PackedLayout';


function textFont(style?: string): Object {
  const font = getComputedStyle(document.body).getPropertyValue('--default-font');
  return {
    font: `${style} ${font}`
  };
}

const $ = go.GraphObject.make;

// Create definition for button with round shape
defineRoundButton();


// Custom layout for system/data groups.
//   Based on PackedLayout.
function StandardGroupLayout() {
  PackedLayout.call(this);
}

go.Diagram.inherit(StandardGroupLayout, PackedLayout);

StandardGroupLayout.prototype.initialOrigin = function(): go.Point {
  const memberArea = this.group.findObject('Group member area');
  const initialOriginLocal = new go.Point(memberArea.actualBounds.left + 10, memberArea.actualBounds.top + 12);
  return memberArea.getDocumentPoint(initialOriginLocal);
};

StandardGroupLayout.prototype.doLayout = function(coll: go.Diagram | go.Group | go.Iterable<go.Part>): void {
  if (this.group && !this.group.isSubGraphExpanded) {
    return;
  }
  const memberAreaBounds = this.group.findObject('Group member area').getDocumentBounds();
  const memberAreaSize = memberAreaBounds.size;
  this.size = new go.Size(Math.max(300, memberAreaSize.width - 20), Math.max(54, memberAreaSize.height - 24));

  this.group.memberParts.each(function(member) {
    if (!memberAreaBounds.containsRect(member.getDocumentBounds())) {
      member.isLayoutPositioned = true;
    }
  });

  PackedLayout.prototype.doLayout.call(this, coll);
};

// End system/data group layout

const containerColour = '#F8C195';

@Injectable()
export class DiagramTemplatesService {
  private currentFilterLevel: Level;
  public forPalette = false;

  // Observable to indicate that a child is to be added to a node
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
        '',
        {
          background: 'white',
          margin: new go.Margin(1),
          padding: new go.Margin(7, 2, 1, 2)
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
        margin: new go.Margin(0, 5, 0, 5)
      },
      $(go.Shape, 'RoundedRectangle', {
        fill: 'transparent',
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
              return iconName && iconName !== 'none' ? `assets/tag-icons/${iconName}.svg` : '';
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
      $(go.Shape, {fill: null, stroke: null }),
      $(go.Shape,
        'Circle',
        {
          desiredSize: new go.Size(28, 28),
          stroke: null,
          fill: null
        },
        new go.Binding('fill', 'backgroundColour')
      ),
      $(go.Picture,
        {
          desiredSize: new go.Size(25, 25)
        },
        new go.Binding('source', 'iconName',
          function(iconName: string): string {
            return iconName && iconName !== 'none' ? `assets/tag-icons/${iconName}.svg` : '';
          }
        )
      )
    );
  }

  getWorkpackageIconTemplate() {
    return $(go.Panel,
      'Auto',
      {
        name: 'Workpackage Icon Panel',
        toolTip: $('ToolTip', $(go.TextBlock, new go.Binding('text', '',
          function(data) {
            const action = data.updateType ===  'add' ? 'created' : 'updated';
            return `${action} in ${data.name}`;
          }
        ))),
        doubleClick: function(event: go.InputEvent): void {
          this.gojsCustomObjectsService.showRightPanelTabSource.next(NodeDetailTab.WorkPackages);
          event.handled = true;
        }.bind(this)
      },
      $(go.Shape, {fill: null, stroke: null }),
      $(go.Shape,
        'Circle',
        {
          name: 'Workpackage Icon Background',
          desiredSize: new go.Size(26, 26),
          stroke: null,
          fill: null
        },
        new go.Binding('fill', 'displayColour')
      ),
      $(go.Picture,
        {
          name: 'Workpackage Icon',
          desiredSize: new go.Size(23, 23),
          source: `assets/node-icons/work-package-white.svg`
        }
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
  //  Expands middle node section if not already expanded.
  //  Otherwise, collapses bottom section if expanded.
  //  Otherwise, collapses middle section.
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
        visible: !this.forPalette,
        click: function(event, button) {
          const node = button.part;

          event.diagram.model.setDataProperty(
            node.data,
            'middleExpanded',
            (node.data.bottomExpanded === bottomOptions.children) || !node.data.middleExpanded
          );
          event.diagram.model.setDataProperty(node.data, 'bottomExpanded', bottomOptions.none);

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
          return (data.bottomExpanded === bottomOptions.children) || data.middleExpanded ? '-' : '+';
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

  // Get menu button for system/data nodes.
  //  When clicked, provides a menu with actions to take, relating to the node.
  getTopMenuButton(): go.Panel {
    return $(
      'RoundButton',
      {
        name: 'TopMenuButton',
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        visible: (!this.forPalette),
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
  // Expands the bottom section of nodes when clicked.
  getBottomExpandButton(): go.Panel {
    return $(
      'RoundButton',
      {
        name: 'BottomExpandButton',
        column: 2,
        alignment: go.Spot.RightCenter,
        margin: new go.Margin(0, 0, 0, 2),
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        visible: !this.forPalette,
        click: function(event, button): void {
          const node = button.part;

          event.diagram.model.setDataProperty(node.data, 'bottomExpanded', bottomOptions.children);

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
      // Button not visible when bottom node section is collapsed
      new go.Binding('visible', 'bottomExpanded', function(bottomExpanded) {
        return bottomExpanded === bottomOptions.none;
      })
    );
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
        name: 'Radio Alert Panel',
        visible: false,
        doubleClick: function(event: go.InputEvent): void {
          this.gojsCustomObjectsService.showRightPanelTabSource.next(NodeDetailTab.Radio);
          event.handled = true;
        }.bind(this)
      },
      new go.Binding('visible', 'relatedRadioCounts', function(counts) {
        return counts[type] > 0;
      }),
      $(go.Shape, 'circle', {
        name: 'Radio Alert Shape',
        fill: radioColours[type],
        desiredSize: new go.Size(25, 25),
        margin: new go.Margin(0, 1, 0, 1)
      }),
      $(
        go.TextBlock,
        textFont('12px'),
        {
          name: 'Radio Alert Icon',
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
  getRadioAlertIndicators(forNode = true): go.Panel {
    return $(
      go.Panel,
      'Horizontal',
      {
        alignment: go.Spot.LeftCenter,
        alignmentFocus: go.Spot.LeftCenter,
        visible: false,
        row: 0,
        column: 0
      },
      forNode ? { height: 27 } : {},
      new go.Binding('visible', 'showRadioAlerts').ofModel(),
      (forNode && !this.forPalette) ? $(go.TextBlock,
        'No RADIOs',
        textFont('italic 16px'),
        {
          textAlign: 'left',
          stroke: 'grey',
          visible: false
        },
        new go.Binding('visible', 'relatedRadioCounts', function(radios): boolean {
          return Object.keys(radios).every(function(key) {return radios[key] === 0; });
        })
      ) : {},
      ...['risks', 'assumptions', 'dependencies', 'issues', 'opportunities'].map(
        function(type) {
          return this.getRadioAlertIndicator(type);
        }.bind(this)
      )
    );
  }

  // Get a panel containing a row of tag icons
  getTagIconsRow(fixedHeight = true): go.Panel {
    return $(go.Panel,
      'Horizontal',
      {
        column: 1,
        row: 0
      },
      fixedHeight ? { height: 30 } : {},
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
      // Ellipsis to indicate that there are additional tags
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
    );
  }

  getWorkpackageImpactIcons(maxIcons = 4, forNode = true): go.Panel {
    return $(go.Panel,
      'Horizontal',
      {
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        column: 1,
        row: 0
      },
      forNode ? { height: 26 } : {},
      // Panel to contain workpackage icons
      $(go.Panel,
        'Horizontal',
        {
          itemTemplate: this.getWorkpackageIconTemplate()
        },
        new go.Binding('itemArray', 'impactedByWorkPackages',
          function(workpackages: WorkPackageImpact[]): WorkPackageImpact[] {
            let workpackgeIcons = workpackages.concat();
            // Restrict workpackage icons in the row to a maximum (four by default)
            workpackgeIcons = workpackgeIcons.slice(0, maxIcons);

            return workpackgeIcons;
          }
        )
      ),
      (forNode && !this.forPalette) ? $(go.TextBlock,
        'Not Impacted',
        textFont('italic 16px'),
        {
          textAlign: 'right',
          stroke: 'grey',
          visible: false
        },
        new go.Binding('visible', 'impactedByWorkPackages',
          function(workpackages: WorkPackageImpact[]): boolean {
            return workpackages.length === 0;
          }
        )
      ) : {},
      // Ellipsis to indicate that there are additional workpackage
      //  icons associated with the node
      $(go.TextBlock,
        '...',
        textFont('bold 18px'),
        {
          margin: new go.Margin(0, 0, 0, 4)
        },
        // Should only be visible if there are more than the maximum number of
        //  workpackage icons against the  node
        new go.Binding('visible', 'impactedByWorkPackages',
          function(workpackages: WorkPackageImpact[]): boolean {
            return workpackages.length > maxIcons;
          }
        )
      )
    );
  }

  // Get name, RADIO alert, tag and workpackage impact icons label for links (and also transformation nodes)
  getLinkLabel(): go.Panel {
    return $(
      go.Panel,
      'Auto',
      {
        name: 'label'
      },
      $(go.Shape,
        {
          figure: 'RoundedRectangle',
          fill: 'white',
          opacity: 0.85,
          shadowVisible: false,
          visible: true
        },
        new go.Binding('fill', 'colour', function(colour: colourOptions): NodeColoursLight {
          return NodeColoursLight[colour];
        }),
        new go.Binding('stroke', 'colour', function(colour: colourOptions): NodeColoursDark {
          return NodeColoursDark[colour];
        })
      ),
      // Only show link label if link is visible, diagram is set to show name/RADIO alerts and any exist to show
      new go.Binding('visible', 'showLabel'),
      new go.Binding('opacity', 'strokeWidth',
        function(strokeWidth) {
          return strokeWidth !== 0 ? 1 : 0;
        }
      ).ofObject('shape'),
      $(
        go.Panel,
        'Vertical',
        $(go.Panel,
          'Vertical',
          $(
            go.TextBlock,
            textFont('bold 14px'),
            new go.Binding('text', 'name'),
            new go.Binding('visible', 'linkName').ofModel()
          ),
          new go.Binding('visible', 'category', function(category: string): boolean  {
            return category !== nodeCategories.transformation;
          })
        ),
        $(go.TextBlock,
          textFont('italic 14px'),
          {
            text: 'No RADIOs',
            stroke: 'grey',
            textAlign: 'center'
          },
          new go.Binding('visible', 'relatedRadioCounts',
            function(radioCounts): boolean {
              return Object.keys(radioCounts).every(
                function(key: string): boolean {
                  return radioCounts[key] === 0;
                }
              );
            }
          )
        ),
        this.getTagIconsRow(false),
        this.getRadioAlertIndicators(false),
        this.getWorkpackageImpactIcons(5, false)
      )
    );
  }


  getLinkLabelForPalette(): go.Panel {
    return $(
      go.Panel,
      'Auto',
      {
        segmentIndex: 1,
        segmentFraction: 0.5,
        segmentOffset: new go.Point(-85, 0)
      },
      $(
        go.TextBlock,
        {
          textAlign: 'center',
          maxSize: new go.Size(200, NaN)
        },
        textFont('bold 24px'),
        new go.Binding('text', 'label')
      )
    );
  }

  getLabelForTransformation(): go.TextBlock {
    return $(go.TextBlock,
      textFont('bold 24px'),
      {
        textAlign: 'center',
        shadowVisible: false,
        margin: 10,
        width: 250
      },
      new go.Binding('text', 'name')
    );
  }

  // Get top section of nodes, containing icons and name
  getTopSection(isGroup = false): go.Panel {
    return $(
      go.Panel,
      'Table',
      {
        name: 'top',
        row: 0,
        alignment: go.Spot.TopCenter,
        stretch: go.GraphObject.Horizontal,
        margin: new go.Margin(5)
      },
      $(go.RowColumnDefinition, { row: 0, height: 30 }),
      $(go.RowColumnDefinition, { column: 0, maximum: 25}),
      $(go.RowColumnDefinition, { column: 1 }),
      $(go.RowColumnDefinition, { column: 2 }),
      $(go.RowColumnDefinition, { column: 3, maximum: 50 }),
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
            desiredSize: new go.Size(25, 25)
          },
          new go.Binding('source', '', function(data): string {
            const imageFolderPath = '/assets/node-icons/';

            // Section of the image name determined by layer
            const layerImagePrefix = {
              [layers.system]: 'sys',
              [layers.data]: 'data',
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
              [nodeCategories.dataStructure]: 'data-structure',
              [nodeCategories.dataSet]: 'data-set',
              [nodeCategories.masterDataSet]: 'master-data-set',
              [nodeCategories.masterData]: 'master-data',
              [nodeCategories.dimension]: '',
              [nodeCategories.list]: 'list',
              [nodeCategories.structure]: 'structure',
              [nodeCategories.key]: 'keyrc'
            };

            const separator = data.layer !== layers.dimension ? '-' : '';

            const sharedStatusImageSuffix =
              [nodeCategories.dataSet, nodeCategories.masterDataSet].includes(data.category)
                ? (data.isShared ? '-shared' : '-master')
                : '';

            return [
              imageFolderPath,
              layerImagePrefix[data.layer],
              separator,
              categoryImageSuffix[data.category],
              sharedStatusImageSuffix,
              '.svg'
            ].join('');
          })
        )
      ),
      this.getTagIconsRow(),
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
        new go.Binding(
          'stroke',
          'colour',
          function(colour) {
            return NodeColoursDark[colour];
          }
        ),
        new go.Binding('opacity', 'name', function(name: boolean): number {
          return name ? 1 : 0;
        }).ofModel()
      ),
      $(go.Panel,
        'Horizontal',
        {
          row: 0,
          column: 3
        },
        // Icon to indicate that the group contains group members
        isGroup ? $(go.Picture,
          {
            desiredSize: new go.Size(25, 25),
            source: '/assets/node-icons/group.svg',
            visible: false,
            toolTip: $('ToolTip',
              $(go.TextBlock,
                new go.Binding('text', 'members', function(members: GroupInfo[]): string {
                  return `Contains ${members.length} group member${members.length > 1 ? 's' : ''}`;
                })
              )
            )
          },
          new go.Binding('visible', 'members', function(groupMembers: GroupInfo[]): boolean {
            return groupMembers.length > 0;
          })
        ) : {},
        isGroup ? this.getTopMenuButton() : this.getTopExpandButton()
      )
    );
  }

  // Get bottom section of nodes, containing descendants or group members
  getBottomSection(isGroup = false): go.Panel {
    return $(
      go.Panel,
      'Auto',
      {
        name: 'bottom',
        row: 2,
        stretch: go.GraphObject.Fill,
        alignment: go.Spot.TopCenter,
        alignmentFocus: go.Spot.TopCenter,
        margin: new go.Margin(5),
        background: null
      },
      // Area for grouped nodes to appear in
      $(go.Shape,
        {
          stretch: go.GraphObject.Fill,
          name: 'Group member area',
          figure: 'rectangle',
          stroke: null,
          fill: null
        }
      ),
      $(
        go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          stretch: go.GraphObject.Horizontal,
          margin: new go.Margin(0, 3, 0, 3)
        },
        // Descendants list
        $(go.Panel,
          'Vertical',
          {
            name: 'Descendants List',
            alignment: go.Spot.TopCenter,
            stretch: go.GraphObject.Horizontal
          },
          $(go.TextBlock, textFont('italic 18px'),
            {
              textAlign: 'center',
              stretch: go.GraphObject.Horizontal,
              margin: new go.Margin(0, 0, 2, 0)
            },
            new go.Binding('text', 'layer', function(layer) {
              const descendantsLayer = {
                [layers.system]: 'Data Nodes',
                [layers.data]: 'Dimensions',
                [layers.dimension]: 'Reporting Concepts'
              };
              return descendantsLayer[layer];
            })
          ),
          $(
            go.Panel,
            'Vertical',
            {
              // padding: 3,
              alignment: go.Spot.TopCenter,
              defaultAlignment: go.Spot.TopCenter,
              stretch: go.GraphObject.Horizontal,
              itemCategoryProperty: '',
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'descendants'),
            new go.Binding('visible', 'nextLevel').ofModel()
          ),
          new go.Binding('visible', 'bottomExpanded',
            function(bottomExpanded) {
              return bottomExpanded === bottomOptions.children;
            }
          )
        ),
        // Grouped members list
        $(go.Panel,
          'Vertical',
          {
            name: 'Group Members List',
            alignment: go.Spot.TopCenter,
            defaultAlignment: go.Spot.TopCenter,
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
              alignment: go.Spot.TopCenter,
              defaultAlignment: go.Spot.TopCenter,
              stretch: go.GraphObject.Horizontal,
              itemCategoryProperty: '',
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'members')
          ),
          new go.Binding('visible', 'bottomExpanded',
            function (bottomExpanded) {
              return bottomExpanded === bottomOptions.groupList;
            }
          )
        )
      )
    );
  }

  // Get middle section of nodes, containing tags, RADIO Alert indicators and workpackage impact icons
  getMiddleSection(isGroup = false): go.Panel {
    return $(
      go.Panel,
      'Vertical',
      {
        name: 'middle',
        row: 1,
        stretch: go.GraphObject.Horizontal,
        margin: new go.Margin(2),
        // minSize: new go.Size(300, 65)
      },
      new go.Binding('visible', 'middleExpanded').makeTwoWay(),
      $(go.Panel,
        'Horizontal',
        {alignment: go.Spot.LeftCenter },
        !this.forPalette ? $(go.TextBlock,
          'No Tags',
          textFont('italic 16px'),
          {
            textAlign: 'left',
            visible: false,
            stroke: 'grey'
          },
          new go.Binding('visible', 'tags',
            function(tags: Tag[]): boolean {
              return tags.length === 0;
            }
          )
        ) : {},
        $(
          go.Panel,
          'Horizontal',
          {
            // maxSize: new go.Size(296, NaN),
            height: 30,
            itemTemplate: this.getTagTemplate(),
            // alignment: go.Spot.LeftCenter,
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
        )
      ),
      $(go.Panel,
        'Table',
        {stretch: go.GraphObject.Horizontal },
        $(go.RowColumnDefinition, {row: 0, height: 30}),
        $(go.RowColumnDefinition,
          {
            column: 0,
            minimum: 135,
            stretch: go.GraphObject.Horizontal,
            sizing: go.RowColumnDefinition.ProportionalExtra
          }
        ),
        $(go.RowColumnDefinition,
          {
            sizing: go.RowColumnDefinition.ProportionalExtra,
            column: 1,
            separatorStrokeWidth: 2,
            minimum: 135
          }
        ),
        $(go.RowColumnDefinition,
          {
            column: 2,
            separatorStroke: 'transparent',
            sizing: go.RowColumnDefinition.None
          }
        ),
        this.getRadioAlertIndicators(),
        this.getWorkpackageImpactIcons(isGroup ? 4 : 3),
        isGroup ? {} : this.getBottomExpandButton()
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
    if (tagGroup.naturalBounds.right > 146 /* To be Updated */) {
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
      } while (tagGroup.naturalBounds.right > 146 /* To be Updated */);
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
          this.getDependencyExpandButton(true)
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
        forPalette ? this.getLabelForTransformation() : this.getLinkLabel()
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
        this.getTopSection(),
        this.getMiddleSection(),
        this.getBottomSection()
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
        layout: $(StandardGroupLayout as any,
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
        textFont('bold 20px'),
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
            this.getTopSection(true),
            this.getMiddleSection(true),
            this.getBottomSection(true)
          )
        )
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
      new go.Binding('selectable', 'dataLinks').ofModel(),
      // Have the diagram position the link if no route set
      new go.Binding('isLayoutPositioned', 'routeMissing', function(routeMissing) {
          return routeMissing || [Level.sources, Level.targets].includes(this.currentFilterLevel);
      }.bind(this)),
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
        new go.Binding(
          'stroke',
          'colour',
          function(colour) {
            return NodeColoursDark[colour];
          }
        ),
        // On hide, set width to 0 instead of disabling visibility, so that link routes still calculate
        new go.Binding('strokeWidth', 'dataLinks', function(dataLinks) {
          return dataLinks ? 2.5 : 0;
        }).ofModel(),
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? { areaBackground: 'transparent' } : {}
      ),
      forPalette ? this.getLinkLabelForPalette()
        : $(go.Panel, 'Auto',
            this.getLinkLabel(),
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

  // Get template for master data links
  getLinkMasterDataTemplate(forPalette: boolean = false): CustomLink {
    return $(
      CustomLink,
      new go.Binding('points', 'route').makeTwoWay(function(points, data) {
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
      new go.Binding('selectable', 'masterDataLinks').ofModel(),
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
          strokeWidth: 2.5,
          strokeDashArray: [5, 5]
        },
        new go.Binding(
          'stroke',
          'colour',
          function(colour) {
            return NodeColoursDark[colour];
          }
        ),
        // On hide, set width to 0 instead of disabling visibility, so that link routes still calculate
        new go.Binding('strokeWidth', 'masterDataLinks', function(dataLinks) {
          return dataLinks ? 2.5 : 0;
        }).ofModel(),
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? { areaBackground: 'transparent' } : {}
      ),
      forPalette ? this.getLinkLabelForPalette()
        : $(go.Panel, 'Auto',
            this.getLinkLabel(),
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
            textFont('bold 30px'),
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
            textFont('15px'),
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
        textFont('bold 25px'),
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
                click: function(event: go.InputEvent, button: go.Panel): void {
                  this.addChildSource.next(button.part.data);
                }.bind(this)
              },
              // Disable button if moves not allowed in diagram
              new go.Binding('isEnabled', '', function(data) {

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
        new go.Binding('isEnabled', '', function(data) {
          return this.diagramChangesService.diagramEditable;
        }.bind(this)),
        // Invisible when no data structure
        new go.Binding('visible', 'dataStructure', function(dataStructure) {
          return !!dataStructure;
        }),
        $(go.TextBlock, textFont('bold 26px'), '+',
          {
            alignment: go.Spot.Center,
            desiredSize: new go.Size(310, 40),
            textAlign: 'center',
            verticalAlignment: go.Spot.Center,
          },
          new go.Binding('stroke', 'isEnabled', function(enabled) {
            return enabled ? 'black' : '#AAAFB4';
          }).ofObject('addDataStructureChildButton')
        ),
      )
    );
  }
}
