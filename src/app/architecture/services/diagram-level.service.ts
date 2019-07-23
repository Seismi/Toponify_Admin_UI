import {Injectable, OnDestroy} from '@angular/core';
import * as go from 'gojs';
import { layers, Node, nodeCategories } from '@app/architecture/store/models/node.model';
import { linkCategories, RoutesEntityEntity } from '@app/architecture/store/models/node-link.model';
import * as uuid from 'uuid/v4';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {State as ArchitectureState} from '@app/architecture/store/reducers/architecture.reducer';
import {FilterService} from './filter.service';
import {Location} from '@angular/common';
import {SetViewLevel} from '@app/architecture/store/actions/view.actions';

const $ = go.GraphObject.make;

// Levels in the diagram
export enum Level {
  system = 'System',
  dataSet = 'Data Set',
  dimension = 'Dimension',
  reportingConcept = 'Reporting Concept',
  map = 'Map',
  attribute = 'Attribute'
}

// Numbers associated to each level in the data store
export const viewLevelNum = {
  [Level.system]: 1,
  [Level.dataSet]: 2,
  [Level.dimension]: 3,
  [Level.reportingConcept]: 4,
  [Level.attribute]: 5,
  [Level.map]: 9
};

export const lessDetailOrderMapping = {
  [Level.reportingConcept]: Level.dimension,
  [Level.dimension]: Level.dataSet,
  [Level.map]: Level.dataSet,
  [Level.dataSet]: Level.system
};

export const moreDetailOrderMapping = {
  [Level.system]: Level.dataSet,
  [Level.dataSet]: Level.dimension,
  [Level.dimension]: Level.reportingConcept,
};

@Injectable()
export class DiagramLevelService implements OnDestroy {

  historyOfFilters: any = {};

  groupLayoutInitial = true;

  // Filter to apply to nodes for the diagram
  //    filterLevel: level to apply the filter to
  //    filterNodeIds: array of node Ids specified for inclusion
  filter: BehaviorSubject<{filterLevel: Level, filterNodeIds?: string[]}> = new BehaviorSubject({filterLevel: Level.system});

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
  ) {
  }

  public initializeUrlFiltering() {

    this.filterSubscription = this.filter.subscribe(filter => {
      this.store.dispatch(new SetViewLevel(viewLevelNum[filter.filterLevel]));
      if (!filter.filterNodeIds && filter.filterLevel === Level.system) {
        this.historyOfFilters = {};
      }
      this.historyOfFilters[filter.filterLevel] = {
        ...(filter.filterNodeIds && {filterNodeIds: filter.filterNodeIds})
      };
    });

    const filterFromQuery = this.filterService.getFilter();
    if (filterFromQuery) {
      this.filter.next(filterFromQuery);
    } else {
      this.filterService.setFilter({filterLevel: Level.system});
    }

    this.filterServiceSubscription = this.filterService.filter.subscribe(filter => {
      if (filter && JSON.stringify(filter) !== JSON.stringify(this.filter.getValue())) {
        this.filter.next(filter);
      }

      if (!filter) {
        this.filter.next({filterLevel: Level.system});
      }
    });
  }

  // Display the next level of detail in the diagram, filtered to include only children of a specific node
  //    object: node to display the children of
  changeLevelWithFilter(event: any, object: go.Node): void {
    let newLevel: Level;

    if ([nodeCategories.transactional,
      nodeCategories.analytical,
      nodeCategories.file,
      nodeCategories.reporting,
      nodeCategories.masterData].includes(object.data.category)) {
      newLevel = Level.dataSet;
    } else if ([nodeCategories.physical, nodeCategories.virtual, nodeCategories.masterData].includes(object.data.category)) {
      newLevel = Level.dimension;
    } else if (object.data.category === nodeCategories.dimension) {
      newLevel = Level.reportingConcept;
    } else {
      return;
    }
    const childIds = object.data.descendants.map(function (child) {
      return child.id;
    });

    this.filterService.setFilter({filterLevel: newLevel, filterNodeIds:  childIds});
  }

  displayMapView(event: any, object: go.Link): void {

    // Do not display map view for data links without detail available
    if (!(object.data.category === linkCategories.data)) {
      return;
    }

    // Indicate that the initial group layout is being performed and has not yet been completed
    this.groupLayoutInitial = true;

    this.filterService.setFilter({filterLevel: Level.map, id: object.data.id});

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

    if (level !== Level.map) {
      paletteViewLinks.push(
        {
          category: linkCategories.masterData,
          id: 'New master data link',
          name: 'New master data link',
          description: '',
          route: <RoutesEntityEntity['points']> [0, 0, 40, 0, 40, -80, 80, -80],
          layer: level.toLowerCase(),
          isTemporary: true
        }
      );
    }

    if (level === Level.system) {
      paletteViewNodes = [
        new Node({
          id: 'New Transactional System',
          name: 'New Transactional System',
          layer: layers.system,
          category: nodeCategories.transactional
        }),
        new Node({
          id: 'New Analytical System',
          name: 'New Analytical System',
          layer: layers.system,
          category: nodeCategories.analytical
        }),
        new Node({
          id: 'New File System',
          name: 'New File System',
          layer: layers.system,
          category: nodeCategories.file
        }),
        new Node({
          id: 'New Reporting System',
          name: 'New Reporting System',
          layer: layers.system,
          category: nodeCategories.reporting
        }),
        new Node({
          id: 'New Master Data System',
          name: 'New Master Data System',
          layer: layers.system,
          category: nodeCategories.masterData
        })
      ];

    } else if (level === Level.dataSet) {
      paletteViewNodes = [
        new Node({ id: 'New Physical Data Set',
          name: 'New Physical Data Set',
          layer: layers.dataSet,
          category: nodeCategories.physical
        }),
        new Node({ id: 'New Virtual Data Set',
          name: 'New Virtual Data Set',
          layer: layers.dataSet,
          category: nodeCategories.virtual
        }),
        new Node({ id: 'New Master Data Data Set',
          name: 'New Master Data Data Set',
          layer: layers.dataSet,
          category: nodeCategories.masterData
        })
      ];
    } else if (level === Level.dimension || level === Level.map) {

      if (level !== Level.map) {
        paletteViewNodes = [
          new Node({ id: 'New Dimension',
            name: 'New Dimension',
            layer: layers.dimension,
            category: nodeCategories.dimension
          })
        ];
      }
    } else if (level === Level.reportingConcept) {
      paletteViewNodes = [
        new Node({ id: 'New List Reporting Concept',
          name: 'New List Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.list
        }),
        new Node({ id: 'New Structural Reporting Concept',
          name: 'New Structural Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.structure
        }),
        new Node({ id: 'New Key Reporting Concept',
          name: 'New Key Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.key
        })
      ];
    }

    if (level === Level.system || level === Level.dataSet ) {
      paletteViewLinks.push({
        category: linkCategories.data,
        id: 'New data link',
        name: 'New data link',
        description: '',
        route: <RoutesEntityEntity['points']> [0, 0, 40, 0, 40, -80, 80, -80],
        layer: level.toLowerCase(),
        isTemporary: true
      });
    }

    diagram.model = $(go.GraphLinksModel, {
      nodeKeyProperty: (level === Level.map) ? 'displayId' : 'id',
      linkKeyProperty: (level === Level.map) ? 'displayId' : 'id',
      nodeCategoryProperty: 'layer',
      linkFromKeyProperty: (level === Level.map) ? 'sourceDisplayId' : 'sourceId',
      linkToKeyProperty: (level === Level.map) ? 'targetDisplayId' : 'targetId',
      modelData: diagram.model.modelData,
      // Ensure new key is generated when copying from the palette
      copiesKey: false,
      makeUniqueKeyFunction: function() {return uuid(); },
      makeUniqueLinkKeyFunction: function() {return uuid(); }
    });


    // Settings and layout for map view
    if (level === Level.map) {
      diagram.layout =  $(go.GridLayout, {
        spacing: new go.Size(100, 100),
        alignment: go.GridLayout.Position,
        wrappingWidth: Infinity,
        isInitial: true,
        isOngoing: true
      });

      // Settings and layout for non-map views
    } else {

      diagram.layout = $(go.LayeredDigraphLayout, {
        setsPortSpots: false,
        isOngoing: false, // Prevent rearranging diagram automatically
        isInitial: true,
        aggressiveOption: go.LayeredDigraphLayout.AggressiveMore,
        isRouting: true
      });
    }

    this.paletteNodesSource.next(paletteViewNodes);
    this.paletteLinksSource.next(paletteViewLinks);
  }
}
