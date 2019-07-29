import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';
import { LoadLayout, LoadLayouts } from '@app/layout/store/actions/layout.actions';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import { getLayoutSelected } from '@app/layout/store/selectors/layout.selector';
import { LinkType, NodeType } from '@app/architecture/services/node.service';
import { LoadMapView, LoadNode, LoadNodeLinks, LoadNodes, UpdateLinks, UpdateNode } from '@app/architecture/store/actions/node.actions';
import { linkCategories } from '@app/architecture/store/models/node-link.model';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { getNodeEntities, getNodeLinks, getSelectedNode } from '@app/architecture/store/selectors/node.selector';
import { RadioModalComponent } from '@app/radio/containers/radio-modal/radio-modal.component';
import { AddRadioEntity } from '@app/radio/store/actions/radio.actions';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { LoadScope, LoadScopes } from '@app/scope/store/actions/scope.actions';
import { ScopeDetails, ScopeEntity } from '@app/scope/store/models/scope.model';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { getScopeEntities, getScopeSelected } from '@app/scope/store/selectors/scope.selector';
import { LoadWorkPackage, LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageDetail, WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkPackage, getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { State as NodeState } from '../store/reducers/architecture.reducer';
// import {Attribute} from '?/store/models/attribute.model';
import { ArchitectureDiagramComponent } from '../components/architecture-diagram/architecture-diagram.component';
import { ObjectDetailsValidatorService } from '../components/object-details-form/services/object-details-form-validator.service';
import { ObjectDetailsService } from '../components/object-details-form/services/object-details-form.service';
import { DeleteLinkModalComponent } from '../containers/delete-link-modal/delete-link-modal.component';
import { DeleteModalComponent } from '../containers/delete-modal/delete-modal.component';
import { DeleteNodeModalComponent } from '../containers/delete-node-modal/delete-node-modal.component';
import { Level } from '../services/diagram-level.service';
import { FilterService } from '../services/filter.service';
import { State as ViewState } from '../store/reducers/architecture.reducer';
import { getViewLevel } from '../store/selectors/view.selector';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { AttributeModalComponent } from '@app/attributes/containers/attribute-modal/attribute-modal.component';



@Component({
  selector: 'smi-architecture',
  templateUrl: 'architecture.component.html',
  styleUrls: ['architecture.component.scss'],
  providers: [ObjectDetailsValidatorService, ObjectDetailsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ArchitectureComponent implements OnInit, OnDestroy {

  @Input() attributesView = false;
  @Input() allowMove: boolean;
  public selectedPart = null;

  showOrHideLeftPane = false;

  nodesSubscription: Subscription;
  linksSubscription: Subscription;

  selectedNode: NodeDetail;

  links: any[] = [];
  nodes: any[] = [];

  workpackage$: Observable<WorkPackageEntity[]>;
  nodeDetail$: Observable<NodeDetail>;
  scopes$: Observable<ScopeEntity[]>;
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
  objectSelected = true;
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
  showOrHideRightPane = false;
  selectedRightTab: number;
  selectedLeftTab: number;

  @ViewChild(ArchitectureDiagramComponent)
  private diagramComponent: ArchitectureDiagramComponent;
  @ViewChild(LeftPanelComponent)
  private leftPanelComponent: LeftPanelComponent;

  constructor(
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
    private ref: ChangeDetectorRef
  ) {
    // If filterLevel not set, ensure to set it.
    const filter = this.filterService.getFilter();
    if (!filter || !filter.filterLevel) {
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

    // View Level
    this.viewLevel$ = this.store.pipe(select(getViewLevel));

    this.filterServiceSubscription = this.filterService.filter.subscribe((item: any) => {
      if (item) {
        const { filterLevel, id } = item;
        if (filterLevel) {
          this.setNodesLinks(filterLevel, id);
        }
      }
    });

    this.layoutStoreSubscription = this.layoutStore.pipe(select(getLayoutSelected)).subscribe(layout => {
      this.layout = layout;
      if (layout) {
        this.subscribeForNodesLinksData();
      }
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
  }

  setNodesLinks(layer: string, id?: string) {

    if (layer !== Level.attribute) {
      this.attributesView = false;
    } else {
      this.attributesView = true;
    }

    if (layer === Level.map) {
      this.nodeStore.dispatch(new LoadMapView(id));
    } else {
      this.nodeStore.dispatch(new LoadNodes());
      this.nodeStore.dispatch(new LoadNodeLinks());
    }
  }

  partSelected(part: any) {
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

    // By clicking on link show only name, category and description in the right panel
    this.clickedOnLink = part.category === linkCategories.data || part.category === linkCategories.masterData;
    // Load Node Details
    this.nodeStore.dispatch((new LoadNode(this.nodeId)));
    this.nodeStore.pipe(select(getSelectedNode)).subscribe(nodeDetail => {
      this.selectedNode = nodeDetail;
    });
  }

  modelChanged(event: any) {
    // TODO: send to api new model
    console.log('Model: ', event);
  }

  get objectDetailsForm(): FormGroup {
    return this.objectDetailsService.objectDetailsForm;
  }


  // Not sure but probably there is a better way of doing this
  onSaveObjectDetails() {

    const data = {
      id:  this.selectedPart.id,
      category: this.selectedPart.category,
      name: this.objectDetailsForm.value.name,
      owner: this.objectDetailsForm.value.owner,
      description: this.objectDetailsForm.value.description,
      tags: this.objectDetailsForm.value.tags
    };

    const dataLink = {
      id: this.selectedPart.id,
      category: this.selectedPart.category,
      name: this.objectDetailsForm.value.name,
      description: this.objectDetailsForm.value.description
    };

    // Node
    // this.store.dispatch();
    // Node Link
    // this.store.dispatch();

    // Update the diagram to reflect changed properties
    this.diagramChangesService.updatePartData(this.part, data);

  }

  onEditDetails() {
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
    if (!('id' in this.layout)) {
      return;
    }

    if (this.layout && data.node) {
      this.store.dispatch(new UpdateNode({ layoutId: this.layout.id, node: data.node}));
    }
    if (this.layout && data.links && data.links.length > 0) {
      this.store.dispatch(new UpdateLinks({ layoutId: this.layout.id, links: data.links}));
    }
  }

  handleNodeDeleteRequested(data: {node: any, type: NodeType}) {
    const {node, type} = data;
    this.dialog.open(DeleteNodeModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        payload: {nodeId: node.id, nodeType: type}
      }
    }).beforeClosed().subscribe(action  => {
      /*if (action instanceof DeleteNodeSuccess) {
        this.store.dispatch();
      }*/
    });
  }

  handleLinkDeleteRequested(data: {link: any, type: LinkType}) {
    const {link, type} = data;
    this.dialog.open(DeleteLinkModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        payload: {linkId: link.id, linkType: type}
      }
    }).beforeClosed().subscribe(action  => {
      /* if (action instanceof DeleteLinkSuccess) {
        // this.store.dispatch();
      }*/
    });
  }

  subscribeForNodesLinksData() {

    this.nodesSubscription = this.nodeStore.pipe(select(getNodeEntities),
      // Get correct location for nodes, based on selected layout
      map(nodes => {
        const filter = this.filterService.getFilter();
        if (nodes === null) { return null; }
        if (filter && filter.filterLevel === Level.map) { return nodes; }

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
        const filter = this.filterService.getFilter();
        if (links === null) { return null; }
        if (filter && filter.filterLevel === Level.map) { return links; }

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
    this.workpackageStore.dispatch(new LoadWorkPackage(this.workpackageId));
    this.workpackageStore.pipe(select(getSelectedWorkPackage));
  }

  selectColorForWorkPackage(color, id) {
    console.log(color, id);
  }

  onSelectScope(id) {
    this.scopeStore.dispatch(new LoadScope(id));
    this.scopeDetails$ = this.scopeStore.pipe(select(getScopeSelected));
  }

  onSelectLayout(id) {
    this.layoutStore.dispatch(new LoadLayout(id));

    const currentLevel = this.filterService.getFilter().filterLevel;

    // Reload nodes and links for new layout if not in map view
    if (currentLevel !== Level.map) {
      this.nodeStore.dispatch(new LoadNodes);
      this.nodeStore.dispatch(new LoadNodeLinks);
    }
  }

  onHideLeftPane() {
    this.showOrHideLeftPane = false;
  }

  onOpenWorkPackageTab() {
    this.showOrHideLeftPane = true;
    this.selectedLeftTab = 0;
  }

  onOpenAnalysisTab() {
    this.showOrHideLeftPane = true;
    this.selectedLeftTab = 2;
  }

  onOpenEditTab() {
    this.showOrHideLeftPane = true;
    this.selectedLeftTab = 1;
  }

  onAddRadio() {
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
    if(this.selectedRightTab === i) {
      this.showOrHideRightPane = true;
    }
  }

  onHideRightPane() {
    this.showOrHideRightPane = false;
  }
}

