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
  AssociateTag,
  CreateTag,
  DissociateTag,
  GetParentDescendantIds,
  LoadAvailableTags,
  LoadMapView,
  LoadNode,
  LoadNodeLink,
  LoadNodeLinks,
  LoadNodeReports,
  LoadNodes,
  LoadNodeUsageView,
  NodeActionTypes,
  RemoveParentDescendantIds,
  SetParentDescendantIds,
  UpdateGroupAreaSize,
  UpdateLinks,
  UpdateNodeExpandedState,
  UpdateNodeLocations,
  UpdateNodeOwners,
  UpdatePartsLayout,
  RemoveAllDraft
} from '@app/architecture/store/actions/node.actions';
import { NodeLink, NodeLinkDetail } from '@app/architecture/store/models/node-link.model';
import {
  AttributesEntity,
  DescendantsEntity,
  LoadingStatus,
  middleOptions,
  Node,
  NodeDetail,
  NodeExpandedStateApiRequest,
  NodeReports,
  Tag,
  TagApplicableTo
} from '@app/architecture/store/models/node.model';
import {
  getAvailableTags,
  getNodeEntities,
  getNodeLinks,
  getNodeReports,
  getParentDescendantIds,
  getSelectedNode,
  getSelectedNodeLink,
  getTopologyLoadingStatus,
  getDraft
} from '@app/architecture/store/selectors/node.selector';
import { AttributeModalComponent } from '@app/attributes/containers/attribute-modal/attribute-modal.component';
import {
  AddLayout,
  LayoutActionTypes,
  LoadLayout,
  LoadLayouts,
  UpdateLayout
} from '@app/layout/store/actions/layout.actions';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import { getLayoutSelected } from '@app/layout/store/selectors/layout.selector';
import { RadioModalComponent } from '@app/radio/containers/radio-modal/radio-modal.component';
import { AddRadioEntity, LoadRadios, RadioActionTypes } from '@app/radio/store/actions/radio.actions';
import { RadioDetail, RadioEntity } from '@app/radio/store/models/radio.model';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getRadioEntities } from '@app/radio/store/selectors/radio.selector';
import { AddScope, LoadScope, LoadScopes, ScopeActionTypes } from '@app/scope/store/actions/scope.actions';
import { ScopeDetails, ScopeEntity } from '@app/scope/store/models/scope.model';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { getScopeEntities, getScopeSelected } from '@app/scope/store/selectors/scope.selector';
import { ScopeAndLayoutModalComponent } from '@app/scopes-and-layouts/containers/scope-and-layout-modal/scope-and-layout-modal.component';
import {
  AddWorkPackageLink,
  AddWorkPackageLinkAttribute,
  AddWorkPackageLinkOwner,
  AddWorkPackageLinkRadio,
  DeleteWorkPackageLinkAttribute,
  DeleteWorkpackageLinkOwner,
  DeleteWorkPackageLinkProperty,
  DeleteWorkpackageLinkSuccess,
  UpdateWorkPackageLinkProperty,
  WorkPackageLinkActionTypes,
  UpdateWorkPackageLink
} from '@app/workpackage/store/actions/workpackage-link.actions';
import {
  AddWorkPackageNode,
  AddWorkPackageNodeAttribute,
  AddWorkPackageNodeDescendant,
  AddWorkPackageNodeGroup,
  AddWorkpackageNodeOwner,
  AddWorkPackageNodeRadio,
  AddWorkPackageNodeScope,
  DeleteWorkPackageNodeAttribute,
  DeleteWorkPackageNodeDescendant,
  DeleteWorkPackageNodeGroup,
  DeleteWorkpackageNodeOwner,
  DeleteWorkPackageNodeProperty,
  DeleteWorkPackageNodeScope,
  DeleteWorkpackageNodeSuccess,
  FindPotentialWorkpackageNodes,
  LoadWorkPackageNodeScopes,
  UpdateWorkPackageNodeProperty,
  WorkPackageNodeActionTypes
} from '@app/workpackage/store/actions/workpackage-node.actions';
import {
  GetWorkpackageAvailability,
  LoadWorkPackages,
  SetSelectedWorkPackages,
  SetWorkpackageDisplayColour,
  SetWorkpackageEditMode
} from '@app/workpackage/store/actions/workpackage.actions';
import {
  CustomPropertiesEntity,
  WorkPackageDetail,
  WorkPackageEntity,
  WorkPackageNodeScopes
} from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import {
  getEditWorkpackage,
  getEditWorkpackages,
  getSelectedWorkpackageIds,
  getSelectedWorkpackages,
  getWorkPackageEntities,
  workpackageSelectAllowed
} from '@app/workpackage/store/selectors/workpackage.selector';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { go } from 'gojs/release/go-module';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay, take, tap } from 'rxjs/operators';
import { ArchitectureDiagramComponent } from '../components/architecture-diagram/architecture-diagram.component';
import { ObjectDetailsValidatorService } from '../components/object-details-form/services/object-details-form-validator.service';
import { ObjectDetailsService } from '../components/object-details-form/services/object-details-form.service';
import { DeleteLinkModalComponent } from '../containers/delete-link-modal/delete-link-modal.component';
import { DeleteNodeModalComponent } from '../containers/delete-node-modal/delete-node-modal.component';
import { DiagramLevelService, Level } from '../services/diagram-level.service';
import { State as NodeState, State as ViewState } from '../store/reducers/architecture.reducer';
import { getViewLevel } from '../store/selectors/view.selector';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { Link, Node as goNode } from 'gojs';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { GetNodesRequestQueryParams, NodeService } from '@app/architecture/services/node.service';
import { DeleteRadioPropertyModalComponent } from '@app/radio/containers/delete-property-modal/delete-property-modal.component';
import { RadioDetailModalComponent } from '../../workpackage/containers/radio-detail-modal/radio-detail-modal.component';
import { ArchitectureView } from '@app/architecture/components/switch-view-tabs/architecture-view.model';
import { getNodeScopes, getPotentialWorkPackageNodes } from '../store/selectors/workpackage.selector';
import { NodeScopeModalComponent } from './add-scope-modal/add-scope-modal.component';
import { SwitchViewTabsComponent } from '../components/switch-view-tabs/switch-view-tabs.component';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import {
  getFilterLevelQueryParams,
  getQueryParams,
  getScopeQueryParams,
  getWorkPackagesQueryParams
} from '@app/core/store/selectors/route.selectors';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { Params } from '@angular/router';
import { LayoutSettingsService } from '../components/analysis-tab/services/layout-settings.service';
import { ArchitectureTableViewComponent } from '../components/architecture-table-view/architecture-table-view.component';
import { RadioListModalComponent } from '@app/workpackage/containers/radio-list-modal/radio-list-modal.component';
import { DeleteAttributeModalComponent } from './delete-attribute-modal/delete-attribute-modal.component';
import { State as AttributeState } from '@app/attributes/store/reducers/attributes.reducer';
import { AddAttribute, AttributeActionTypes } from '@app/attributes/store/actions/attributes.actions';
import { AddExistingAttributeModalComponent } from './add-existing-attribute-modal/add-existing-attribute-modal.component';
import { RadioConfirmModalComponent } from './radio-confirm-modal/radio-confirm-modal.component';
import { NewChildrenModalComponent } from './new-children-modal/new-children-modal.component';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';
import { SelectModalComponent } from '@app/core/layout/components/select-modal/select-modal.component';
import { DownloadCSVModalComponent } from '@app/core/layout/components/download-csv-modal/download-csv-modal.component';
import { ComponentsOrLinksModalComponent } from './components-or-links-modal/components-or-links-modal.component';

enum Events {
  NodesLinksReload = 0
}

@Component({
  selector: 'smi-architecture',
  templateUrl: 'architecture.component.html',
  styleUrls: ['architecture.component.scss'],
  providers: [ObjectDetailsValidatorService, ObjectDetailsService, LayoutSettingsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectureComponent implements OnInit, OnDestroy {
  private zoomRef;
  private showHideGridRef;
  private showDetailTabRef;
  private showHideRadioAlertRef;
  private addSystemToGroupRef;
  private addNewSubItemRef;

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

  nodeScopes$: Observable<WorkPackageNodeScopes[]>;
  customProperties: NodeDetail;
  nodesLinks$: Observable<any>;
  owners$: Observable<TeamEntity[]>;
  workpackage$: Observable<WorkPackageEntity[]>;
  scopes$: Observable<ScopeEntity[]>;
  radio$: Observable<RadioEntity[]>;
  scopeDetails$: Observable<ScopeDetails>;
  nodeReports$: Observable<NodeReports[]>;
  mapView: boolean;
  viewLevel$: Observable<Level>;
  draft: any;
  // mapViewId$: Observable<string>;
  part: any;
  showGrid: boolean;
  // attributeSubscription: Subscription;
  clickedOnLink = false;
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
  selectedLeftTab: number | string;
  multipleSelected: boolean;
  selectedMultipleNodes = [];
  radioAlertChecked = true;
  radioTab = true;
  detailsTab = false;
  selectedWorkpackages = [];
  subscriptions: Subscription[] = [];
  sw: string[] = [];
  canSelectWorkpackages = false;
  workpackageId: string;
  public selectedScope$: Observable<ScopeEntity>;
  public selectedLayout$: Observable<ScopeDetails>;
  public parentName: string | null;
  public selectedView: ArchitectureView = ArchitectureView.Diagram;
  public ArchitectureView = ArchitectureView;
  public selectedId: string;
  public scope: ScopeDetails;
  private currentFilterLevel: Level;
  private filterLevelSubscription: Subscription;
  private addDataSetSubscription: Subscription;
  public params: Params;
  public tableViewFilterValue: string;
  public selectedWorkPackageEntities: WorkPackageEntity[];
  public parentDescendantIds: Observable<string[]>;
  public availableTags$: Observable<Tag[]>;
  public loadingStatus = LoadingStatus;
  public byId = false;

  @ViewChild(ArchitectureDiagramComponent)
  private diagramComponent: ArchitectureDiagramComponent;
  @ViewChild(LeftPanelComponent)
  private leftPanelComponent: LeftPanelComponent;
  @ViewChild(SwitchViewTabsComponent)
  private switchViewTabsComponent: SwitchViewTabsComponent;
  @ViewChild(ArchitectureTableViewComponent)
  private tableView: ArchitectureTableViewComponent;
  @ViewChild('drawer') drawer;

  get nodeComponentLayer(): TagApplicableTo {
    if (!this.selectedNode) {
      return TagApplicableTo.systems;
    }
    if (this.selectedNode.hasOwnProperty('sourceId')) {
      return (this.selectedNode.layer + ' links') as TagApplicableTo;
    } else {
      return (this.selectedNode.layer + 's') as TagApplicableTo;
    }
  }

  get isLoading$(): Observable<LoadingStatus> {
    return this.store.select(getTopologyLoadingStatus);
  }

  constructor(
    private layoutSettingsService: LayoutSettingsService,
    private teamStore: Store<TeamState>,
    private nodeStore: Store<NodeState>,
    private scopeStore: Store<ScopeState>,
    private layoutStore: Store<LayoutState>,
    private store: Store<ViewState>,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    private radioStore: Store<RadioState>,
    private workpackageStore: Store<WorkPackageState>,
    private objectDetailsService: ObjectDetailsService,
    private diagramChangesService: DiagramChangesService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    public gojsCustomObjectsService: GojsCustomObjectsService,
    public actions: Actions,
    private diagramLevelService: DiagramLevelService,
    private nodeService: NodeService,
    private attributeStore: Store<AttributeState>,
    private actions$: Actions
  ) {}

  ngOnInit() {
    this.parentDescendantIds = this.store.pipe(select(getParentDescendantIds));
    this.availableTags$ = this.store.select(getAvailableTags).pipe(map(storeTagsObj => storeTagsObj.tags));
    this.subscriptions.push(
      this.workpackageStore.pipe(select(getSelectedWorkpackages)).subscribe(
        workpackages => this.selectedWorkPackageEntities = workpackages
      )
    );
    this.subscriptions.push(
      this.actions$
        .pipe(
          ofType(NodeActionTypes.ReloadNodesData),
          tap(() => {
            this.eventEmitter.next(Events.NodesLinksReload);
          })
        )
        .subscribe()
    );
    this.subscriptions.push(
      this.workpackageStore.select(getEditWorkpackage).subscribe(id => (this.workpackageId = id))
    );
    this.subscriptions.push(this.routerStore.select(getQueryParams).subscribe(params => (this.params = params)));
    this.subscriptions.push(
      this.routerStore.select(getWorkPackagesQueryParams).subscribe(workpackages => {
        if (typeof workpackages === 'string') {
          return this.workpackageStore.dispatch(new SetSelectedWorkPackages({ workPackages: [workpackages] }));
        }
        if (workpackages) {
          return this.workpackageStore.dispatch(new SetSelectedWorkPackages({ workPackages: workpackages }));
        }
        return this.workpackageStore.dispatch(new SetSelectedWorkPackages({ workPackages: [] }));
      })
    );
    this.filterLevelSubscription = this.routerStore.select(getFilterLevelQueryParams).subscribe(filterLevel => {
      this.removeAllDraft();
      if (!this.currentFilterLevel && !filterLevel) {
        this.routerStore.dispatch(new UpdateQueryParams({ filterLevel: Level.system }));
      }
      this.currentFilterLevel = filterLevel;
    });
    this.addDataSetSubscription = this.gojsCustomObjectsService.addDataSet$.subscribe(() => {
      this.onAddDescendant();
    });
    // Scopes
    this.scopeStore.dispatch(new LoadScopes({}));
    this.scopes$ = this.scopeStore.pipe(select(getScopeEntities));
    this.selectedScope$ = this.scopeStore.pipe(select(getScopeSelected));
    this.scopeDetails$ = this.scopeStore.pipe(select(getScopeSelected));

    // Layouts
    this.layoutStore.dispatch(new LoadLayouts({}));
    this.selectedLayout$ = this.layoutStore.pipe(select(getLayoutSelected));
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
    this.viewLevel$ = this.store.pipe(
      select(getViewLevel),
      tap(level => {
        if (level === Level.dimension || level === Level.reportingConcept) {
          this.onViewChange(ArchitectureView.System);
        } else {
          this.onViewChange(ArchitectureView.Diagram);
        }
      })
    );

    this.nodesLinks$ = combineLatest(
      this.routerStore.select(getQueryParams),
      this.eventEmitter.pipe(filter(event => event === Events.NodesLinksReload || event === null))
    );

    this.filterServiceSubscription = this.nodesLinks$.subscribe(([fil, _]) => {
      if (fil) {
        const { filterLevel, id, scope, parentName, workpackages, isTransformation, selectedItem, selectedType } = fil;
        const workpackagesArray = typeof workpackages === 'string' ? [workpackages] : workpackages;

        if (filterLevel) {
          this.selectedWorkpackages = workpackagesArray;
          this.setNodesLinks(filterLevel, id, workpackagesArray, scope, isTransformation);
        }
        if (selectedItem) {
          setTimeout(() => {
            this.isLoading$
              .pipe(
                filter(status => status === LoadingStatus.loaded),
                take(1)
              )
              .subscribe(() => {
                this.routerStore.dispatch(new UpdateQueryParams({ selectedItem: null, selectedType: null }));
                this.diagramComponent.selectNode(selectedItem);
                this.openRightTab(0);
                if (selectedType === 'node') {
                  this.onViewChange(ArchitectureView.System);
                } else {
                  this.onViewChange(ArchitectureView.Links);
                }
              });
          });
        }

        this.parentName = parentName ? parentName : null;
        if (id) {
          this.byId = true;
          const parentNode: Node = this.nodes.find(node => node.id === id);
          if (!parentNode) {
            this.store.dispatch(new GetParentDescendantIds({ id, workpackages: workpackagesArray || [] }));
          } else {
            this.store.dispatch(new SetParentDescendantIds(parentNode.descendants.map(n => n.id)));
          }
        } else {
          this.byId = false;
          this.store.dispatch(new RemoveParentDescendantIds());
        }
      }
    });

    // this.subscriptions.push(
    //   fromEvent(window, 'popstate').subscribe(() => {
    //     // setTimeout for filterService to update filters
    //     setTimeout(() => {
    //       this.routerStore
    //         .select(getQueryParams)
    //         .pipe(take(1))
    //         .subscribe(params => {
    //           let filterWorkpackages: string[];
    //           if (typeof params.workpackages === 'string') {
    //             filterWorkpackages = [params.workpackages];
    //           } else {
    //             filterWorkpackages = params.workpackages ? params.workpackages : [];
    //           }
    //           const selectedWorkpackagesIds = this.selectedWorkpackages.map(wp => wp.id);
    //           const diff = filterWorkpackages
    //             .filter(x => !selectedWorkpackagesIds.includes(x))
    //             .concat(selectedWorkpackagesIds.filter(x => !filterWorkpackages.includes(x)));
    //           diff.forEach(id => {
    //              this.workpackageStore.dispatch(new SetWorkpackageSelected({ workpackageId: id }));
    //           });
    //         });
    //     });
    //   })
    // );

    this.scopeStore.pipe(select(getScopeSelected)).subscribe(scope => {
      if (scope) {
        this.scope = scope;
        this.store.dispatch(new UpdateQueryParams({ scope: scope.id }));
        // this.filterService.addFilter({ scope: scope.id });
      }
    });

    // const { scope, workpackages } = this.filterService.getFilter();
    this.routerStore
      .select(getScopeQueryParams)
      .pipe(take(1))
      .subscribe(scope => {
        if (scope) {
          this.scopeStore.dispatch(new LoadScope(scope));
        } else {
          this.scopeStore.dispatch(new LoadScope('00000000-0000-0000-0000-000000000000'));
        }
      });

    this.layoutStoreSubscription = this.layoutStore.pipe(select(getLayoutSelected)).subscribe(layout => {
      this.layout = layout;
      if (layout) {
        // Show layout data in settings tab
        this.layoutSettingsService.layoutSettingsForm.patchValue({ ...layout.settings });
        // Reload nodes and links for new layout if not in map view
        if (this.currentFilterLevel && !this.currentFilterLevel.endsWith('map') && !this.nodesSubscription) {
          this.subscribeForNodesLinksData();
        }
      }
    });

    this.addNewSubItemRef = this.gojsCustomObjectsService.addNewSubItem$.subscribe(
      function() {
        this.onAddNewSystem();
      }.bind(this)
    );

    this.addSystemToGroupRef = this.gojsCustomObjectsService.addSystemToGroup$.subscribe(
      function() {
        this.onAddToGroup();
      }.bind(this)
    );

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
        this.workPackageIsEditable = this.allowMove;
      });

    this.subscriptions.push(
      this.nodeStore.pipe(select(getSelectedNode)).subscribe(nodeDetail => {
        this.selectedNode = nodeDetail;
        this.ref.detectChanges();
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(RadioActionTypes.AddRadioSuccess)).subscribe((action: any) => {
        if (this.selectedWorkPackageEntities.length >= 1 && this.part) {
          this.getRadioConfirmModal(action.payload.id);
        }
        this.radioStore.dispatch(new LoadRadios({}));
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(NodeActionTypes.UpdateNodeOwners)).subscribe(_ => {
        // Keep node selected after adding a owner
        this.diagramComponent.selectNode(this.nodeId);
      })
    );

    this.subscriptions.push(
      this.actions
        .pipe(
          ofType(
            WorkPackageNodeActionTypes.AddWorkPackageNodeSuccess,
            WorkPackageLinkActionTypes.AddWorkPackageLinkSuccess,
            LayoutActionTypes.LoadLayoutSuccess,
            WorkPackageNodeActionTypes.AddWorkPackageNodeRadioSuccess
          )
        )
        .subscribe(_ => {
          this.eventEmitter.next(Events.NodesLinksReload);
        })
    );

    this.subscriptions.push(
      this.nodeStore.pipe(select(getSelectedNodeLink)).subscribe(nodeLinkDetail => {
        this.selectedNode = nodeLinkDetail;
        this.ref.detectChanges();
      })
    );

    this.subscriptions.push(
      this.nodeStore.pipe(select(getDraft)).subscribe(draft => {
        this.draft = !!this.layout && !!this.layout.id && !!draft[this.layout.id] ? draft[this.layout.id] : null;
        this.ref.detectChanges();
      })
    );

    this.subscriptions.push(
      this.actions
        .pipe(ofType(ScopeActionTypes.AddScopeSuccess, WorkPackageNodeActionTypes.AddWorkPackageNodeScopeSuccess))
        .subscribe(_ => {
          this.workpackageStore.dispatch(new LoadWorkPackageNodeScopes({ nodeId: this.nodeId }));
        })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(AttributeActionTypes.AddAttributeSuccess)).subscribe((action: any) => {
        if (!this.clickedOnLink) {
          this.workpackageStore.dispatch(
            new AddWorkPackageNodeAttribute({
              workPackageId: this.getWorkPackageId(),
              nodeId: this.nodeId,
              attributeId: action.payload.id
            })
          );
        } else {
          this.workpackageStore.dispatch(
            new AddWorkPackageLinkAttribute({
              workPackageId: this.getWorkPackageId(),
              nodeLinkId: this.nodeId,
              attributeId: action.payload.id
            })
          );
        }
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
    this.filterLevelSubscription.unsubscribe();
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
    this.removeAllDraft();
  }

  get layoutSettingsForm(): FormGroup {
    return this.layoutSettingsService.layoutSettingsForm;
  }

  setNodesLinks(layer: Level,
    id?: string,
    workpackageIds: string[] = [],
    scope?: string,
    isTransformation?: boolean
  ) {
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
    if (isTransformation) {
      queryParams.isTransformation = isTransformation;
    }

    if (layer.endsWith('map')) {
      this.nodeStore.dispatch(new LoadMapView({ id, queryParams }));
    } else if (layer === Level.usage) {
      this.nodeStore.dispatch(new LoadNodeUsageView({ node: id, query: queryParams }));
    } else {
      queryParams.layerQuery = layer;
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

      this.objectDetailsService.updateForm(this.selectedPart);
      this.nodeId = this.selectedPart.id;
      this.part = part;

      if (part) {
        // Load node scopes
        this.workpackageStore.dispatch(new LoadWorkPackageNodeScopes({ nodeId: this.nodeId }));
        this.nodeScopes$ = this.workpackageStore.pipe(select(getNodeScopes));

        this.clickedOnLink = part instanceof Link;

        const workPackageIds = this.selectedWorkPackageEntities.map(item => item.id);
        this.setWorkPackage(workPackageIds);
        this.getNodeReports(workPackageIds);

        if (this.clickedOnLink && this.selectedRightTab === 1) {
          this.showOrHideRightPane = false;
        }
      }
    }

    parts.length >= 2 ? (this.multipleSelected = true) : (this.multipleSelected = false);

    // Multiple selections
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

  getNodeReports(workpackageIds: string[] = []): void {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.nodeStore.dispatch(new LoadNodeReports({ nodeId: this.nodeId, queryParams: queryParams }));
    this.nodeReports$ = this.store.pipe(select(getNodeReports));
  }

  setWorkPackage(workpackageIds: string[] = []) {
    const queryParams = {
      workPackageQuery: workpackageIds
    };

    // Do not attempt to load data for disconnected node links that have not been added to the database yet
    if (!this.part.data.isTemporary) {
      this.part instanceof goNode
        ? this.nodeStore.dispatch(new LoadNode({ id: this.nodeId, queryParams: queryParams }))
        : this.nodeStore.dispatch(new LoadNodeLink({ id: this.nodeId, queryParams: queryParams }));
    }
  }

  // FIXME: should be removed as createObject/node/link handled inside change service
  modelChanged(event: any) {}

  get objectDetailsForm(): FormGroup {
    return this.objectDetailsService.objectDetailsForm;
  }

  onSaveObjectDetails() {
    if (this.clickedOnLink) {
      const linkData = {
        id: this.selectedPart.id,
        category: this.objectDetailsForm.value.category,
        layer: this.selectedPart.layer,
        name: this.objectDetailsForm.value.name,
        reference: this.objectDetailsForm.value.reference,
        tags: this.objectDetailsForm.value.tags,
        description: this.objectDetailsForm.value.description,
        sourceId: this.selectedPart.sourceId,
        targetId: this.selectedPart.targetId
      };
      this.diagramChangesService.updatePartData(this.part, linkData);
    } else {
      const nodeData = {
        id: this.selectedPart.id,
        layer: this.selectedPart.layer,
        category: this.objectDetailsForm.value.category,
        name: this.objectDetailsForm.value.name,
        reference: this.objectDetailsForm.value.reference,
        description: this.objectDetailsForm.value.description,
        tags: this.objectDetailsForm.value.tags
      };
      this.diagramChangesService.updatePartData(this.part, nodeData);
    }
  }

  onShowGrid(): void {
    this.showGrid = !this.showGrid;
  }

  allowEditWorkPackage() {
    this.workPackageIsEditable = !this.workPackageIsEditable;
    this.workPackageIsEditable === true
      ? (this.allowEditWorkPackages = 'close')
      : (this.allowEditWorkPackages = 'edit');
  }

  allowEditLayout(): void {
    this.allowMove = !this.allowMove;
    this.allowMove ? this.layoutSettingsForm.enable() : this.layoutSettingsForm.disable();
  }

  onZoomToFit(): void {
    this.diagramComponent.zoomToFit();
  }

  removeAllDraft(): void {
    this.store.dispatch(new RemoveAllDraft());
  }

  onSaveLayout(): void {
    if (!this.layout || this.layout.id === '00000000-0000-0000-0000-000000000000') {
      return;
    }
    if (this.draft) {
      this.store.dispatch(new UpdatePartsLayout({
          ...this.draft,
          draft: false
        }));
    }
  }

  onSaveAsLayout(): void {
    alert("SaveAsLayout");
  }

  // FIXME: types
  handleUpdateNodeLocation(data: { nodes: any[]; links: any[] }) {
    // Do not update back end if using default layout
    if (this.layout.id === '00000000-0000-0000-0000-000000000000') {
      return;
    }

    if (this.layout && data.nodes && data.nodes.length > 0) {
      this.store.dispatch(new UpdateNodeLocations({ layoutId: this.layout.id, nodes: data.nodes }));
    }
    if (this.layout && data.links && data.links.length > 0) {
      this.store.dispatch(new UpdateLinks({ layoutId: this.layout.id, links: data.links }));
    }
  }

  handleUpdateNodeExpandState(data: { node: NodeExpandedStateApiRequest['data']; links: go.Link[] }): void {
    // Do not update back end if using default layout
    if (this.layout.id === '00000000-0000-0000-0000-000000000000') {
      return;
    }

    if (this.layout) {
      this.store.dispatch(new UpdateNodeExpandedState({ layoutId: this.layout.id, data: data.node }));
    }

    if (this.layout && data.links && data.links.length > 0) {
      this.store.dispatch(new UpdateLinks({ layoutId: this.layout.id, links: data.links }));
    }
  }

  handleUpdateGroupArea(data: {
    groups: { id: string; areaSize: string; locationCoordinates: string }[];
    links: go.Link[];
  }): void {
    // Do not update back end if using default layout
    if (this.layout.id === '00000000-0000-0000-0000-000000000000') {
      return;
    }

    if (this.layout && data.groups.length > 0) {
      this.store.dispatch(new UpdateGroupAreaSize({ layoutId: this.layout.id, data: data.groups }));
      this.store.dispatch(new UpdateNodeLocations({ layoutId: this.layout.id, nodes: data.groups }));
    }

    if (this.layout && data.links && data.links.length > 0) {
      this.store.dispatch(new UpdateLinks({ layoutId: this.layout.id, links: data.links }));
    }
  }

  // Here
  handleUpdateDiagramLayout() {
    // Do not update back end if using default layout
    if (this.layout.id === '00000000-0000-0000-0000-000000000000') {
      return;
    }

    const nodeLayoutData = this.diagramComponent.diagram.model.nodeDataArray.map(function(node) {
      return {
        id: node.id,
        positionSettings: {
          locationCoordinates: node.location,
          middleExpanded: node.middleExpanded,
          bottomExpanded: node.bottomExpanded,
          areaSize: node.areaSize
        }
      };
    });

    const linkLayoutData = (this.diagramComponent.diagram.model as any).linkDataArray.map(function(link) {
      return {
        id: link.id,
        positionSettings: {
          route: link.route
        }
      };
    });

    if (this.layout) {
      this.store.dispatch(
        new UpdatePartsLayout({
          layoutId: this.layout.id,
          data: {
            positionDetails: {
              workPackages: this.selectedWorkPackageEntities.map(function(
                workpackage: WorkPackageEntity
              ): { id: string; name: string } {
                return { id: workpackage.id, name: workpackage.name };
              }),
              positions: {
                nodes: nodeLayoutData,
                nodeLinks: linkLayoutData
              }
            }
          },
          draft: true
        })
      );
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
      node = { ...node };
    }
    this.dialog
      .open(DeleteNodeModalComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          payload: node,
          workpackageId: this.workpackageId
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
      link = { ...link };
    }
    this.dialog
      .open(DeleteLinkModalComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          payload: link,
          workpackageId: this.workpackageId
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
        // Get correct location, expanded state and group area size for nodes, based on selected layout
        map(nodes => {
          if (nodes === null) {
            return null;
          }
          if (this.currentFilterLevel && this.currentFilterLevel.endsWith('map')) {
            return nodes.map(function(node) {
              return { ...node, middleExpanded: middleOptions.none, bottomExpanded: false };
            });
          }

          return nodes.map(
            function(node) {
              let nodeLayout;

              if (this.layout && 'id' in this.layout) {
                nodeLayout = node.positionPerLayout.find(
                  function(layoutSettings) {
                    return layoutSettings.layout.id === this.layout.id;
                  }.bind(this)
                );
              }

              // Temporary workaround for issue with API incorrectly assigning group status to system level transformation nodes
              const correctedIsGroup = node.category === 'transformation' ? false : node.isGroup;

              const layoutProps = nodeLayout ? nodeLayout.layout.positionSettings : null;

              return {
                ...node,
                isGroup: correctedIsGroup,
                location: layoutProps && layoutProps.locationCoordinates ? layoutProps.locationCoordinates : null,
                locationMissing: !(layoutProps && layoutProps.locationCoordinates),
                middleExpanded:
                  layoutProps && layoutProps.middleExpanded ? layoutProps.middleExpanded : middleOptions.none,
                bottomExpanded: layoutProps ? !!layoutProps.bottomExpanded : false,
                areaSize: layoutProps && layoutProps.areaSize ? layoutProps.areaSize : null
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
          if (links === null) {
            return null;
          }
          if (
            this.currentFilterLevel &&
            [Level.systemMap, Level.dataSetMap, Level.usage].includes(this.currentFilterLevel as Level)
          ) {
            return links;
          }

          return links.map(
            function(link) {
              let linkLayout;

              if (this.layout && 'id' in this.layout) {
                linkLayout = link.positionPerLayout.find(
                  function(layoutSettings) {
                    return layoutSettings.layout.id === this.layout.id;
                  }.bind(this)
                );
              }

              const layoutProps = linkLayout ? linkLayout.layout.positionSettings : null;

              return {
                ...link,
                route: layoutProps && layoutProps.route ? layoutProps.route : [],
                routeMissing: !(layoutProps && layoutProps.route)
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

  onDeleteNode(): void {
    if (this.part instanceof goNode) {
      this.handleNodeDeleteRequested(this.part.data);
    } else {
      this.handleLinkDeleteRequested(this.part.data);
    }
  }

  displayOptionsChanged({ event, option }: { event: any; option: string }) {
    if (this.diagramComponent) {
      this.diagramChangesService.updateDisplayOptions(event, option, this.diagramComponent.diagram);
      this.updateLayoutSettings();
    }
  }

  onZoomIn() {
    this.diagramComponent.increaseZoom();
  }

  onZoomOut() {
    this.diagramComponent.decreaseZoom();
  }

  onSelectWorkPackage(selection: { id: string; newState: boolean }) {
    this.routerStore
      .select(getWorkPackagesQueryParams)
      .pipe(take(1))
      .subscribe(workpackages => {
        let urlWorkpackages: string[];
        let params: Params;
        if (typeof workpackages === 'string') {
          urlWorkpackages = [workpackages];
        } else {
          urlWorkpackages = workpackages ? [...workpackages] : [];
        }
        const index = urlWorkpackages.findIndex(id => id === selection.id);
        if (selection.newState) {
          if (index === -1) {
            params = { workpackages: [...urlWorkpackages, selection.id] };
          } else {
            params = { workpackages: [...urlWorkpackages] };
          }
        } else {
          if (index !== -1) {
            urlWorkpackages.splice(index, 1);
          }
          params = { workpackages: [...urlWorkpackages] };
        }
        this.routerStore.dispatch(new UpdateQueryParams(params));
      });
  }

  // FIXME: set proper type of workpackage
  onSelectEditWorkpackage(workpackage: any) {
    this.workpackageId = workpackage.id;
    if (!workpackage.edit) {
      this.routerStore.dispatch(new UpdateQueryParams({ workpackages: this.workpackageId }));
    } else {
      this.routerStore.dispatch(new UpdateQueryParams({ workpackages: null }));
    }
    this.workpackageStore.dispatch(new SetWorkpackageEditMode({ id: workpackage.id, newState: !workpackage.edit }));
  }

  onSelectScope(id) {
    this.removeAllDraft();
    this.scopeStore.dispatch(new LoadScope(id));
    this.layoutStore.dispatch(new LoadLayout('00000000-0000-0000-0000-000000000000'));
  }

  onSelectLayout(id) {
    this.removeAllDraft();
    this.layoutStore.dispatch(new LoadLayout(id));
  }

  onTabClick(index: number | string): void {
    this.selectedLeftTab = index;
    setTimeout(() => {
      this.diagramComponent.updateDiagramArea();
      this.realignTabUnderline();
    }, 250);
  }

  openLeftTab(tab: number | string): void {
    this.drawer.opened && this.selectedLeftTab === tab ? this.drawer.close() : this.drawer.open();
    typeof tab !== 'string' ? (this.selectedLeftTab = tab) : (this.selectedLeftTab = 'menu');
    if (!this.drawer.opened) {
      this.selectedLeftTab = 'menu';
    }
    setTimeout(() => {
      this.diagramComponent.updateDiagramArea();
      this.realignTabUnderline();
    }, 250);
  }

  onAddRelatedRadio(): void {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false,
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        const relatesTo = [
          {
            workPackage: {
              id: '00000000-0000-0000-0000-000000000000'
            },
            item: {
              id: this.nodeId,
              itemType: this.currentFilterLevel.toLowerCase()
            }
          }
        ];

        this.radioStore.dispatch(
          new AddRadioEntity({
            data: {
              ...data.radio,
              relatesTo: this.selectedWorkPackageEntities.length === 0 ? relatesTo : []
            }
          })
        );

        if (data.radio.status === 'open') {
          this.diagramChangesService.updateRadioCount(this.part, data.radio.category);
        }
      }
    });
  }

  getRadioConfirmModal(radioId: string): void {
    const dialogRef = this.dialog.open(RadioConfirmModalComponent, {
      disableClose: true,
      width: '500px',
      data: {
        selectedWorkPackages: this.selectedWorkPackageEntities
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        data.workpackages.forEach(workpackage => {
          if (!this.clickedOnLink) {
            this.workpackageStore.dispatch(
              new AddWorkPackageNodeRadio({
                workPackageId: workpackage.id,
                nodeId: this.nodeId,
                radioId: radioId
              })
            );
          } else {
            this.workpackageStore.dispatch(
              new AddWorkPackageLinkRadio({
                workPackageId: workpackage.id,
                nodeLinkId: this.nodeId,
                radioId: radioId
              })
            );
          }
        });
      }
    });
  }

  onAssignRadio(): void {
    const dialogRef = this.dialog.open(RadioListModalComponent, {
      disableClose: false,
      width: '650px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        this.getRadioConfirmModal(data.radio.id);
      }
    });

    dialogRef.componentInstance.addNewRadio.subscribe(() => {
      this.onAddRelatedRadio();
    });
  }

  getWorkPackageId(): string {
    if (this.workpackageId) {
      return this.workpackageId;
    } else {
      return '00000000-0000-0000-0000-000000000000';
    }
  }

  onAddAttribute(): void {
    const dialogRef = this.dialog.open(AttributeModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.attribute) {
        this.store.dispatch(
          new AddAttribute({
            workPackageId: this.workpackageId,
            entity: { data: { ...data.attribute } }
          })
        );
      }
    });
  }

  onAddExistingAttribute(): void {
    const dialogRef = this.dialog.open(AddExistingAttributeModalComponent, {
      disableClose: false,
      width: '600px',
      height: '590px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.attribute) {
        if (!this.clickedOnLink) {
          this.store.dispatch(
            new AddWorkPackageNodeAttribute({
              workPackageId: this.getWorkPackageId(),
              nodeId: this.nodeId,
              attributeId: data.attribute.id
            })
          );
        } else {
          this.store.dispatch(
            new AddWorkPackageLinkAttribute({
              workPackageId: this.getWorkPackageId(),
              nodeLinkId: this.nodeId,
              attributeId: data.attribute.id
            })
          );
        }
      }
    });
  }

  onDeleteAttribute(attribute: AttributesEntity): void {
    const dialogRef = this.dialog.open(DeleteAttributeModalComponent, {
      width: '500px',
      data: {
        type: attribute.category,
        name: attribute.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.attribute) {
        if (!this.clickedOnLink) {
          this.attributeStore.dispatch(
            new DeleteWorkPackageNodeAttribute({
              workPackageId: this.getWorkPackageId(),
              nodeId: this.nodeId,
              attributeId: attribute.id
            })
          );
        } else {
          this.attributeStore.dispatch(
            new DeleteWorkPackageLinkAttribute({
              workPackageId: this.getWorkPackageId(),
              nodeLinkId: this.nodeId,
              attributeId: attribute.id
            })
          );
        }
      }
    });
  }

  openRightTab(index: number) {
    this.selectedRightTab = index;
    if (this.selectedRightTab === index) {
      this.showOrHideRightPane = true;
    }
    this.diagramComponent.updateDiagramArea();
    this.realignTabUnderline();
  }

  onHideRightPane() {
    this.showOrHideRightPane = false;
    this.diagramComponent.updateDiagramArea();
    this.realignTabUnderline();
  }

  onAddRadio() {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false,
      width: '650px'
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
              assignedTo: data.radio.assignedTo,
              author: data.radio.author,
              relatesTo: [{ workPackage: { id: '00000000-0000-0000-0000-000000000000' } }],
              actionBy: data.radio.actionBy,
              mitigation: data.radio.mitigation
            }
          })
        );
      }
    });
  }

  onAddScope(): void {
    const dialogRef = this.dialog.open(ScopeAndLayoutModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Scope'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.scopeAndLayout) {
        this.store.dispatch(
          new AddScope({
            id: data.scopeAndLayout.id,
            name: data.scopeAndLayout.name,
            layerFilter: this.currentFilterLevel.toLowerCase(),
            include: this.selectedMultipleNodes
          })
        );
      }
      this.selectedMultipleNodes = [];
    });
  }

  onAddOwner(): void {
    const ids = new Set(this.selectedNode.owners.map(({ id }) => id));
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Select owner',
        placeholder: 'Teams',
        options$: this.teamStore.pipe(select(getTeamEntities)).pipe(map(data => data.filter(({ id }) => !ids.has(id)))),
        selectedIds: []
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        if (!this.clickedOnLink) {
          this.nodeStore.dispatch(
            new AddWorkpackageNodeOwner({
              workpackageId: this.workpackageId,
              nodeId: this.nodeId,
              ownerId: data.value[0].id,
              data: data.value[0]
            })
          );
        } else {
          this.nodeStore.dispatch(
            new AddWorkPackageLinkOwner({
              workPackageId: this.workpackageId,
              nodeLinkId: this.nodeId,
              ownerId: data.value[0].id
            })
          );
        }
      }
    });
  }

  onDeleteOwner(id: string): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title:
          'Are you sure you want to un-associate? Neither owners will be deleted but they will no longer be associated.',
        confirmBtn: 'Yes',
        cancelBtn: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (!this.clickedOnLink) {
          this.nodeStore.dispatch(
            new DeleteWorkpackageNodeOwner({
              workpackageId: this.workpackageId,
              nodeId: this.nodeId,
              ownerId: id
            })
          );
        } else {
          this.nodeStore.dispatch(
            new DeleteWorkpackageLinkOwner({
              workPackageId: this.workpackageId,
              nodeLinkId: this.nodeId,
              ownerId: id
            })
          );
        }
      }
    });
  }

  onAddDescendant() {
    this.store.dispatch(
      new FindPotentialWorkpackageNodes({
        workPackageId: this.workpackageId,
        nodeId: this.nodeId,
        data: {}
      })
    );
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: `Add Children to "${this.selectedNode.name}"`,
        placeholder: 'Components',
        descendants: true,
        nodeId: this.nodeId,
        workPackageId: this.workpackageId,
        scopeId: this.scope.id,
        options$: this.store.pipe(select(getPotentialWorkPackageNodes)),
        selectedIds: [],
        multi: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.workpackageStore.dispatch(
          new AddWorkPackageNodeDescendant({
            workPackageId: this.workpackageId,
            nodeId: this.nodeId,
            data: data.value
          })
        );
      }
    });
  }

  onDeleteDescendant(descendant: DescendantsEntity): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title:
          'Are you sure you want to un-associate? Neither components will be deleted but they will no longer be associated.',
        confirmBtn: 'Yes',
        cancelBtn: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.workpackageStore.dispatch(
          new DeleteWorkPackageNodeDescendant({
            workpackageId: this.workpackageId,
            nodeId: this.nodeId,
            descendantId: descendant.id
          })
        )
      }
    });
  }

  onAddToGroup() {
    const ids = new Set(this.selectedNode.descendants.map(({ id }) => id));
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: `Add "${this.selectedNode.name}" to...`,
        placeholder: 'Components',
        options$: this.store.pipe(select(getNodeEntities)).pipe(
          map(nodes => nodes.filter(node =>
            !node.group.length &&
            !ids.has(node.id) &&
            node.category !== 'transformation'))
        ),
        selectedIds: []
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.workpackageStore.dispatch(
          new AddWorkPackageNodeGroup({
            workPackageId: this.workpackageId,
            systemId: this.nodeId,
            groupId: data.value[0].id
          })
        );
      }
    });
  }

  onDeleteNodeGroup(node: Node) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Are you sure you want to un-associate? Neither components will be deleted but they will no longer be associated.',
        confirmBtn: 'Yes',
        cancelBtn: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.workpackageStore.dispatch(
          new DeleteWorkPackageNodeGroup({
            workPackageId: this.workpackageId,
            systemId: (node === undefined) ? this.nodeId : node.id
          })
        )
      }
    });
  }

  onSaveProperties(data: { propertyId: string; value: string }): void {
    if (!this.clickedOnLink) {
      this.workpackageStore.dispatch(
        new UpdateWorkPackageNodeProperty({
          workPackageId: this.getWorkPackageId(),
          nodeId: this.nodeId,
          customPropertyId: data.propertyId,
          data: data.value
        })
      );
    } else {
      this.workpackageStore.dispatch(
        new UpdateWorkPackageLinkProperty({
          workPackageId: this.getWorkPackageId(),
          nodeLinkId: this.nodeId,
          customPropertyId: data.propertyId,
          data: data.value
        })
      );
    }
  }

  onDeleteProperties(property: CustomPropertiesEntity): void {
    const dialogRef = this.dialog.open(DeleteRadioPropertyModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: property.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        if (!this.clickedOnLink) {
          this.workpackageStore.dispatch(
            new DeleteWorkPackageNodeProperty({
              workPackageId: this.getWorkPackageId(),
              nodeId: this.nodeId,
              customPropertyId: property.propertyId
            })
          );
        } else {
          this.workpackageStore.dispatch(
            new DeleteWorkPackageLinkProperty({
              workPackageId: this.getWorkPackageId(),
              nodeLinkId: this.nodeId,
              customPropertyId: property.propertyId
            })
          );
        }
      }
    });
  }

  onOpenRadio(radio: RadioDetail) {
    this.dialog.open(RadioDetailModalComponent, {
      disableClose: false,
      width: '850px',
      data: {
        radio: radio
      }
    });
  }

  onViewChange(view: ArchitectureView, from?) {
    this.selectedView = view;
    if (view === ArchitectureView.Diagram) {
      this.tableViewFilterValue = null;
    }
  }

  onSelectNode(node: Node | NodeLink) {
    this.selectedId = node.id;
  }

  onChangeLevel(node: Node | NodeLink) {
    this.diagramLevelService.changeLevelWithFilter(null, { data: node } as any);
  }

  realignTabUnderline(): void {
    this.switchViewTabsComponent.architectureTableTabs.realignInkBar();
  }

  onAddLayout(): void {
    const dialogRef = this.dialog.open(ScopeAndLayoutModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Layout'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.scopeAndLayout) {
        this.store.dispatch(
          new AddLayout({
            id: data.scopeAndLayout.id,
            name: data.scopeAndLayout.name,
            scope: this.scope
          })
        );
      }
    });
  }

  onDeleteScope(scope: WorkPackageNodeScopes): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: `Are you sure you want to delete "${scope.name}" scope?`
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.scopeStore.dispatch(new DeleteWorkPackageNodeScope({ scopeId: scope.id, nodeId: this.nodeId }));
      }
    });
  }

  onAddExistingScope(): void {
    const dialogRef = this.dialog.open(NodeScopeModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        nodeId: this.nodeId
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.scope) {
        this.scopeStore.dispatch(new AddWorkPackageNodeScope({ scopeId: data.scope, data: [this.nodeId] }));
      }
    });
  }

  onAddNewScope(): void {
    const dialogRef = this.dialog.open(ScopeAndLayoutModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Scope'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.scopeAndLayout) {
        this.store.dispatch(
          new AddScope({
            id: data.scopeAndLayout.id,
            name: data.scopeAndLayout.name,
            layerFilter: this.currentFilterLevel.toLowerCase(),
            include: [{ id: this.nodeId }]
          })
        );
      }
    });
  }

  updateLayoutSettings(): void {
    // Do not update back end if using default layout
    if (this.layout.id === '00000000-0000-0000-0000-000000000000') {
      return;
    }

    this.store.dispatch(
      new UpdateLayout({
        id: this.layout.id,
        data: {
          id: this.layout.id,
          name: this.layout.name,
          scope: {
            id: this.scope.id
          },
          settings: {
            components: { ...this.layoutSettingsForm.get('components').value },
            links: { ...this.layoutSettingsForm.get('links').value }
          }
        }
      })
    );
  }

  onFilterRadioSeverity(): void {
    this.updateLayoutSettings();
  }

  onCollapseAllNodes(): void {
    console.log('collapse all');
  }

  onSummariseAllNodes(): void {
    console.log('summarise all');
  }

  onExpandAll(): void {
    console.log('expand all');
  }

  onSearchTableView(filterValue: string): void {
    const dataSource = this.tableView.dataSource;
    dataSource.filter = filterValue.toLowerCase().toUpperCase();
    this.tableViewFilterValue = filterValue;
  }

  onDownload(type: 'node' | 'links') {
    this.dialog.open(DownloadCSVModalComponent, {
      width: '250px',
      disableClose: true,
      data: {
        GET: type === 'node' ? 'node' : 'links',
        fileName: type === 'node' ? 'components' : 'links'
      }
    });
  }

  onDownloadImage(): void {
    this.diagramComponent.getDiagramImage();
  }

  onAddComponentOrLink(): void {
    const dialogRef = this.dialog.open(ComponentsOrLinksModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        workPackageId: this.workpackageId,
        link: this.selectedView === ArchitectureView.Links,
        level: this.currentFilterLevel.toLowerCase()
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.node) {
        if (this.selectedView !== ArchitectureView.Links) {
          this.workpackageStore.dispatch(
            new AddWorkPackageNode({
              workpackageId: this.workpackageId,
              node: { ...data.node, layer: this.currentFilterLevel.toLowerCase() },
              scope: this.scope.id
            })
          );
        } else {
          this.workpackageStore.dispatch(
            new AddWorkPackageLink({
              workpackageId: this.workpackageId,
              link: { ...data.node, layer: this.currentFilterLevel.toLowerCase() }
            })
          );
        }
      }
    });
  }

  onUpdateAvailableTags() {
    this.store
      .pipe(
        select(getAvailableTags),
        take(1)
      )
      .subscribe(tags => {
        if (!this.workpackageId) {
          return;
        }
        this.store.dispatch(
          new LoadAvailableTags({
            workpackageId: this.workpackageId,
            nodeId: this.selectedNode.id,
            type: this.selectedNode.hasOwnProperty('sourceId') ? 'link' : 'node'
          })
        );
      });
  }

  onAddTag(tagId: string) {
    this.store.dispatch(
      new AssociateTag({
        tagIds: [{ id: tagId }],
        workpackageId: this.workpackageId,
        nodeOrLinkId: this.selectedNode.id,
        type: this.selectedNode.hasOwnProperty('sourceId') ? 'link' : 'node'
      })
    );
  }

  onCreateTag(tag: Tag) {
    this.store.dispatch(
      new CreateTag({
        tag,
        associateWithNode: {
          workpackageId: this.workpackageId,
          nodeOrLinkId: this.selectedNode.id,
          type: this.selectedNode.hasOwnProperty('sourceId') ? 'link' : 'node'
        }
      })
    );
  }

  onRemoveTag(tag: Tag) {
    this.store.dispatch(
      new DissociateTag({
        tag,
        workpackageId: this.workpackageId,
        nodeOrLinkId: this.selectedNode.id,
        type: this.selectedNode.hasOwnProperty('sourceId') ? 'link' : 'node'
      })
    );
  }

  onUpdateTag(tag: Tag) {}

  onAddNewSystem(): void {
    const dialogRef = this.dialog.open(NewChildrenModalComponent, {
      disableClose: false,
      width: '450px',
      data: {
        group: this.nodeId,
        addSystem: true
      }
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(data => {
        if (data && data.data) {
          this.workpackageStore.dispatch(
            new AddWorkPackageNode({
              workpackageId: this.workpackageId,
              node: data.data,
              scope: this.scope.id
            })
          );
        }
      });
    }

  onExitWorkPackageEditMode(): void {
    this.workpackageStore.dispatch(new SetWorkpackageEditMode({ id: this.workpackageId, newState: false }));
  }

  onSeeUsage() {
    this.routerStore.dispatch(
      new UpdateQueryParams({
        filterLevel: Level.usage,
        id: this.selectedNode.id
      })
    );
  }

  onSeeDependencies() {
    const part = this.diagramComponent.getNodeFromId(this.selectedNode.id);
    this.diagramChangesService.hideNonDependencies(part);
  }

  onEditSourceOrTarget(type: 'source' | 'target') {
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: type,
        placeholder: 'Components',
        options$: this.store.pipe(select(getNodeEntities)),
        selectedIds: []
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.workpackageStore.dispatch(
          new UpdateWorkPackageLink({
            workpackageId: this.workpackageId,
            linkId: this.nodeId,
            link: {
              ...this.part.data,
              sourceId: (type === 'source') ? data.value[0].id : null,
              targetId: (type === 'target') ? data.value[0].id : null
            }
          })
        );
      }
    });
  }
}
