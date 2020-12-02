import {Injectable} from '@angular/core';
import * as go from 'gojs';
import {DiagramUtilitiesService} from '@app/architecture/services/diagram-utilities-service';
import {colourOptions, NodeColoursDark, NodeColoursLight, NodeDetailTab} from '@app/architecture/store/models/layout.model';
import {
  bottomOptions,
  GroupInfo,
  layers,
  nodeCategories,
  Tag,
  TagColour,
  WorkPackageImpact
} from '@app/architecture/store/models/node.model';
import {DiagramViewChangesService} from '@app/architecture/services/diagram-view-changes.service';
import {DiagramLayoutChangesService} from '@app/architecture/services/diagram-layout-changes.service';

let thisService: DiagramPanelTemplatesService;
const $ = go.GraphObject.make;

/*
This service provides reusable templates for panels to be used
 in the definition of nodes and links in the diagram.
*/

@Injectable()
export class DiagramPanelTemplatesService {

  constructor(
    private diagramUtilitiesService: DiagramUtilitiesService,
    private diagramViewChangesService: DiagramViewChangesService,
    private diagramLayoutChangesService: DiagramLayoutChangesService
  ) {
    thisService = this;
  }

  defineRoundButton() {
    return go.GraphObject.defineBuilder('RoundButton', function(): go.Panel {
      const button = $('Button');
      (button.findObject('ButtonBorder') as go.Shape).figure = 'Circle';
      return button;
    });
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
          thisService.diagramUtilitiesService.textFont('18px'),
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
              return !!iconName && iconName !== 'none';
            }
          )
        ),
        $(
          go.TextBlock,
          thisService.diagramUtilitiesService.textFont('bold italic 20px'),
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
          thisService.diagramViewChangesService.showRightPanelTabSource.next(NodeDetailTab.WorkPackages);
          event.handled = true;
        }
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
          const node = button.part as go.Node;
          thisService.diagramViewChangesService.showDependencies(node);
        }
      },
      $(go.TextBlock, thisService.diagramUtilitiesService.textFont('bold 18px'), '+', {
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
  getTopExpandButton(forPalette = false): go.Panel {
    return $(
      'RoundButton',
      {
        column: 3,
        row: 0,
        name: 'TopExpandButton',
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        visible: !forPalette,
        click: function(event, button) {
          const node = button.part;

          event.diagram.model.setDataProperty(
            node.data,
            'middleExpanded',
            (node.data.bottomExpanded === bottomOptions.children) || !node.data.middleExpanded
          );
          event.diagram.model.setDataProperty(node.data, 'bottomExpanded', bottomOptions.none);

          thisService.diagramLayoutChangesService.nodeExpandChanged(node);
        }
      },
      $(
        go.TextBlock,
        thisService.diagramUtilitiesService.textFont('bold 18px'),
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
  getTopMenuButton(forPalette = false, menuFunction: () => go.Adornment): go.Panel {
    return $(
      'RoundButton',
      {
        name: 'TopMenuButton',
        alignment: go.Spot.RightCenter,
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        visible: (!forPalette),
        click: function(event, button) {
          event.diagram.select(button.part);

          const menu = menuFunction();
          menu.adornedObject = button.part;

          button.part.adornments.first().zOrder = 0;
          button.part.updateAdornments();

          button.part.addAdornment('ButtonMenu', menu);

          // Ensure that menu does not appear outside of diagram bounds
          thisService.diagramViewChangesService.updateViewAreaForMenu(menu);

        }
      },
      $(
        go.TextBlock,
        thisService.diagramUtilitiesService.textFont('bold 18px'),
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
  getBottomExpandButton(forPalette = false): go.Panel {
    return $(
      'RoundButton',
      {
        name: 'BottomExpandButton',
        column: 2,
        alignment: go.Spot.RightCenter,
        margin: new go.Margin(0, 0, 0, 2),
        alignmentFocus: go.Spot.RightCenter,
        desiredSize: new go.Size(25, 25),
        visible: !forPalette,
        click: function(event, button): void {
          const node = button.part;

          event.diagram.model.setDataProperty(node.data, 'bottomExpanded', bottomOptions.children);

          thisService.diagramLayoutChangesService.nodeExpandChanged(node);
        }
      },
      $(
        go.TextBlock,
        thisService.diagramUtilitiesService.textFont('bold 18px'),
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
          thisService.diagramViewChangesService.showRightPanelTabSource.next(NodeDetailTab.Radio);
          event.handled = true;
        }
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
        thisService.diagramUtilitiesService.textFont('12px'),
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
  getRadioAlertIndicators(forNode = true, forPalette = false): go.Panel {
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
      (forNode && !forPalette) ? $(go.TextBlock,
        'No RADIOs',
        thisService.diagramUtilitiesService.textFont('italic 16px'),
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
          return thisService.getRadioAlertIndicator(type);
        }
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
          itemTemplate: thisService.getTitleTagIconTemplate()
        },
        new go.Binding('itemArray', 'tags',
          function(tags: Tag[]): Tag[] {
            let iconTags = tags.concat();

            // Filter out any tags without an icon
            iconTags = iconTags.filter(
              function(tag: Tag): boolean {
                return !!tag.iconName && tag.iconName !== 'none';
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
        thisService.diagramUtilitiesService.textFont('bold 18px'),
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

  getWorkpackageImpactIcons(maxIcons = 4, forNode = true, forPalette = false): go.Panel {
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
          itemTemplate: thisService.getWorkpackageIconTemplate()
        },
        new go.Binding('itemArray', 'impactedByWorkPackages',
          function(workpackages: WorkPackageImpact[]): WorkPackageImpact[] {
            let workpackageIcons = workpackages.concat();
            // Restrict workpackage icons in the row to a maximum (four by default)
            workpackageIcons = workpackageIcons.slice(0, maxIcons);

            return workpackageIcons;
          }
        )
      ),
      (forNode && !forPalette) ? $(go.TextBlock,
        'Not Impacted',
        thisService.diagramUtilitiesService.textFont('italic 16px'),
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
        thisService.diagramUtilitiesService.textFont('bold 18px'),
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
            thisService.diagramUtilitiesService.textFont('bold 14px'),
            new go.Binding('text', 'name'),
            new go.Binding('visible', 'linkName').ofModel()
          ),
          new go.Binding('visible', 'category', function(category: string): boolean  {
            return category !== nodeCategories.transformation;
          })
        ),
        $(go.TextBlock,
          thisService.diagramUtilitiesService.textFont('italic 14px'),
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
        thisService.getTagIconsRow(false),
        thisService.getRadioAlertIndicators(false),
        thisService.getWorkpackageImpactIcons(5, false)
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
        thisService.diagramUtilitiesService.textFont('bold 24px'),
        new go.Binding('text', 'label')
      )
    );
  }

  getLabelForTransformation(): go.TextBlock {
    return $(go.TextBlock,
      thisService.diagramUtilitiesService.textFont('bold 24px'),
      {
        textAlign: 'center',
        shadowVisible: false,
        margin: 10,
        width: 250
      },
      new go.Binding('text', 'name')
    );
  }

  // Gets an array of tags, truncated to fit in the node if necessary
  getTruncatedTags(tags: Tag[]): Tag[] {
    let tagGroup;

    const tagArray = tags.concat();

    // Temporary part to measure size from
    tagGroup = createTempPanel.call(this, tagArray);

    // If size of tag section too big then...
    if (tagGroup.naturalBounds.right >  300) {
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
      } while (tagGroup.naturalBounds.right > 300);
    }

    return tagArray;

    // Create a temporary part with the given tags
    function createTempPanel(array: Tag[]): go.Panel {
      const panel = $(go.Part, 'Horizontal', {
        itemTemplate: thisService.getTagTemplate(),
        itemArray: array
      });
      panel.ensureBounds();
      return panel;
    }
  }

  // Get top section of nodes, containing icons and name
  getTopSection(forPalette = false, isGroup = false, menuFunction?: () => go.Adornment): go.Panel {
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
      $(go.RowColumnDefinition, { column: 3, maximum: 75 }),
      $(go.RowColumnDefinition, { column: 4 }),
      thisService.getDependencyExpandButton(),
      $(go.Panel,
        'Horizontal',
        {
          column: 0,
          row: 0,
          alignment: go.Spot.Left
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
              [nodeCategories.desktopApplication]: 'desktop-application',
              [nodeCategories.manualProcessing]: 'manual-processing',
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
                && data.layer === layers.data
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
      thisService.getTagIconsRow(),
      $(
        go.TextBlock,
        thisService.diagramUtilitiesService.textFont('bold italic 20px'),
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
        $(go.Panel,
          'Auto',
          {
            margin: 1,
            visible: false,
            toolTip: $('ToolTip',
              $(go.TextBlock, 'There are nodes hidden behind this node', {})
            )
          },
          // Warning visible if node hides other nodes
          new go.Binding('visible', '', function(node: go.Node): boolean {
            const diagram = node.diagram;
            const nodeBounds = node.getDocumentBounds();
            // Get list of nodes that lie within the node's bounds
            const surroundedNodes = new go.List<go.Part>();
            diagram.findPartsIn(nodeBounds, false, true, surroundedNodes);

            const selfIndex = surroundedNodes.indexOf(node);
            // Remove nodes that appear in front of the node from the list (and the node itself)
            surroundedNodes.removeRange(0, selfIndex);

            // Ignore links and group members
            return surroundedNodes.any(function(part) {
              return part instanceof go.Node && !part.isMemberOf(node);
            });
          }).ofObject(),
          $(go.Shape,
            {
              figure: 'triangle',
              fill: 'red',
              width: 20,
              height: 20
            }
          ),
          $(go.TextBlock,
            thisService.diagramUtilitiesService.textFont('bold 17px'),
            {
              textAlign: 'center',
              text: '!',
              margin: new go.Margin(0, 0, 5, 0)
            }
          )
        ),
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
        isGroup ? thisService.getTopMenuButton(forPalette, menuFunction) : thisService.getTopExpandButton()
      )
    );
  }



  // Get middle section of nodes, containing tags, RADIO Alert indicators and workpackage impact icons
  getMiddleSection(isGroup = false, forPalette = false): go.Panel {
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
        !forPalette ? $(go.TextBlock,
          'No Tags',
          thisService.diagramUtilitiesService.textFont('italic 16px'),
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
            itemTemplate: thisService.getTagTemplate(),
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
              return thisService.getTruncatedTags(tags);
            }
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
        thisService.getRadioAlertIndicators(),
        thisService.getWorkpackageImpactIcons(isGroup ? 4 : 3),
        isGroup ? {} : thisService.getBottomExpandButton()
      )
    );
  }

  // Get bottom section of nodes, containing descendants or group members
  getBottomSection(): go.Panel {
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
          $(go.TextBlock, thisService.diagramUtilitiesService.textFont('italic 18px'),
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
              itemTemplate: thisService.getItemTemplate()
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
          $(go.TextBlock, thisService.diagramUtilitiesService.textFont('italic 18px'),
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
              itemTemplate: thisService.getItemTemplate()
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
}
