import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';
import { GojsCustomObjectsService } from '@app/architecture/services/gojs-custom-objects.service';
import {
  LoadMapView,
  LoadNode,
  LoadNodeLink,
  LoadNodeLinks,
  LoadNodes,
  LoadNodeUsageView,
  UpdateCustomProperty,
  UpdateLinks,
  UpdateNodes,
  DeleteCustomProperty
} from '@app/architecture/store/actions/node.actions';
import { NodeLinkDetail } from '@app/architecture/store/models/node-link.model';
import { NodeDetail, CustomPropertyValuesEntity } from '@app/architecture/store/models/node.model';
import {
  getNodeEntities,
  getNodeEntitiesBy,
  getNodeEntityById,
  getNodeLinks,
  getSelectedNode,
  getSelectedNodeLink
} from '@app/architecture/store/selectors/node.selector';
import { AttributeModalComponent } from '@app/attributes/containers/attribute-modal/attribute-modal.component';
import { LoadLayout, LoadLayouts } from '@app/layout/store/actions/layout.actions';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import { getLayoutSelected } from '@app/layout/store/selectors/layout.selector';
import { RadioModalComponent } from '@app/radio/containers/radio-modal/radio-modal.component';
import { AddRadioEntity, LoadRadios } from '@app/radio/store/actions/radio.actions';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getRadioEntities } from '@app/radio/store/selectors/radio.selector';
import { AddScope, LoadScope, LoadScopes } from '@app/scope/store/actions/scope.actions';
import { ScopeDetails, ScopeEntity } from '@app/scope/store/models/scope.model';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { getScopeEntities, getScopeSelected } from '@app/scope/store/selectors/scope.selector';
import { ScopeModalComponent } from '@app/scopes-and-layouts/containers/scope-modal/scope-modal.component';
import { SharedService } from '@app/services/shared-service';
import {
  DeleteWorkpackageLinkSuccess,
  UpdateWorkPackageLink,
  WorkPackageLinkActionTypes
} from '@app/workpackage/store/actions/workpackage-link.actions';
import {
  AddWorkpackageNodeOwner,
  DeleteWorkpackageNodeOwner,
  DeleteWorkpackageNodeSuccess,
  UpdateWorkPackageNode,
  WorkPackageNodeActionTypes,
  AddWorkPackageNodeDescendant,
  DeleteWorkPackageNodeDescendant
} from '@app/workpackage/store/actions/workpackage-node.actions';
import {
  GetWorkpackageAvailability,
  LoadWorkPackages,
  SetWorkpackageDisplayColour,
  SetWorkpackageEditMode,
  SetWorkpackageSelected
} from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageDetail, WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import {
  getEditWorkpackages,
  getSelectedWorkpackageIds,
  getSelectedWorkpackages,
  getWorkPackageEntities,
  workpackageSelectAllowed
} from '@app/workpackage/store/selectors/workpackage.selector';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { go } from 'gojs/release/go-module';
import { BehaviorSubject, combineLatest, fromEvent, Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
// import {Attribute} from '?/store/models/attribute.model';
import { ArchitectureDiagramComponent } from '../components/architecture-diagram/architecture-diagram.component';
import { ObjectDetailsValidatorService } from '../components/object-details-form/services/object-details-form-validator.service';
import { ObjectDetailsService } from '../components/object-details-form/services/object-details-form.service';
import { DeleteLinkModalComponent } from '../containers/delete-link-modal/delete-link-modal.component';
import { DeleteModalComponent } from '../containers/delete-modal/delete-modal.component';
import { DeleteNodeModalComponent } from '../containers/delete-node-modal/delete-node-modal.component';
import { Level } from '../services/diagram-level.service';
import { FilterService } from '../services/filter.service';
import { State as NodeState, State as ViewState } from '../store/reducers/architecture.reducer';
import { getViewLevel } from '../store/selectors/view.selector';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { Link, Node } from 'gojs';
import { DocumentModalComponent } from '@app/documentation-standards/containers/document-modal/document-modal.component';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { OwnersModalComponent } from '@app/workpackage/containers/owners-modal/owners-modal.component';
import { DescendantsModalComponent } from '@app/architecture/containers/descendants-modal/descendants-modal.component';
import { GetNodesRequestQueryParams } from '@app/architecture/services/node.service';
import { LayoutActionTypes } from '@app/layout/store/actions/layout.actions';
import { DeleteRadioPropertyModalComponent } from '@app/radio/containers/delete-property-modal/delete-property-modal.component';

enum Events {
  NodesLinksReload = 0
}

@Component({
  selector: 'smi-architecture',
  templateUrl: 'architecture.component.html',
  styleUrls: ['architecture.component.scss'],
  providers: [ObjectDetailsValidatorService, ObjectDetailsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectureComponent implements OnInit, OnDestroy {
  private zoomRef;
  private showHideGridRef;
  private showDetailTabRef;
  private showHideRadioAlertRef;

  @Input() attributesView = false;
  @Input() allowMove = false;
  public selectedPart = null;

  showOrHideLeftPane = false;

  private nodesSubscription: Subscription;
  private linksSubscription: Subscription;

  selectedNode: NodeDetail | NodeLinkDetail;

  links: any[] = [];
  nodes: any[] = [];

  public eventEmitter: BehaviorSubject<any> = new BehaviorSubject(null);

  customProperties: NodeDetail;
  nodesLinks$: Observable<any>;
  owners$: Observable<TeamEntity[]>;
  workpackage$: Observable<WorkPackageEntity[]>;
  scopes$: Observable<ScopeEntity[]>;
  radio$: Observable<RadioEntity[]>;
  scopeDetails$: Observable<ScopeDetails>;
  mapView: boolean;
  viewLevel$: Observable<number>;
  // mapViewId$: Observable<string>;
  part: any;
  showGrid: boolean;
  showOrHideGrid: string;
  allowEditLayouts: string;
  // attributeSubscription: Subscription;
  clickedOnLink = false;
  objectSelected = false;
  isEditable = false;
  nodeId: string;
  allowEditWorkPackages: string;
  workPackageIsEditable = false;
  workpackageDetail: any;
  public selectedWorkPackages$: Observable<WorkPackageDetail>;
  filterServiceSubscription: Subscription;
  layout: LayoutDetails;
  layoutStoreSubscription: Subscription;
  editedWorkpackageSubscription: Subscription;
  showOrHideRightPane = false;
  selectedRightTab: number;
  selectedLeftTab: number;
  multipleSelected = false;
  selectedMultipleNodes = [];
  radioAlertChecked = true;
  radioTab = true;
  detailsTab = false;
  selectedWorkpackages = [];
  subscriptions: Subscription[] = [];
  sw: string[] = [];
  canSelectWorkpackages = false;
  workpackageId: string;
  selectedOwner = false;
  selectedOwnerIndex: string | null;
  public selectedScope$: Observable<ScopeEntity>;
  editTabIndex: number;
  public parentName: string | null;

  @ViewChild(ArchitectureDiagramComponent)
  private diagramComponent: ArchitectureDiagramComponent;
  @ViewChild(LeftPanelComponent)
  private leftPanelComponent: LeftPanelComponent;

  constructor(
    private sharedService: SharedService,
    private teamStore: Store<TeamState>,
    private nodeStore: Store<NodeState>,
    private scopeStore: Store<ScopeState>,
    private layoutStore: Store<LayoutState>,
    private store: Store<ViewState>,
    private radioStore: Store<RadioState>,
    private workpackageStore: Store<WorkPackageState>,
    private objectDetailsService: ObjectDetailsService,
    private diagramChangesService: DiagramChangesService,
    public dialog: MatDialog,
    public filterService: FilterService,
    private ref: ChangeDetectorRef,
    public gojsCustomObjectsService: GojsCustomObjectsService,
    public actions: Actions
  ) {
    // If filterLevel not set, ensure to set it.
    const currentFilter = this.filterService.getFilter();
    if (!currentFilter || !currentFilter.filterLevel) {
      this.filterService.setFilter({ filterLevel: Level.system });
    }
  }

  ngOnInit() {
    // Scopes
    this.scopeStore.dispatch(new LoadScopes({}));
    this.scopes$ = this.scopeStore.pipe(select(getScopeEntities));
    this.selectedScope$ = this.scopeStore.pipe(select(getScopeSelected));

    this.scopeDetails$ = this.scopeStore.pipe(select(getScopeSelected));

    // Layouts
    this.layoutStore.dispatch(new LoadLayouts({}));
    this.layoutStore.dispatch(new LoadLayout('00000000-0000-0000-0000-000000000000'));

    // Load Work Packages
    this.workpackageStore.dispatch(new LoadWorkPackages({}));

    // Teams
    this.teamStore.dispatch(new LoadTeams({}));
    this.owners$ = this.teamStore.pipe(select(getTeamEntities));

    this.workpackage$ = this.workpackageStore.pipe(
      select(getWorkPackageEntities),
      shareReplay()
    );

    this.subscriptions.push(
      this.workpackageStore.pipe(select(getSelectedWorkpackageIds)).subscribe(ids => {
        if (JSON.stringify(this.sw) !== JSON.stringify(ids)) {
          this.sw = ids;
          this.workpackageStore.dispatch(new GetWorkpackageAvailability({ workPackageQuery: ids }));
        }
      })
    );

    this.workpackageStore
      .pipe(select(workpackageSelectAllowed))
      .subscribe(canSelect => (this.canSelectWorkpackages = canSelect));

    // RADIO
    this.radioStore.dispatch(new LoadRadios({}));
    this.radio$ = this.radioStore.pipe(select(getRadioEntities));

    // View Level
    this.viewLevel$ = this.store.pipe(select(getViewLevel));

    this.nodesLinks$ = combineLatest(
      this.filterService.filter,
      this.workpackageStore.pipe(select(getSelectedWorkpackages)),
      this.eventEmitter.pipe(filter(event => event === Events.NodesLinksReload || event === null))
    );

    this.filterServiceSubscription = this.nodesLinks$.subscribe(([fil, workpackages, _]) => {
      this.selectedWorkpackages = workpackages;
      if (fil) {
        const { filterLevel, id, scope, parentName } = fil;
        if (filterLevel) {
          this.setNodesLinks(filterLevel, id, workpackages.map(item => item.id), scope);
        }
        this.parentName = parentName ? parentName : null;
      }
    });

    this.subscriptions.push(
      fromEvent(window, 'popstate').subscribe(() => {
        // setTimeout for filterService to update filters
        setTimeout(() => {
          const currentFilter = this.filterService.getFilter();
          const filterWorkpackages = currentFilter && currentFilter.workpackages ? currentFilter.workpackages : [];
          const selectedWorkpackagesIds = this.selectedWorkpackages.map(wp => wp.id);
          const diff = filterWorkpackages
            .filter(x => !selectedWorkpackagesIds.includes(x))
            .concat(selectedWorkpackagesIds.filter(x => !filterWorkpackages.includes(x)));
          diff.forEach(id => {
            this.workpackageStore.dispatch(new SetWorkpackageSelected({ workpackageId: id }));
          });
        });
      })
    );

    this.scopeStore.pipe(select(getScopeSelected)).subscribe(scope => {
      if (scope) {
        this.filterService.addFilter({ scope: scope.id });
      }
    });

    const { scope, workpackages } = this.filterService.getFilter();
    if (scope) {
      this.scopeStore.dispatch(new LoadScope(scope));
    } else {
      this.scopeStore.dispatch(new LoadScope('00000000-0000-0000-0000-000000000000'));
    }
    if (workpackages && Array.isArray(workpackages)) {
      workpackages.forEach(id => {
        if (id && typeof id === 'string') {
          this.workpackageStore.dispatch(new SetWorkpackageSelected({ workpackageId: id }));
        }
      });
    }

    this.layoutStoreSubscription = this.layoutStore.pipe(select(getLayoutSelected)).subscribe(layout => {
      this.layout = layout;
      if (layout) {
        const currentLevel = this.filterService.getFilter().filterLevel;

        // Reload nodes and links for new layout if not in map view
        if (!currentLevel.endsWith('map')) {
          this.subscribeForNodesLinksData();
        }
      }
    });

    this.zoomRef = this.gojsCustomObjectsService.zoom$.subscribe(
      function(zoomType: 'In' | 'Out') {
        if (zoomType === 'In') {
          this.onZoomIn();
        } else {
          this.onZoomOut();
        }
      }.bind(this)
    );

    this.showHideGridRef = this.gojsCustomObjectsService.showHideGrid$.subscribe(
      function() {
        this.onShowGrid();
        this.ref.detectChanges();
      }.bind(this)
    );

    // Observable to capture instruction to switch to the Detail tab from GoJS context menu
    this.showDetailTabRef = this.gojsCustomObjectsService.showDetailTab$.subscribe(
      function() {
        // Show the right panel if hidden
        this.showOrHideRightPane = true;
        this.selectedRightTab = 0;
        this.ref.detectChanges();
      }.bind(this)
    );

    this.showHideRadioAlertRef = this.gojsCustomObjectsService.showHideRadioAlert$.subscribe(
      function() {
        this.radioAlertChecked = !this.radioAlertChecked;
        this.ref.detectChanges();
      }.bind(this)
    );

    this.editedWorkpackageSubscription = this.workpackageStore
      .pipe(select(getEditWorkpackages))
      .subscribe(workpackages => {
        this.allowMove = workpackages.length > 0;
        this.allowMove === true ? (this.allowEditLayouts = 'close') : (this.allowEditLayouts = 'edit');

        this.workPackageIsEditable = this.allowMove;
        this.workPackageIsEditable === true
          ? (this.allowEditWorkPackages = 'close')
          : (this.allowEditWorkPackages = 'edit');
      });

    this.subscriptions.push(
      this.nodeStore.pipe(select(getSelectedNode)).subscribe(nodeDetail => {
        this.selectedNode = nodeDetail;
        this.ref.detectChanges();
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(WorkPackageNodeActionTypes.AddWorkPackageNodeSuccess)).subscribe(_ => {
        this.eventEmitter.next(Events.NodesLinksReload);
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(LayoutActionTypes.LoadLayoutSuccess)).subscribe(_ => {
        this.eventEmitter.next(Events.NodesLinksReload);
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(WorkPackageNodeActionTypes.AddWorkPackageNodeSuccess)).subscribe(_ => {
        this.eventEmitter.next(Events.NodesLinksReload);
      })
    );

    this.subscriptions.push(
      this.nodeStore.pipe(select(getSelectedNodeLink)).subscribe(nodeLinkDetail => {
        this.selectedNode = nodeLinkDetail;
        this.ref.detectChanges();
      })
    );

    /*this.mapViewId$ = this.store.pipe(select(fromNode.getMapViewId));
    this.mapViewId$.subscribe(linkId => {
      if (linkId) {
        const payload = { linkId: linkId};
        this.store.dispatch(new LoadMapView(payload));
      }
      this.mapView = Boolean(linkId);
    });*/
    /*this.attributeSubscription = this.store.pipe(select(fromNode.getAttributes)).subscribe((data) => {
      this.attributes = data.attributes;
    });*/
  }

  ngOnDestroy() {
    this.filterServiceSubscription.unsubscribe();
    if (this.nodesSubscription) {
      this.nodesSubscription.unsubscribe();
    }
    if (this.linksSubscription) {
      this.linksSubscription.unsubscribe();
    }
    this.layoutStoreSubscription.unsubscribe();
    this.editedWorkpackageSubscription.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  setNodesLinks(layer: string, id?: string, workpackageIds: string[] = [], scope?: string) {
    if (layer !== Level.attribute) {
      this.attributesView = false;
    } else {
      this.attributesView = true;
    }

    const queryParams: GetNodesRequestQueryParams = {
      workPackageQuery: workpackageIds
    };
    if (scope) {
      queryParams.scopeQuery = scope;
    }

    if (layer.endsWith('map')) {
      this.nodeStore.dispatch(new LoadMapView({ id, queryParams }));
    } else if (layer === Level.usage) {
      this.nodeStore.dispatch(new LoadNodeUsageView({ node: id, query: queryParams }));
    } else {
      this.nodeStore.dispatch(new LoadNodes(queryParams));
      this.nodeStore.dispatch(new LoadNodeLinks(queryParams));
    }
  }

  selectColourForWorkPackage(data: { colour: string; id: string }) {
    this.workpackageStore.dispatch(
      new SetWorkpackageDisplayColour({
        colour: data.colour,
        workpackageId: data.id
      })
    );
  }

  partsSelected(parts: go.Part[]) {
    if (parts.length < 2) {
      const part = parts[0];

      if (part && part.data) {
        this.selectedPart = part.data;
      } else {
        this.selectedPart = '';
        this.clickedOnLink = false;
      }

      // Enable "Edit" and "Delete" buttons then GoJS object is selected
      this.objectSelected = false;
      this.isEditable = false;

      this.objectDetailsService.objectDetailsForm.patchValue(this.selectedPart);

      this.nodeId = this.selectedPart.id;

      this.part = part;

      this.detailsTab = false;

      if (part) {
        this.selectedOwnerIndex = null;
        this.selectedOwner = false;
        // By clicking on link show only name, category and description in the right panel
        this.clickedOnLink = part instanceof Link;

        // Load node details
        this.workpackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
          const workPackageIds = workpackages.map(item => item.id);
          this.setWorkPackage(workPackageIds);
        });

        this.objectSelected = true;
        this.radioTab = false;
      } else {
        this.radioTab = true;
        this.objectSelected = false;
        this.multipleSelected = false;
        this.selectedMultipleNodes = [];
      }
    } else {
      this.objectSelected = false;
      this.multipleSelected = true;
      this.detailsTab = true;
    }

    // Multiple selection
    if (parts.length > 1) {
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] instanceof Link) {
          // links
        } else {
          // Push only objects (not links)
          if (this.selectedMultipleNodes.indexOf(parts[i].data) === -1) {
            this.selectedMultipleNodes.push(parts[i].data);
          }
        }
      }
    }
  }

  setWorkPackage(workpackageIds: string[] = []) {
    const queryParams = {
      workPackageQuery: workpackageIds
    };

    // Do not attempt to load data for disconnected node links that have not been added to the database yet
    if (!this.part.data.isTemporary) {
      this.part instanceof Node
        ? this.nodeStore.dispatch(new LoadNode({id: this.nodeId, queryParams: queryParams}))
        : this.nodeStore.dispatch(new LoadNodeLink({id: this.nodeId, queryParams: queryParams}));
    }
  }

  // FIXME: should be removed as createObject/node/link handled inside change service
  modelChanged(event: any) {}

  get objectDetailsForm(): FormGroup {
    return this.objectDetailsService.objectDetailsForm;
  }

  onSaveObjectDetails() {
    this.selectedOwner = false;
    this.selectedOwnerIndex = null;
    if (this.clickedOnLink) {
      const linkData = {
        id: this.selectedPart.id,
        category: this.selectedPart.category,
        name: this.objectDetailsForm.value.name,
        description: this.objectDetailsForm.value.description
      };

      this.diagramChangesService.updatePartData(this.part, linkData);
    } else {
      const nodeData = {
        id: this.selectedPart.id,
        layer: this.selectedPart.layer,
        category: this.selectedPart.category,
        name: this.objectDetailsForm.value.name,
        description: this.objectDetailsForm.value.description,
        tags: this.objectDetailsForm.value.tags
      };

      this.diagramChangesService.updatePartData(this.part, nodeData);
    }

    this.isEditable = false;
  }

  onEditDetails(details: any) {
    this.isEditable = true;
  }

  onCancelEdit() {
    this.isEditable = false;
    this.selectedOwner = false;
    this.selectedOwnerIndex = null;
  }

  onShowGrid() {
    this.showGrid = !this.showGrid;
    this.showGrid === true ? (this.showOrHideGrid = 'border_clear') : (this.showOrHideGrid = 'border_inner');
  }

  allowEditWorkPackage() {
    this.workPackageIsEditable = !this.workPackageIsEditable;
    this.workPackageIsEditable === true
      ? (this.allowEditWorkPackages = 'close')
      : (this.allowEditWorkPackages = 'edit');
  }

  allowEditLayout() {
    this.allowMove = !this.allowMove;
    this.allowMove === true ? (this.allowEditLayouts = 'close') : (this.allowEditLayouts = 'edit');
  }

  onZoomMap() {
    this.diagramComponent.zoomToFit();
  }

  // FIXME: types
  handleUpdateNodeLocation(data: { nodes: any[]; links: any[] }) {
    // Do not update back end if using default layout
    if (this.layout.id === '00000000-0000-0000-0000-000000000000') {
      return;
    }

    if (this.layout && data.nodes && data.nodes.length > 0) {
      this.store.dispatch(new UpdateNodes({ layoutId: this.layout.id, nodes: data.nodes }));
    }
    if (this.layout && data.links && data.links.length > 0) {
      this.store.dispatch(new UpdateLinks({ layoutId: this.layout.id, links: data.links }));
    }
  }

  handleNodeDeleteRequested(node: any) {
    // check if particular node is under any workpackage
    if (node.impactedByWorkPackages && node.impactedByWorkPackages.length < 1) {
      // check if any workpackage selected
      if (this.selectedWorkpackages.length < 1) {
        return;
      }
      // lets add selected workpackages in to node/link
      node = { ...node, impactedByWorkPackages: this.selectedWorkpackages };
    }
    this.dialog
      .open(DeleteNodeModalComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          payload: node
        }
      })
      .beforeClosed()
      .subscribe(action => {
        if (action instanceof DeleteWorkpackageNodeSuccess) {
          this.eventEmitter.next(Events.NodesLinksReload);
        }
      });
  }

  handleLinkDeleteRequested(link: any) {
    // check if particular node is under any workpackage
    if (link.impactedByWorkPackages && link.impactedByWorkPackages.length < 1) {
      // check if any workpackage selected
      if (this.selectedWorkpackages.length < 1) {
        return;
      }
      // lets add selected workpackages in to node/link
      link = { ...link, impactedByWorkPackages: this.selectedWorkpackages };
    }
    this.dialog
      .open(DeleteLinkModalComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          payload: link
        }
      })
      .beforeClosed()
      .subscribe(action => {
        if (action instanceof DeleteWorkpackageLinkSuccess) {
          this.eventEmitter.next(Events.NodesLinksReload);
        }
      });
  }

  subscribeForNodesLinksData() {
    this.nodesSubscription = this.nodeStore
      .pipe(
        select(getNodeEntities),
        // Get correct location for nodes, based on selected layout
        map(nodes => {
          const currentFilter = this.filterService.getFilter();
          if (nodes === null) {
            return null;
          }
          if (currentFilter && currentFilter.filterLevel.endsWith('map')) {
            return nodes;
          }

          let layoutLoc;

          return nodes.map(
            function(node) {
              if (this.layout && 'id' in this.layout) {
                layoutLoc = node.locations.find(
                  function(loc) {
                    return loc.layout && loc.layout.id === this.layout.id;
                  }.bind(this)
                );
              }

              return {
                ...node,
                location: layoutLoc ? layoutLoc.locationCoordinates : null,
                locationMissing: !layoutLoc
              };
            }.bind(this)
          );
        })
      )
      .subscribe(nodes => {
        if (nodes) {
          this.nodes = [...nodes];
        } else {
          this.nodes = [];
        }
        this.ref.detectChanges();
      });

    this.linksSubscription = this.nodeStore
      .pipe(
        select(getNodeLinks),
        // Get correct route for links, based on selected layout
        map(links => {
          const currentFilter = this.filterService.getFilter();
          if (links === null) {
            return null;
          }
          if (currentFilter && [Level.systemMap, Level.dataSetMap, Level.usage].includes(currentFilter.filterLevel)) {
            return links;
          }

          let layoutRoute;

          return links.map(
            function(link) {
              if (this.layout && 'id' in this.layout) {
                layoutRoute = link.routes.find(
                  function(route) {
                    return route.layout && route.layout.id === this.layout.id;
                  }.bind(this)
                );
              }

              return {
                ...link,
                route: layoutRoute ? layoutRoute.points : [],
                routeMissing: !layoutRoute
              };
            }.bind(this)
          );
        })
      )
      .subscribe(links => {
        if (links) {
          this.links = [...links];
        } else {
          this.links = [];
        }
        this.ref.detectChanges();
      });
  }

  onDeleteAttribute() {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data.mode === 'delete') {
        // this.store.dispatch(new AttributeActions.DeleteAttribute({attributeId: this.selectedNode.id}));
      }
    });
  }

  displayOptionsChanged({ event, option }: { event: any; option: string }) {
    this.diagramChangesService.updateDisplayOptions(event, option, this.diagramComponent.diagram);
  }

  onZoomIn() {
    this.diagramComponent.increaseZoom();
  }

  onZoomOut() {
    this.diagramComponent.decreaseZoom();
  }

  onSelectWorkPackage(id: string) {
    this.objectSelected = false;
    this.updateWorkpackageFilter(id);
    this.workpackageStore.dispatch(new SetWorkpackageSelected({ workpackageId: id }));
  }

  // FIXME: set proper type of workpackage
  onSelectEditWorkpackage(workpackage: any) {
    this.workpackageId = workpackage.id;
    this.objectSelected = false;
    if (this.part) {
      this.part.isSelected = false;
    }
    this.updateWorkpackageFilter(this.workpackageId, !workpackage.edit);
    this.workpackageStore.dispatch(new SetWorkpackageEditMode({ id: workpackage.id }));
  }

  onSelectScope(id) {
    this.scopeStore.dispatch(new LoadScope(id));
  }

  onSelectLayout(id) {
    this.layoutStore.dispatch(new LoadLayout(id));
  }

  onTabClick(index: number) {
    this.workPackageIsEditable === true && index === 1 ? (this.editTabIndex = 1) : (this.editTabIndex = null);
    this.diagramComponent.updateDiagramArea();
  }

  openLeftTab(index: number) {
    this.selectedLeftTab = index;
    if (this.selectedLeftTab === index) {
      this.showOrHideLeftPane = true;
    }

    this.selectedLeftTab === 0 || this.selectedLeftTab === 2 ? (this.editTabIndex = null) : (this.editTabIndex = 1);

    this.diagramComponent.updateDiagramArea();
  }

  onHideLeftPane() {
    this.showOrHideLeftPane = false;
    this.diagramComponent.updateDiagramArea();
  }

  onAddRelatedRadio() {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        this.radioStore.dispatch(
          new AddRadioEntity({
            data: {
              title: data.radio.title,
              description: data.radio.description,
              status: data.radio.status,
              category: data.radio.category,
              author: { id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0' },
              target: { id: this.nodeId }
            }
          })
        );
        if (data.radio.status === 'open') {
          this.diagramChangesService.updateRadioCount(this.part, data.radio.category);
        }
      }
    });
  }

  onAddAttribute() {
    this.dialog.open(AttributeModalComponent, { width: '450px' });
  }

  openRightTab(index: number) {
    this.selectedRightTab = index;
    if (this.selectedRightTab === index) {
      this.showOrHideRightPane = true;
    }
    this.diagramComponent.updateDiagramArea();
  }

  onHideRightPane() {
    this.showOrHideRightPane = false;
    this.diagramComponent.updateDiagramArea();
  }

  onAddRadio() {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        this.store.dispatch(
          new AddRadioEntity({
            data: {
              title: data.radio.title,
              description: data.radio.description,
              status: data.radio.status,
              category: data.radio.category,
              author: { id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0' }
            }
          })
        );
      }
    });
  }

  onAddScope() {
    const dialogRef = this.dialog.open(ScopeModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(
          new AddScope({
            id: null,
            name: data.scope.name,
            owners: this.sharedService.selectedOwners,
            viewers: this.sharedService.selectedViewers,
            layerFilter: this.filterService.getFilter().filterLevel.toLowerCase(),
            include: this.selectedMultipleNodes
          })
        );
      }
      this.selectedMultipleNodes = [];
      this.sharedService.selectedOwners = [];
      this.sharedService.selectedViewers = [];
    });
  }

  onAddOwner() {
    const dialogRef = this.dialog.open(OwnersModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.owner) {
        this.nodeStore.dispatch(
          new AddWorkpackageNodeOwner({
            workpackageId: this.workpackageId,
            nodeId: this.nodeId,
            ownerId: data.owner.id,
            data: data.owner
          })
        );
      }
    });
  }

  onDeleteOwner() {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.nodeStore.dispatch(
          new DeleteWorkpackageNodeOwner({
            workpackageId: this.workpackageId,
            nodeId: this.nodeId,
            ownerId: this.selectedOwnerIndex
          })
        );
        this.selectedOwner = false;
      }
    });
  }

  onAddDescendant() {
    const dialogRef = this.dialog.open(DescendantsModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        currentLevel: this.selectedNode.layer
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.descendant) {
        this.workpackageStore.dispatch(
          new AddWorkPackageNodeDescendant({
            workpackageId: this.workpackageId,
            nodeId: this.nodeId,
            node: data.descendant
          })
        );
      }
    });
  }

  onDeleteDescendant(id: string) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.workpackageStore.dispatch(
          new DeleteWorkPackageNodeDescendant({
            workpackageId: this.workpackageId,
            nodeId: this.nodeId,
            descendantId: id
          })
        );
      }
    });
  }

  onSelectOwner(ownerId) {
    this.selectedOwnerIndex = ownerId;
    this.selectedOwner = true;
  }

  onEditProperties(customProperty: CustomPropertyValuesEntity) {
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        mode: 'edit',
        customProperties: customProperty
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.customProperties) {
        this.nodeStore.dispatch(
          new UpdateCustomProperty({
            workPackageId: this.workpackageId,
            nodeId: this.nodeId,
            customPropertyId: customProperty.propertyId,
            data: { data: { value: data.customProperties.value }}
          })
        );
      }
    });
  }

  onDeleteProperties(customProperty: CustomPropertyValuesEntity) {
    const dialogRef = this.dialog.open(DeleteRadioPropertyModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: customProperty.name
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(new DeleteCustomProperty({
          workPackageId: this.workpackageId, 
          nodeId: this.nodeId,
          customPropertyId: customProperty.propertyId
        }))
      }
    });
  }

  updateWorkpackageFilter(id: string, reset?: boolean) {
    const existingFilter = this.filterService.getFilter();
    if (reset) {
      return this.filterService.setFilter({ ...existingFilter, workpackages: [id] });
    }
    if (existingFilter.workpackages && existingFilter.workpackages.length > 0) {
      const workpackageAlreadySelected = existingFilter.workpackages.find(workpackageId => workpackageId === id);
      if (workpackageAlreadySelected) {
        const filteredWorkpackageIds = existingFilter.workpackages.filter(workpackageId => workpackageId !== id);
        if (filteredWorkpackageIds.length > 0) {
          this.filterService.setFilter({ ...existingFilter, workpackages: filteredWorkpackageIds });
        } else {
          delete existingFilter.workpackages;
          this.filterService.setFilter({ ...existingFilter });
        }
      } else {
        this.filterService.setFilter({ ...existingFilter, workpackages: [...existingFilter.workpackages, id] });
      }
    } else {
      this.filterService.setFilter({ ...existingFilter, workpackages: [id] });
    }
  }
}
