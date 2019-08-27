import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';
import { GojsCustomObjectsService } from '@app/architecture/services/gojs-custom-objects.service';
import { LoadMapView, LoadNode, LoadNodeLinks, LoadNodes, LoadNodeUsageView, UpdateLinks, UpdateNode
} from '@app/architecture/store/actions/node.actions';
import { linkCategories } from '@app/architecture/store/models/node-link.model';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { getNodeEntities, getNodeLinks, getSelectedNode } from '@app/architecture/store/selectors/node.selector';
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
import { DeleteWorkpackageLinkSuccess, UpdateWorkPackageLink } from '@app/workpackage/store/actions/workpackage-link.actions';
import { DeleteWorkpackageNodeSuccess, UpdateWorkPackageNode } from '@app/workpackage/store/actions/workpackage-node.actions';
import { LoadWorkPackages, SetWorkpackageDisplayColour, SetWorkpackageEditMode, SetWorkpackageSelected
} from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageDetail, WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getEditWorkpackages, getSelectedWorkpackages, getWorkPackageEntities
} from '@app/workpackage/store/selectors/workpackage.selector';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { go } from 'gojs/release/go-module';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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

  @Input() attributesView = false;
  @Input() allowMove = false;
  public selectedPart = null;

  showOrHideLeftPane = false;

  nodesSubscription: Subscription;
  linksSubscription: Subscription;

  selectedNode: NodeDetail;

  links: any[] = [];
  nodes: any[] = [];

  public eventEmitter: BehaviorSubject<any> = new BehaviorSubject(null);

  nodesLinks$: Observable<any>;

  workpackage$: Observable<WorkPackageEntity[]>;
  nodeDetail$: Observable<NodeDetail>;
  scopes$: Observable<ScopeEntity[]>;
  radio$: Observable<RadioEntity[]>;
  scopeDetails$: Observable<ScopeDetails>;
  mapView: boolean;
  viewLevel$: Observable<number>;
  mapViewId$: Observable<string>;
  part: any;
  showGrid: boolean;
  showOrHideGrid: string;
  allowEditLayouts: string;
  attributeSubscription: Subscription;
  clickedOnLink = false;
  objectSelected = false;
  isEditable = false;
  nodeId: string;
  allowEditWorkPackages: string;
  workPackageIsEditable = false;
  workpackageId: string;
  workpackageDetail: any;
  public selectedWorkPackages$: Observable<WorkPackageDetail>;
  filterServiceSubscription: Subscription;
  routerSubscription: Subscription;
  layout: LayoutDetails;
  layoutStoreSubscription: Subscription;
  workpackageSubscription: Subscription;
  editedWorkpackageSubscription: Subscription;
  showOrHideRightPane = false;
  selectedRightTab: number;
  selectedLeftTab: number;
  multipleSelected = false;
  selectedMultipleNodes = [];
  selectedWorkpackages = [];

  @ViewChild(ArchitectureDiagramComponent)
  private diagramComponent: ArchitectureDiagramComponent;
  @ViewChild(LeftPanelComponent)
  private leftPanelComponent: LeftPanelComponent;

  constructor(
    private sharedService: SharedService,
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

    // Layouts
    this.layoutStore.dispatch(new LoadLayouts({}));

    // Load Work Packages
    this.workpackageStore.dispatch(new LoadWorkPackages({}));
    this.workpackage$ = this.workpackageStore.pipe(select(getWorkPackageEntities));

    // RADIO
    this.radioStore.dispatch(new LoadRadios({}));
    this.radio$ = this.radioStore.pipe(select(getRadioEntities));


    // View Level
    this.viewLevel$ = this.store.pipe(select(getViewLevel));


    this.nodesLinks$ = combineLatest(
      this.filterService.filter,
      this.workpackageStore.pipe(select(getSelectedWorkpackages)),
      this.eventEmitter.pipe(filter(event => event === Events.NodesLinksReload || event === null ))
    );

    this.filterServiceSubscription = this.nodesLinks$.subscribe(([fil, workpackages, _event]) => {
        this.selectedWorkpackages = workpackages;
        if (fil) {
        const { filterLevel, id } = fil;
        if (filterLevel) {
          this.setNodesLinks(filterLevel, id, workpackages.map(item => item.id));
        }
      }
    });

    this.layoutStoreSubscription = this.layoutStore.pipe(select(getLayoutSelected)).subscribe(layout => {
      this.layout = layout;
      if (layout) {
        const currentLevel = this.filterService.getFilter().filterLevel;

        // Reload nodes and links for new layout if not in map view
        if (currentLevel !== Level.map) {
          this.subscribeForNodesLinksData();
        }
      }
    });

    this.zoomRef = this.gojsCustomObjectsService.zoom$.subscribe(function(zoomType: 'In' | 'Out') {
      if (zoomType === 'In') {
        this.onZoomIn();
      } else {
        this.onZoomOut();
      }
    }.bind(this));

    this.showHideGridRef = this.gojsCustomObjectsService.showHideGrid$.subscribe(
      function() {
        this.onShowGrid();
        this.ref.detectChanges();
      }.bind(this));

    // Observable to capture instruction to switch to the Detail tab from GoJS context menu
    this.showDetailTabRef = this.gojsCustomObjectsService.showDetailTab$.subscribe(function() {
      // Show the right panel if hidden
      this.showOrHideRightPane = true;
      this.selectedRightTab = 0;
      this.ref.detectChanges();
    }.bind(this));

    this.editedWorkpackageSubscription = this.workpackageStore.pipe(select(getEditWorkpackages)).subscribe((workpackages) => {
      this.allowMove = workpackages.length > 0;
      (this.allowMove === true)
        ? this.allowEditLayouts = 'close'
        : this.allowEditLayouts = 'edit';

      this.workPackageIsEditable = this.allowMove;
      (this.workPackageIsEditable === true)
        ? this.allowEditWorkPackages = 'close'
        : this.allowEditWorkPackages = 'edit';
    });

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
  }

  setNodesLinks(layer: string, id?: string, workpackageIds: string[] = []) {
    if (layer !== Level.attribute) {
      this.attributesView = false;
    } else {
      this.attributesView = true;
    }

    const queryParams = {
        workPackageQuery: workpackageIds
    };

    if (layer === Level.map) {
      this.nodeStore.dispatch(new LoadMapView(id));
    } else if (layer === Level.usage) {
      this.nodeStore.dispatch(new LoadNodeUsageView({node: id, query: queryParams}));
    } else {
      this.nodeStore.dispatch(new LoadNodes(queryParams));
      this.nodeStore.dispatch(new LoadNodeLinks(queryParams));
    }
  }

  selectColourForWorkPackage(data: { colour: string, id: string }) {
    this.workpackageStore.dispatch(new SetWorkpackageDisplayColour({ colour: data.colour, workpackageId: data.id }));
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

      this.objectDetailsService.objectDetailsForm.patchValue({
        id: this.selectedPart.id,
        name: this.selectedPart.name,
        category: this.selectedPart.category,
        owner: this.selectedPart.owner,
        description: this.selectedPart.description,
        tags: this.selectedPart.tags,
      });

      this.nodeId = this.selectedPart.id;

      this.part = part;

      if (part) {
        // By clicking on link show only name, category and description in the right panel
        this.clickedOnLink = part.category === linkCategories.data || part.category === linkCategories.masterData;
        // Load Node Details
        this.nodeStore.dispatch((new LoadNode(this.nodeId)));
        // FIXME: think we need to store this subscription so we can rewrite/destroy it when not needed anymore.
        this.nodeStore.pipe(select(getSelectedNode)).subscribe(nodeDetail => {
          this.selectedNode = nodeDetail;
        });
        this.objectSelected = true;
      } else {
        this.objectSelected = false;
        this.multipleSelected = false;
        this.selectedMultipleNodes = [];
      }

    } else {
      this.objectSelected = false;
      this.multipleSelected = true;
    }

    // Multiple selection
    if (parts.length > 1) {
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].category === linkCategories.data || parts[i].category === linkCategories.masterData) {
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

  // FIXME: should be removed as createObject/node/link handled inside change service
  modelChanged( event: any) {}

  get objectDetailsForm(): FormGroup {
    return this.objectDetailsService.objectDetailsForm;
  }

  // Not sure but probably there is a better way of doing this
  onSaveObjectDetails() {
    if (this.clickedOnLink) {

      const linkData = {
        id: this.selectedPart.id,
        category: this.selectedPart.category,
        name: this.objectDetailsForm.value.name,
        description: this.objectDetailsForm.value.description
      } ;

      const workpackages = this.selectedPart.impactedByWorkPackages.length < 1
        ? this.selectedWorkpackages
        : this.selectedPart.impactedByWorkPackages.filter(w => this.selectedWorkpackages.find(i => i.id === w.id));

      workpackages.forEach(workpackage => this.workpackageStore.dispatch(new UpdateWorkPackageLink({
        workpackageId: workpackage.id, linkId: linkData.id, link: linkData})));
      this.diagramChangesService.updatePartData(this.part, linkData);
    } else {

      const nodeData = {
        id: this.selectedPart.id,
        layer: this.selectedPart.layer,
        category: this.selectedPart.category,
        name: this.objectDetailsForm.value.name,
        owner: this.objectDetailsForm.value.owner,
        description: this.objectDetailsForm.value.description,
        tags: this.objectDetailsForm.value.tags
      };

      const workpackages = this.selectedPart.impactedByWorkPackages.length < 1
        ? this.selectedWorkpackages
        : this.selectedPart.impactedByWorkPackages.filter(w => this.selectedWorkpackages.find(i => i.id === w.id));

      workpackages.forEach(workpackage => {
          this.workpackageStore.dispatch(
            new UpdateWorkPackageNode({ workpackageId: workpackage.id, nodeId: nodeData.id, node: nodeData }));
      });
      this.diagramChangesService.updatePartData(this.part, nodeData);
    }
  }

  onEditDetails(details: any) {
    this.isEditable = true;
  }

  onCancelEdit() {
    this.isEditable = false;
  }

  onShowGrid() {
    this.showGrid = !this.showGrid;
    (this.showGrid === true)
      ? this.showOrHideGrid = 'border_clear'
      : this.showOrHideGrid = 'border_inner';
  }

  allowEditWorkPackage() {
    this.workPackageIsEditable = !this.workPackageIsEditable;
    (this.workPackageIsEditable === true)
      ? this.allowEditWorkPackages = 'close'
      : this.allowEditWorkPackages = 'edit';
  }

  allowEditLayout() {
    this.allowMove = !this.allowMove;
    (this.allowMove === true)
      ? this.allowEditLayouts = 'close'
      : this.allowEditLayouts = 'edit';
  }

  onZoomMap() {
    this.diagramComponent.zoomToFit();
  }

  // FIXME: types
  handleUpdateNodeLocation(data: {node: any, links: any[]}) {

    // Do not update back end if using default layout
    if (this.layout.id === '00000000-0000-0000-0000-000000000000') {
      return;
    }

    if (this.layout && data.node) {
      this.store.dispatch(new UpdateNode({ layoutId: this.layout.id, node: data.node}));
    }
    if (this.layout && data.links && data.links.length > 0) {
      this.store.dispatch(new UpdateLinks({ layoutId: this.layout.id, links: data.links}));
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
    this.dialog.open(DeleteNodeModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        payload: node
      }
    }).beforeClosed().subscribe(action  => {
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
    this.dialog.open(DeleteLinkModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        payload: link
      }
    }).beforeClosed().subscribe(action  => {
      if (action instanceof DeleteWorkpackageLinkSuccess) {
        this.eventEmitter.next(Events.NodesLinksReload);
      }
    });
  }

  subscribeForNodesLinksData() {

    this.nodesSubscription = this.nodeStore.pipe(select(getNodeEntities),
      // Get correct location for nodes, based on selected layout
      map(nodes => {
        const currentFilter = this.filterService.getFilter();
        if (nodes === null) { return null; }
        if (currentFilter && currentFilter.filterLevel === Level.map) { return nodes; }

        let layoutLoc;

        return nodes.map(function (node) {

          if (this.layout && 'id' in this.layout) {
            layoutLoc = node.locations.find(function (loc) {
              return loc.layout && loc.layout.id === this.layout.id;
            }.bind(this));
          }

          return {
            ...node,
            location: layoutLoc ? layoutLoc.locationCoordinates : null,
            locationMissing: !layoutLoc
          };

        }.bind(this));
      })
    ).subscribe(nodes => {
      if (nodes) {
        this.nodes = [...nodes];
      } else {
        this.nodes = [];
      }
      this.ref.detectChanges();
    });


    this.linksSubscription = this.nodeStore.pipe(select(getNodeLinks),
      // Get correct route for links, based on selected layout
      map(links => {
        const currentFilter = this.filterService.getFilter();
        if (links === null) { return null; }
        if (currentFilter && [Level.map, Level.usage].includes(currentFilter.filterLevel)) { return links; }

        let layoutRoute;

        return links.map(function (link) {
          if (this.layout && 'id' in this.layout) {
            layoutRoute = link.routes.find(function (route) {
              return route.layout && route.layout.id === this.layout.id;
            }.bind(this));
          }

          return {
            ...link,
            route: layoutRoute ? layoutRoute.points : [],
            routeMissing: !layoutRoute
          };


        }.bind(this));
      })
    ).subscribe(links => {
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

    dialogRef.afterClosed().subscribe((data) => {
      if (data.mode === 'delete') {
        // this.store.dispatch(new AttributeActions.DeleteAttribute({attributeId: this.selectedNode.id}));
      }
    });
  }

  displayOptionsChanged({event, option}: {event: any, option: string}) {
    this.diagramChangesService.updateDisplayOptions(event, option, this.diagramComponent.diagram);
  }

  onZoomIn() {
    this.diagramComponent.increaseZoom();
  }

  onZoomOut() {
    this.diagramComponent.decreaseZoom();
  }

  onSelectWorkPackage(id) {
    this.workpackageId = id;
    this.workpackageStore.dispatch(new SetWorkpackageSelected({workpackageId: this.workpackageId}));
  }
  // FIXME: set proper type of workpackage
  onSelectEditWorkpackage(workpackage: any) {
    this.workpackageStore.dispatch(new SetWorkpackageEditMode({ id: workpackage.id }));
  }

  onSelectScope(id) {
    this.scopeStore.dispatch(new LoadScope(id));
    this.scopeDetails$ = this.scopeStore.pipe(select(getScopeSelected));
  }

  onSelectLayout(id) {
    this.layoutStore.dispatch(new LoadLayout(id));
  }

  openLeftTab(i: number) {
    this.selectedLeftTab = i;
    if (this.selectedLeftTab === i) {
      this.showOrHideLeftPane = true;
    }
    this.diagramComponent.updateDiagramArea();
  }

  onHideLeftPane() {
    this.showOrHideLeftPane = false;
    this.diagramComponent.updateDiagramArea();
  }

  onAddRelatedRadio() {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.radio) {
        this.radioStore.dispatch(new AddRadioEntity({
          data: {
            title: data.radio.title,
            description: data.radio.description,
            status: data.radio.status,
            category: data.radio.category,
            author: { id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0' },
            target: { id: this.nodeId }
          }
        }));
      }
    });
  }

  onAddAttribute() {
    this.dialog.open(AttributeModalComponent, {width: '450px'});
  }

  openRightTab(i) {
    this.selectedRightTab = i;
    if (this.selectedRightTab === i) {
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
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.radio) {
        this.store.dispatch(new AddRadioEntity({
          data: {
            title: data.radio.title,
            description: data.radio.description,
            status: data.radio.status,
            category: data.radio.category,
            author: { id: '7efe6e4d-0fcf-4fc8-a2f3-1fb430b049b0' }
          }
        }));
      }
    });
  }

  onAddScope() {
    const dialogRef = this.dialog.open(ScopeModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.store.dispatch(new AddScope({
          id: null,
          name: data.scope.name,
          owners: this.sharedService.selectedOwners,
          viewers: this.sharedService.selectedViewers,
          layerFilter: this.filterService.getFilter().filterLevel.toLowerCase(),
          include: this.selectedMultipleNodes
        }));
      }
      this.selectedMultipleNodes = [];
      this.sharedService.selectedOwners = [];
      this.sharedService.selectedViewers = [];
    });
  }

}
