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
  DeleteCustomProperty,
  LoadMapView,
  LoadNode,
  LoadNodeLink,
  LoadNodeLinks,
  LoadNodeReports,
  LoadNodes,
  LoadNodeUsageView,
  NodeActionTypes,
  UpdateCustomProperty,
  UpdateLinks,
  UpdateNodeExpandedState,
  UpdateNodeLocations
} from '@app/architecture/store/actions/node.actions';
import { NodeLink, NodeLinkDetail } from '@app/architecture/store/models/node-link.model';
import {
  CustomPropertyValuesEntity,
  DescendantsEntity,
  Node,
  NodeDetail,
  NodeReports,
  OwnersEntityOrTeamEntityOrApproversEntity
} from '@app/architecture/store/models/node.model';
import {
  getNodeEntities,
  getNodeLinks,
  getNodeReports,
  getSelectedNode,
  getSelectedNodeLink
} from '@app/architecture/store/selectors/node.selector';
import { AttributeModalComponent } from '@app/attributes/containers/attribute-modal/attribute-modal.component';
import { LayoutActionTypes, LoadLayout, LoadLayouts, UpdateLayout, AddLayout } from '@app/layout/store/actions/layout.actions';
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
  AddWorkPackageLinkOwner,
  DeleteWorkpackageLinkOwner,
  DeleteWorkpackageLinkSuccess
} from '@app/workpackage/store/actions/workpackage-link.actions';
import {
  AddWorkPackageNodeDescendant,
  AddWorkpackageNodeOwner,
  AddWorkPackageNodeRadio,
  AddWorkPackageNodeScope,
  DeleteWorkPackageNodeDescendant,
  DeleteWorkpackageNodeOwner,
  DeleteWorkPackageNodeScope,
  DeleteWorkpackageNodeSuccess,
  LoadWorkPackageNodeScopes,
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
// import {Attribute} from '?/store/models/attribute.model';
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
import { DocumentModalComponent } from '@app/documentation-standards/containers/document-modal/document-modal.component';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { State as TeamState } from '@app/settings/store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { OwnersModalComponent } from '@app/workpackage/containers/owners-modal/owners-modal.component';
import { DescendantsModalComponent } from '@app/architecture/containers/descendants-modal/descendants-modal.component';
import { GetNodesRequestQueryParams } from '@app/architecture/services/node.service';
import { DeleteRadioPropertyModalComponent } from '@app/radio/containers/delete-property-modal/delete-property-modal.component';
import { RadioDetailModalComponent } from '../../workpackage/containers/radio-detail-modal/radio-detail-modal.component';
import { ArchitectureView } from '@app/architecture/components/switch-view-tabs/architecture-view.model';
import { NodeLink } from '@app/architecture/store/models/node-link.model';
import { getNodeScopes } from '../store/selectors/workpackage.selector';
import { DeleteWorkPackageModalComponent } from '@app/workpackage/containers/delete-workpackage-modal/delete-workpackage.component';
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
  public selectedScope$: Observable<ScopeEntity>;
  public selectedLayout$: Observable<ScopeDetails>;
  editTabIndex: number;
  public parentName: string | null;
  public workPackageName: string;
  public selectedView: ArchitectureView = ArchitectureView.Diagram;
  public ArchitectureView = ArchitectureView;
  public selectedId: string;
  public layoutSettingsTab: boolean;
  public scope: ScopeDetails;
  private currentFilterLevel: string;
  private filterLevelSubscription: Subscription;
  public params: Params;
  public tableViewFilterValue: string;
  public selectedWorkPackageEntities: WorkPackageEntity[];

  @ViewChild(ArchitectureDiagramComponent)
  private diagramComponent: ArchitectureDiagramComponent;
  @ViewChild(LeftPanelComponent)
  private leftPanelComponent: LeftPanelComponent;
  @ViewChild(SwitchViewTabsComponent)
  private switchViewTabsComponent: SwitchViewTabsComponent;
  @ViewChild(ArchitectureTableViewComponent)
  private tableView: ArchitectureTableViewComponent;

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
    private diagramLevelService: DiagramLevelService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.workpackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
        this.selectedWorkPackageEntities = workpackages;
        if (workpackages.length <= 2) {
          this.workPackageName = workpackages.map(workpackage => workpackage.name).join(' & ');
        } else {
          this.workPackageName = workpackages[0].name + ' & ' + workpackages[1].name + ' ...';
        }
      })
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
      if (!this.currentFilterLevel && !filterLevel) {
        this.routerStore.dispatch(new UpdateQueryParams({ filterLevel: Level.system }));
      }
      this.currentFilterLevel = filterLevel;
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
        }
      })
    );

    this.nodesLinks$ = combineLatest(
      this.routerStore.select(getQueryParams),
      this.eventEmitter.pipe(filter(event => event === Events.NodesLinksReload || event === null))
    );

    this.filterServiceSubscription = this.nodesLinks$.subscribe(([fil, _]) => {
      if (fil) {
        const { filterLevel, id, scope, parentName, workpackages } = fil;
        const workpackagesArray = typeof workpackages === 'string' ? [workpackages] : workpackages;
        if (filterLevel) {
          this.selectedWorkpackages = workpackagesArray;
          this.setNodesLinks(filterLevel, id, workpackagesArray, scope);
        }
        this.parentName = parentName ? parentName : null;
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
        if (this.currentFilterLevel && !this.currentFilterLevel.endsWith('map')) {
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
        this.allowMove === true ? (this.allowEditLayouts = 'close') : (this.allowEditLayouts = 'brush');
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
      this.actions.pipe(ofType(RadioActionTypes.AddRadioSuccess)).subscribe(_ => {
        this.setWorkPackage([this.getWorkPackageId()]);
        this.eventEmitter.next(Events.NodesLinksReload);
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(NodeActionTypes.UpdateNodeOwners)).subscribe(_ => {
        // Keep node selected after adding a owner
        this.diagramComponent.selectNode(this.nodeId);
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(WorkPackageNodeActionTypes.AddWorkPackageNodeSuccess)).subscribe(_ => {
        this.eventEmitter.next(Events.NodesLinksReload);
      })
    );

    this.subscriptions.push(
      this.actions
        .pipe(ofType(LayoutActionTypes.LoadLayoutSuccess, WorkPackageNodeActionTypes.AddWorkPackageNodeRadioSuccess))
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
      this.actions
        .pipe(ofType(ScopeActionTypes.AddScopeSuccess, WorkPackageNodeActionTypes.AddWorkPackageNodeScopeSuccess))
        .subscribe(_ => {
          this.workpackageStore.dispatch(new LoadWorkPackageNodeScopes({ nodeId: this.nodeId }));
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
  }

  get layoutSettingsForm(): FormGroup {
    return this.layoutSettingsService.layoutSettingsForm;
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

      this.objectDetailsService.updateForm(this.selectedPart);

      this.nodeId = this.selectedPart.id;

      this.part = part;

      this.detailsTab = false;

      if (part) {
        // Load node scopes
        this.workpackageStore.dispatch(new LoadWorkPackageNodeScopes({ nodeId: this.nodeId }));
        this.nodeScopes$ = this.workpackageStore.pipe(select(getNodeScopes));

        // By clicking on link show only name, category and description in the right panel
        this.clickedOnLink = part instanceof Link;

        // Load node details
        this.workpackageStore
          .pipe(
            select(getSelectedWorkpackages),
            take(1)
          )
          .subscribe(workpackages => {
            const workPackageIds = workpackages.map(item => item.id);
            this.setWorkPackage(workPackageIds);
            this.getNodeReports(workPackageIds);
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

  allowEditLayout(): void {
    this.allowMove = !this.allowMove;
    this.allowMove === true ? (this.allowEditLayouts = 'close') : (this.allowEditLayouts = 'brush');
    this.allowMove ? this.layoutSettingsForm.enable() : this.layoutSettingsForm.disable();
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
      this.store.dispatch(new UpdateNodeLocations({ layoutId: this.layout.id, nodes: data.nodes }));
    }
    if (this.layout && data.links && data.links.length > 0) {
      this.store.dispatch(new UpdateLinks({ layoutId: this.layout.id, links: data.links }));
    }
  }

  handleUpdateNodeExpandState(data: { node: go.Node; links: go.Link[] }): void {
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
        // Get correct location and expanded state for nodes, based on selected layout
        map(nodes => {
          if (nodes === null) {
            return null;
          }
          if (this.currentFilterLevel && this.currentFilterLevel.endsWith('map')) {
            return nodes.map(function(node) {
              return { ...node, middleExpanded: false, bottomExpanded: false };
            });
          }

          let layoutLoc;
          let layoutExpandState;

          return nodes.map(
            function(node) {
              if (this.layout && 'id' in this.layout) {
                layoutLoc = node.locations.find(
                  function(loc) {
                    return loc.layout && loc.layout.id === this.layout.id;
                  }.bind(this)
                );

                layoutExpandState = node.expandedStates.find(
                  function(exp) {
                    return exp.layout && exp.layout.id === this.layout.id;
                  }.bind(this)
                );
              }

              return {
                ...node,
                location: layoutLoc ? layoutLoc.locationCoordinates : null,
                locationMissing: !layoutLoc,
                middleExpanded: layoutExpandState ? layoutExpandState.middleExpanded : false,
                bottomExpanded: layoutExpandState ? layoutExpandState.bottomExpanded : false
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

  onDeleteNode(): void {
    if (this.part instanceof goNode) {
      this.handleNodeDeleteRequested(this.part.data);
    } else {
      this.handleLinkDeleteRequested(this.part.data);
    }
  }

  displayOptionsChanged({ event, option }: { event: any; option: string }) {
    this.diagramChangesService.updateDisplayOptions(event, option, this.diagramComponent.diagram);
    this.updateLayoutSettings();
  }

  onZoomIn() {
    this.diagramComponent.increaseZoom();
  }

  onZoomOut() {
    this.diagramComponent.decreaseZoom();
  }

  onSelectWorkPackage(selection: { id: string; newState: boolean }) {
    this.objectSelected = false;
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
    this.objectSelected = false;
    if (this.part) {
      this.part.isSelected = false;
    }
    if (!workpackage.edit) {
      this.routerStore.dispatch(new UpdateQueryParams({ workpackages: this.workpackageId }));
    } else {
      this.routerStore.dispatch(new UpdateQueryParams({ workpackages: null }));
    }
    this.workpackageStore.dispatch(new SetWorkpackageEditMode({ id: workpackage.id, newState: !workpackage.edit }));
  }

  onExitWorkPackageEditMode(): void {
    this.workpackageStore.dispatch(new SetWorkpackageEditMode({ id: this.workpackageId, newState: false }));
  }

  onSelectScope(id) {
    this.scopeStore.dispatch(new LoadScope(id));
    this.layoutStore.dispatch(new LoadLayout('00000000-0000-0000-0000-000000000000'));
  }

  onSelectLayout(id) {
    this.layoutStore.dispatch(new LoadLayout(id));
  }

  onTabClick(index: number) {
    this.workPackageIsEditable === true && index === 1 ? (this.editTabIndex = 1) : (this.editTabIndex = null);
    !this.workPackageIsEditable && index === 1
      ? (this.layoutSettingsTab = true)
      : this.workPackageIsEditable && index === 2
      ? (this.layoutSettingsTab = true)
      : (this.layoutSettingsTab = false);
    this.diagramComponent.updateDiagramArea();
  }

  openLeftTab(index: number) {
    this.selectedLeftTab = index;
    if (this.selectedLeftTab === index) {
      this.showOrHideLeftPane = true;
    }

    index === 2 ? (this.layoutSettingsTab = true) : (this.layoutSettingsTab = false);

    this.selectedLeftTab === 0 || this.selectedLeftTab === 2 ? (this.editTabIndex = null) : (this.editTabIndex = 1);

    this.diagramComponent.updateDiagramArea();
    this.realignTabUnderline();
  }

  onHideLeftPane() {
    this.showOrHideLeftPane = false;
    this.diagramComponent.updateDiagramArea();
    this.realignTabUnderline();
  }

  onAddRelatedRadio() {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false,
      width: '650px',
      height: '730px'
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
              author: data.radio.author,
              assignedTo: data.radio.assignedTo,
              actionBy: data.radio.actionBy,
              mitigation: data.radio.mitigation,
              relatesTo: [
                {
                  workPackage: { id: this.workpackageId },
                  item: {
                    id: this.nodeId,
                    itemType: this.currentFilterLevel.toLowerCase()
                  }
                }
              ]
            }
          })
        );
        if (data.radio.status === 'open') {
          this.diagramChangesService.updateRadioCount(this.part, data.radio.category);
        }
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
        this.workpackageStore.dispatch(
          new AddWorkPackageNodeRadio({
            workPackageId: this.getWorkPackageId(),
            nodeId: this.nodeId,
            radioId: data.radio.id
          })
        );
      }
    });

    // Create new radio
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

  onAddAttribute() {
    this.dialog.open(AttributeModalComponent, { width: '450px' });
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
      width: '650px',
      height: '730px'
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

  onAddOwner() {
    const dialogRef = this.dialog.open(OwnersModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.owner) {
        if (!this.clickedOnLink) {
          this.nodeStore.dispatch(
            new AddWorkpackageNodeOwner({
              workpackageId: this.workpackageId,
              nodeId: this.nodeId,
              ownerId: data.owner.id,
              data: data.owner
            })
          );
        } else {
          this.nodeStore.dispatch(
            new AddWorkPackageLinkOwner({
              workPackageId: this.workpackageId,
              nodeLinkId: this.nodeId,
              ownerId: data.owner.id
            })
          );
        }
      }
    });
  }

  onDeleteOwner(owner: OwnersEntityOrTeamEntityOrApproversEntity): void {
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: owner.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        if (!this.clickedOnLink) {
          this.nodeStore.dispatch(
            new DeleteWorkpackageNodeOwner({
              workpackageId: this.workpackageId,
              nodeId: this.nodeId,
              ownerId: owner.id
            })
          );
        } else {
          this.nodeStore.dispatch(
            new DeleteWorkpackageLinkOwner({
              workPackageId: this.workpackageId,
              nodeLinkId: this.nodeId,
              ownerId: owner.id
            })
          );
        }
      }
    });
  }

  onAddDescendant() {
    const dialogRef = this.dialog.open(DescendantsModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        workpackageId: this.workpackageId,
        nodeId: this.nodeId,
        scopeId: this.scope.id,
        title: this.selectedNode.name,
        childrenOf: {
          id: null // Add node from the same level *not required*
        }
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.descendant) {
        this.workpackageStore.dispatch(
          new AddWorkPackageNodeDescendant({
            workPackageId: this.workpackageId,
            nodeId: this.nodeId,
            data: data.descendant
          })
        );
      }
    });
  }

  onDeleteDescendant(descendant: DescendantsEntity): void {
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: descendant.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.workpackageStore.dispatch(
          new DeleteWorkPackageNodeDescendant({
            workpackageId: this.workpackageId,
            nodeId: this.nodeId,
            descendantId: descendant.id
          })
        );
      }
    });
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
            data: { data: { value: data.customProperties.value } }
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

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(
          new DeleteCustomProperty({
            workPackageId: this.workpackageId,
            nodeId: this.nodeId,
            customPropertyId: customProperty.propertyId
          })
        );
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

  onViewChange(view: ArchitectureView) {
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
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: scope.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
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
}
