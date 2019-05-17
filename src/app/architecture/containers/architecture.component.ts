import { LoadNodes, LoadNodeLinks } from '@app/nodes/store/actions/node.actions';
import {OnInit, Component, OnDestroy, ViewChild, Input, ChangeDetectionStrategy} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { LinkType, NodeType } from '@app/nodes/services/node.service';
import { linkCategories, NodeLink } from '@app/nodes/store/models/node-link.model';
import {Node, nodeCategories} from '@app/nodes/store/models/node.model';
import { getNodeEntities, getNodeLinks } from '@app/nodes/store/selectors/node.selector';
import { State as NodeState } from '../../nodes/store/reducers/node.reducer';
// import {Attribute} from '?/store/models/attribute.model';
import { ArchitectureDiagramComponent } from '../components/architecture-diagram/architecture-diagram.component';
// import {DeleteNodeSuccess} from '@app/nodes/store/actions/node.actions';
import { DeleteLinkModalComponent } from '../containers/delete-link-modal/delete-link-modal.component';
// import {DeleteLinkSuccess} from '@app/nodes/store/actions/node.actions';
import { DeleteModalComponent } from '../containers/delete-modal/delete-modal.component';
import { DeleteNodeModalComponent } from '../containers/delete-node-modal/delete-node-modal.component';
import { State as ViewState } from '../store/reducers/view.reducer';
import { getViewLevel } from '../store/selectors/view.selector';
import {filter, map} from 'rxjs/operators';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';
import { ObjectDetailsValidatorService } from '../components/object-details-form/services/object-details-form-validator.service';
import { ObjectDetailsService } from '../components/object-details-form/services/object-details-form.service';

@Component({
  selector: 'smi-architecture',
  templateUrl: 'architecture.component.html',
  styleUrls: ['architecture.component.scss'],
  providers: [ObjectDetailsValidatorService, ObjectDetailsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ArchitectureComponent implements OnInit {

  public selectedPart = null;
  nodes$: Observable<Node[]>;
  nodeLinks$: Observable<NodeLink[]>;
  workpackage$: Observable<WorkPackageEntity[]>;
  mapView: boolean;
  viewLevel$: Observable<number>;
  mapViewId$: Observable<string>;
  showTable: boolean;
  showPalette: boolean;
  part: any;
  showGrid: boolean;
  @Input() allowMove: boolean;
  showOrHide: string;
  navigate: string;
  attributeSubscription: Subscription;
  // attributes: Attribute[];
  clickedOnLink = false;
  objectSelected = true;
  isEditable = false;
  @Input() attributesView = false;

  @ViewChild(ArchitectureDiagramComponent)
  private diagramComponent: ArchitectureDiagramComponent;

  constructor(
    private nodeStore: Store<NodeState>,
    private store: Store<ViewState>,
    private workpackageStore: Store<WorkPackageState>,
    private route:  ActivatedRoute,
    private objectDetailsService: ObjectDetailsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
      this.nodeStore.dispatch((new LoadNodes()));
      this.nodeStore.dispatch((new LoadNodeLinks()));

      this.nodes$ = this.nodeStore.pipe(select(getNodeEntities));
      this.nodeLinks$ = this.nodeStore.pipe(select(getNodeLinks));

      // Load Work Packages
      this.workpackageStore.dispatch(new LoadWorkPackages({}));
      this.workpackage$ = this.workpackageStore.pipe(select(getWorkPackageEntities));

      this.viewLevel$ = this.store.pipe(select(getViewLevel));
      this.viewLevel$.subscribe(this.setNodesLinks);

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

  setNodesLinks = (level: number) => {
    if (level !== 5) {
      this.showTable = false;
      this.showPalette = true;
      this.attributesView = false;
    } else {
      this.showTable = true;
      this.showPalette = false;
      this.attributesView = true;
    }

    switch (level) {
      case 1:
        this.nodes$ = this.nodeStore.pipe(select(getNodeEntities),
          map(function(nodes) {return nodes ? nodes.filter(function(node) {return node.layer === 'system'; }) : null; })
        );
        this.nodeLinks$ = this.nodeStore.pipe(select(getNodeLinks),
          map(function(links) {return links ? links.filter(function(link) {return link.layer === 'system'; }) : null; })
        );
        break;
      case 2:
        this.nodes$ = this.nodeStore.pipe(select(getNodeEntities),
          map(function(nodes) {return nodes ? nodes.filter(function(node) {return node.layer === 'data set'; }) : null; })
        );
        this.nodeLinks$ = this.nodeStore.pipe(select(getNodeLinks),
          map(function(links) {return links ? links.filter(function(link) {return link.layer === 'data set'; }) : null; })
        );
        break;
      case 3:
        this.nodes$ = this.nodeStore.pipe(select(getNodeEntities),
          map(function(nodes) {return nodes ? nodes.filter(function(node) {return node.layer === 'dimension'; }) : null; })
        );
        this.nodeLinks$ = this.nodeStore.pipe(select(getNodeLinks),
          map(function(links) {return  links ? links.filter(function(link) {return link.layer === 'dimension'; }) : null; })
        );
        break;
      case 4:
        this.nodes$ = this.nodeStore.pipe(select(getNodeEntities),
          map(function(nodes) {return nodes ? nodes.filter(function(node) {return node.layer === 'reporting concept'; }) : null; })
        );
        this.nodeLinks$ = this.nodeStore.pipe(select(getNodeLinks),
          map(function(links) {return  links ? links.filter(function(link) {return link.layer === 'reporting concept'; }) : null; })
        );
        break;
      case 5:
        // this.nodes$ = this.store.pipe(select(???));
        break;
      case 9:
        /*this.nodes$ = this.store.pipe(select(???));
        this.nodeLinks$ = this.store.pipe(select(???));*/
        break;
      default:
        this.nodes$ = this.nodeStore.pipe(select(getNodeEntities),
          map(function(nodes) {return nodes ? nodes.filter(function(node) {return node.layer === 'system'; }) : null; })
        );
        this.nodeLinks$ = this.nodeStore.pipe(select(getNodeLinks),
          map(function(links) {return links ? links.filter(function(link) {return link.layer === 'system'; }) : null; })
        );
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

    this.part = part;

    // By clicking on link show only name, category and description in the right panel
    this.clickedOnLink = part.category === linkCategories.data || part.category === linkCategories.masterData;

  }

  modelChanged(event: any) {
    // TODO: send to api new model
    console.log('Model: ', event);
  }

  get objectDetailsForm(): FormGroup {
    return this.objectDetailsService.objectDetailsForm;
  }

  onSelectRow(entry) {
    this.selectedPart = entry;
    this.objectSelected = false;
    this.isEditable = false;
    this.objectDetailsService.objectDetailsForm.patchValue({
      id: entry.id,
      name: entry.name,
      category: entry.category,
      owner: entry.owner,
      description: entry.description,
      tags: entry.tags
    });
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
    this.diagramComponent.updatePartData(this.part, data);

  }

  onEditDetails() {
    this.isEditable = true;
  }

  onShowGrid() {
    this.showGrid = !this.showGrid;
    (this.showGrid === true)
      ? this.showOrHide = 'border_clear'
      : this.showOrHide = 'border_inner';
  }

  onNavigateDiagram() {
    this.allowMove = !this.allowMove;
    (this.allowMove === true)
      ? this.navigate = 'edit'
      : this.navigate = 'control_camera';
  }

  onZoomMap() {
    this.diagramComponent.zoomToFit();
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

  onAddAttribute() {
    // this.store.dispatch();
  }

  onAddRule() {
    // this.store.dispatch();
  }

  displayOptionsChanged({event, option}: {event: any, option: string}) {
    this.diagramComponent.updateDisplayOptions(event, option);
  }

  onZoomIn() {
    this.diagramComponent.increaseZoom();
  }

  onZoomOut() {
    this.diagramComponent.decreaseZoom();
  }

}
