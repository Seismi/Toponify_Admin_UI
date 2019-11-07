import { Injectable, OnDestroy } from '@angular/core';
import * as go from 'gojs';
import { layers, Node, nodeCategories } from '@app/architecture/store/models/node.model';
import { linkCategories, RoutesEntityEntity } from '@app/architecture/store/models/node-link.model';
import * as uuid from 'uuid/v4';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { State as ArchitectureState } from '@app/architecture/store/reducers/architecture.reducer';
import { FilterService } from './filter.service';
import { Location } from '@angular/common';
import { SetViewLevel } from '@app/architecture/store/actions/view.actions';
import { NodeToolTips } from '@app/core/node-tooltips';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';

const $ = go.GraphObject.make;

// Levels in the diagram
export enum Level {
  system = 'system',
  dataSet = 'data set',
  dimension = 'dimension',
  reportingConcept = 'reporting concept',
  systemMap = 'system map',
  dataSetMap = 'data set map',
  attribute = 'attribute',
  usage = 'usage'
}

// Numbers associated to each level in the data store
export const viewLevelNum = {
  [Level.system]: 1,
  [Level.dataSet]: 2,
  [Level.dimension]: 3,
  [Level.reportingConcept]: 4,
  [Level.attribute]: 5,
  [Level.systemMap]: 8,
  [Level.dataSetMap]: 9,
  [Level.usage]: 10
};

export const lessDetailOrderMapping = {
  [Level.reportingConcept]: Level.dimension,
  [Level.dimension]: Level.dataSet,
  [Level.systemMap]: Level.system,
  [Level.dataSetMap]: Level.dataSet,
  [Level.dataSet]: Level.system
};

export const moreDetailOrderMapping = {
  [Level.system]: Level.dataSet,
  [Level.dataSet]: Level.dimension,
  [Level.dimension]: Level.reportingConcept
};

@Injectable()
export class DiagramLevelService implements OnDestroy {
  historyOfFilters: any = {};

  groupLayoutInitial = true;

  // Filter to apply to nodes for the diagram
  //    filterLevel: level to apply the filter to
  //    filterNodeIds: array of node Ids specified for inclusion
  filter: BehaviorSubject<{
    filterLevel: Level;
    filterNodeIds?: string[];
  }> = new BehaviorSubject({ filterLevel: Level.system });

  filterSubscription: Subscription;
  filterServiceSubscription: Subscription;

  // Observable to track nodes needed for the palette
  private paletteNodesSource = new BehaviorSubject([]);
  paletteNodes = this.paletteNodesSource.asObservable();

  private paletteLinksSource = new BehaviorSubject([]);
  paletteLinks = this.paletteLinksSource.asObservable();

  constructor(
    private store: Store<ArchitectureState>,
    public filterService: FilterService,
    public location: Location
  ) {}

  public initializeUrlFiltering(): void {
    this.filterSubscription = this.filter.subscribe(filter => {
      this.store.dispatch(new SetViewLevel(viewLevelNum[filter.filterLevel]));
      if (!filter.filterNodeIds && filter.filterLevel === Level.system) {
        this.historyOfFilters = {};
      }
      this.historyOfFilters[filter.filterLevel] = {
        ...(filter.filterNodeIds && { filterNodeIds: filter.filterNodeIds })
      };
    });

    const filterFromQuery = this.filterService.getFilter();
    if (filterFromQuery && filterFromQuery.filterLevel) {
      this.filter.next({ filterLevel: filterFromQuery.filterLevel });
    } else {
      this.store.dispatch(new UpdateQueryParams({ filterLevel: Level.system }));
      // this.filterService.addFilter({ filterLevel: Level.system });
    }

    this.filterServiceSubscription = this.filterService.filter.subscribe(filter => {
      if (filter && JSON.stringify(filter) !== JSON.stringify(this.filter.getValue())) {
        if (filter.filterLevel) {
          return this.filter.next({ filterLevel: filter.filterLevel });
        }
      }

      this.filter.next({ filterLevel: Level.system });
    });
  }

  // Display the next level of detail in the diagram, filtered to include only children of a specific node
  //    object: node to display the children of
  changeLevelWithFilter(_event: any, object: go.Node): void {
    let newLevel: Level;
    if (object.data.layer === layers.system) {
      newLevel = Level.dataSet;
    } else if (object.data.layer === layers.dataSet) {
      newLevel = Level.dimension;
    } else if (object.data.layer === layers.dimension) {
      newLevel = Level.reportingConcept;
    } else {
      return;
    }
    this.store.dispatch(
      new UpdateQueryParams({ filterLevel: newLevel, id: object.data.id, parentName: object.data.name })
    );
    // this.filterService.addFilter({ filterLevel: newLevel, id: object.data.id, parentName: object.data.name });
  }

  displayMapView(event: any, object: go.Link): void {
    // Indicate that the initial group layout is being performed and has not yet been completed
    this.groupLayoutInitial = true;

    this.store.dispatch(
      new UpdateQueryParams({
        filterLevel: object.data.layer + ' map',
        id: object.data.id
      })
    );
    // this.filterService.addFilter({
    //   filterLevel: object.data.layer + ' map',
    //   id: object.data.id
    // });

    const fromNode = JSON.parse(JSON.stringify(object.fromNode.data));
    const toNode = JSON.parse(JSON.stringify(object.toNode.data));

    // Ensure that diagram content is initially centered while layouts are performed
    event.diagram.contentAlignment = go.Spot.Center;
  }

  // Perform layout for groups that nodes belong to
  relayoutGroups(event) {
    event.subject.each(function(node: go.Node) {
      if (node.containingGroup) {
        node.invalidateLayout();
      }
    });
  }

  displayUsageView(event, object) {
    this.store.dispatch(
      new UpdateQueryParams({
        filterLevel: Level.usage,
        id: object.data.id
      })
    );
    // this.filterService.addFilter({
    //   filterLevel: Level.usage,
    //   id: object.data.id
    // });
  }

  ngOnDestroy() {
    this.destroyUrlFiltering();
  }

  public destroyUrlFiltering() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.filterServiceSubscription) {
      this.filterServiceSubscription.unsubscribe();
    }
  }

  getToolTipForMasterDataLinks(level) {
    let tooltip: string;
    if (level === Level.system) {
      tooltip = NodeToolTips[5].Tooltip;
    } else if (level === Level.dataSet || level === Level.systemMap) {
      tooltip = NodeToolTips[10].Tooltip;
    } else if (level === Level.dimension || level === Level.dataSetMap) {
      tooltip = NodeToolTips[13].Tooltip;
    } else if (level === Level.reportingConcept) {
      tooltip = NodeToolTips[17].Tooltip;
    }
    return tooltip;
  }

  getToolTipForDataLinks(level) {
    let tooltip: string;
    if (level === Level.system) {
      tooltip = NodeToolTips[6].Tooltip;
    } else if (level === Level.dataSet || level === Level.systemMap) {
      tooltip = NodeToolTips[11].Tooltip;
    }
    return tooltip;
  }

  // Change the currently displayed diagram level
  //  params:
  //    diagram: the diagram object
  //    level: the level to change to
  changeLevel(diagram: go.Diagram, level: Level): void {
    // Clear clipboard to prevent parts being copied to the wrong view
    diagram.commandHandler.copyToClipboard(null);

    // Array of nodes to be used in the palette
    let paletteViewNodes: object[] = [];

    const paletteViewLinks = [];

    const linkLayer =
      level === Level.systemMap ? layers.dataSet : level === Level.dataSetMap ? layers.dimension : level.toLowerCase();

    if (level !== Level.usage) {
      paletteViewLinks.push({
        category: linkCategories.masterData,
        id: 'New master data link',
        name: 'New master data link',
        description: '',
        route: <RoutesEntityEntity['points']>[0, 0, 40, 0, 40, -80, 80, -80],
        layer: linkLayer,
        isTemporary: true,
        impactedByWorkPackages: [],
        tooltip: this.getToolTipForMasterDataLinks(level)
      });
    }

    if (level === Level.system) {
      paletteViewNodes = [
        new Node({
          id: 'New Transactional System',
          name: 'New Transactional System',
          layer: layers.system,
          category: nodeCategories.transactional,
          tooltip: NodeToolTips[0].Tooltip
        }),
        new Node({
          id: 'New Analytical System',
          name: 'New Analytical System',
          layer: layers.system,
          category: nodeCategories.analytical,
          tooltip: NodeToolTips[1].Tooltip
        }),
        new Node({
          id: 'New File System',
          name: 'New File System',
          layer: layers.system,
          category: nodeCategories.file,
          tooltip: NodeToolTips[2].Tooltip
        }),
        new Node({
          id: 'New Reporting System',
          name: 'New Reporting System',
          layer: layers.system,
          category: nodeCategories.reporting,
          tooltip: NodeToolTips[3].Tooltip
        }),
        new Node({
          id: 'New Master Data System',
          name: 'New Master Data System',
          layer: layers.system,
          category: nodeCategories.masterData,
          tooltip: NodeToolTips[4].Tooltip
        })
      ];
    } else if (level === Level.dataSet) {
      paletteViewNodes = [
        new Node({
          id: 'New Physical Data Set',
          name: 'New Physical Data Set',
          layer: layers.dataSet,
          category: nodeCategories.physical,
          tooltip: NodeToolTips[7].Tooltip
        }),
        new Node({
          id: 'New Virtual Data Set',
          name: 'New Virtual Data Set',
          layer: layers.dataSet,
          category: nodeCategories.virtual,
          tooltip: NodeToolTips[8].Tooltip
        }),
        new Node({
          id: 'New Master Data Data Set',
          name: 'New Master Data Data Set',
          layer: layers.dataSet,
          category: nodeCategories.masterData,
          tooltip: NodeToolTips[9].Tooltip
        })
      ];
    } else if (level === Level.dimension) {
      paletteViewNodes = [
        new Node({
          id: 'New Dimension',
          name: 'New Dimension',
          layer: layers.dimension,
          category: nodeCategories.dimension,
          tooltip: NodeToolTips[12].Tooltip
        })
      ];
    } else if (level === Level.reportingConcept) {
      paletteViewNodes = [
        new Node({
          id: 'New List Reporting Concept',
          name: 'New List Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.list,
          tooltip: NodeToolTips[14].Tooltip
        }),
        new Node({
          id: 'New Structural Reporting Concept',
          name: 'New Structural Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.structure,
          tooltip: NodeToolTips[15].Tooltip
        }),
        new Node({
          id: 'New Key Reporting Concept',
          name: 'New Key Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.key,
          tooltip: NodeToolTips[16].Tooltip
        })
      ];
    }

    if ([Level.system, Level.dataSet, Level.systemMap].includes(level)) {
      paletteViewLinks.push({
        category: linkCategories.data,
        id: 'New data link',
        name: 'New data link',
        description: '',
        route: <RoutesEntityEntity['points']>[0, 0, 40, 0, 40, -80, 80, -80],
        layer: linkLayer,
        isTemporary: true,
        impactedByWorkPackages: [],
        tooltip: this.getToolTipForDataLinks(level)
      });
    }

    diagram.model = $(go.GraphLinksModel, {
      nodeKeyProperty: level.endsWith('map') ? 'displayId' : 'id',
      linkKeyProperty: level.endsWith('map') ? 'displayId' : 'id',
      nodeCategoryProperty: 'layer',
      linkFromKeyProperty: level.endsWith('map') ? 'sourceDisplayId' : level === Level.usage ? 'parentId' : 'sourceId',
      linkToKeyProperty: level.endsWith('map') ? 'targetDisplayId' : level === Level.usage ? 'childId' : 'targetId',
      modelData: diagram.model.modelData,
      // Ensure new key is generated when copying from the palette
      copiesKey: false,
      makeUniqueKeyFunction: function() {
        return uuid();
      },
      makeUniqueLinkKeyFunction: function() {
        return uuid();
      }
    });

    // Settings and layout for map view
    if (level.endsWith('map')) {
      diagram.layout = $(go.GridLayout, {
        spacing: new go.Size(100, 100),
        alignment: go.GridLayout.Position,
        wrappingWidth: Infinity,
        isInitial: true,
        isOngoing: true
      });

      // Settings and layout for non-map views
    } else {
      diagram.layout = $(go.LayeredDigraphLayout, {
        setsPortSpots: level === Level.usage,
        isOngoing: level === Level.usage, // Prevent rearranging diagram automatically unless in usage view
        isInitial: true,
        aggressiveOption: go.LayeredDigraphLayout.AggressiveMore,
        isRouting: true,
        // Arrange nodes from top down in node usage view
        direction: level === Level.usage ? 90 : 0
      });
    }

    this.paletteNodesSource.next(paletteViewNodes);
    this.paletteLinksSource.next(paletteViewLinks);
  }
}
