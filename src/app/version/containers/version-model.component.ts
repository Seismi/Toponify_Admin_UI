import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ObjectDetailsValidatorService } from '../components/object-details-form/services/object-details-form-validator.service';
import { ObjectDetailsService } from '../components/object-details-form/services/object-details-form.service';
import { NodeType } from '../services/diagram-node.service';
import * as AttributeActions from '../store/actions/attribute.actions';
import * as DimensionLinkActions from '../store/actions/dimension-link.actions';
import * as DimensionActions from '../store/actions/dimension.actions';
import * as ElementLinkActions from '../store/actions/element-link.actions';
import * as ElementActions from '../store/actions/element.actions';
import { LoadMapView } from '../store/actions/mapview.actions';
import * as ModelLinkActions from '../store/actions/model-link.actions';
import * as ModelActions from '../store/actions/model.actions';
import * as VersionSystemLinkActions from '../store/actions/system-link.actions';
import * as VersionSystemActions from '../store/actions/version-system.actions';
import { RefetchVersionData } from '../store/actions/version.actions';
import { Attribute } from '../store/models/attribute.model';
import * as fromVersion from '../store/reducers';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { DeleteNodeModalComponent } from './delete-node-modal/delete-node-modal.component';
import { VersionDiagramComponent } from '../components/version-diagram/version-diagram.component';
import { DeleteLinkModalComponent } from './delete-link-modal/delete-link-modal.component';
import { LinkType } from '../services/diagram-link.service';
import { System } from '../store/models/system.model';
import { DeleteNodeSuccess } from '../store/actions/node.actions';
import { DeleteLinkSuccess } from '../store/actions/link.actions';

@Component({
  selector: 'app-version-moddel',
  templateUrl: 'version-model.component.html',
  styleUrls: ['version-model.component.scss'],
  providers: [ObjectDetailsValidatorService, ObjectDetailsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionModelComponent implements OnInit, OnDestroy {

  public selectedNode = null;
  public links$: Observable<any>;
  public nodes$: Observable<any>;
  versionId: string;
  mapView: boolean;
  versionId$: Subscription;
  viewLevel$: Observable<number>;
  mapViewId$: Observable<string>;
  showTable: boolean;
  showPalette: boolean;
  node: any;
  showGrid: boolean;
  @Input() allowMove: boolean;
  showOrHide: string;
  navigate: string;
  attributeSubscription: Subscription;
  attributes: Attribute[];
  clickedOnLink = false;
  objectSelected = true;
  isEditable = false;
  @Input() attributesView = false;

  @ViewChild(VersionDiagramComponent)
  private diagramComponent: VersionDiagramComponent;

  constructor(
    private store: Store<fromVersion.State>,
    private route:  ActivatedRoute,
    private objectDetailsService: ObjectDetailsService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.versionId$ = this.route.params.subscribe((params) => {
      this.versionId = params['id'];
      if (this.versionId) {
        this.store.dispatch(new RefetchVersionData({versionId: this.versionId}));

        this.viewLevel$ = this.store.pipe(select(fromVersion.getViewLevel));
        this.viewLevel$.subscribe(this.setNodesLinks);

        this.mapViewId$ = this.store.pipe(select(fromVersion.getMapViewId));
        this.mapViewId$.subscribe(linkId => {
          if (linkId) {
            const payload = { versionId: this.versionId, linkId: linkId};
            this.store.dispatch(new LoadMapView(payload));
          }
          this.mapView = Boolean(linkId);
        });
        this.attributeSubscription = this.store.pipe(select(fromVersion.getAttributes)).subscribe((data) => {
          this.attributes = data.attributes;
        });
      }
    });
  }

  ngOnDestroy() {
    this.versionId$.unsubscribe();
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
        this.nodes$ = this.store.pipe(select(fromVersion.getSystem));
        this.links$ = this.store.pipe(select(fromVersion.getSystemLinks));
        break;
      case 2:
        this.nodes$ = this.store.pipe(select(fromVersion.getModels));
        this.links$ = this.store.pipe(select(fromVersion.getModelLinks));
        break;
      case 3:
        this.nodes$ = this.store.pipe(select(fromVersion.getDimensions));
        this.links$ = this.store.pipe(select(fromVersion.getDimensionLinks));
        break;
      case 4:
        this.nodes$ = this.store.pipe(select(fromVersion.getElements));
        this.links$ = this.store.pipe(select(fromVersion.getElementLinks));
        break;
      case 5:
        this.nodes$ = this.store.pipe(select(fromVersion.getAttributes));
        break;
      case 9:
        this.nodes$ = this.store.pipe(select(fromVersion.getMapViewNodes));
        this.links$ = this.store.pipe(select(fromVersion.getMapViewLinks));
        break;
      default:
        this.nodes$ = this.store.pipe(select(fromVersion.getSystem));
        this.links$ = this.store.pipe(select(fromVersion.getSystemLinks));
    }
  }

  nodeSelected(node: any) {
    if (node && node.data) {
      this.selectedNode = node.data;
    } else {
      this.selectedNode = '';
      this.clickedOnLink = false;
    }

    // Enable "Edit" and "Delete" buttons then GoJS object is selected
    this.objectSelected = false;
    this.isEditable = false;

    this.objectDetailsService.objectDetailsForm.patchValue({
      id: this.selectedNode.id,
      name: this.selectedNode.name,
      category: this.selectedNode.category,
      owner: this.selectedNode.owner,
      description: this.selectedNode.description,
      tags: this.selectedNode.tags,
    });

    this.node = node;

    // By clicking on link show only name, category and description in the right panel
    if (node.category === 'data' || node.category === 'masterdata') {
      this.clickedOnLink = true;
    } else {
      this.clickedOnLink = false;
    }

  }

  modelChanged(event: any) {
    // TODO: send to api new model
    console.log('Model: ', event);
  }

  get categoryTableData() {
    return this.attributes;
  }

  get objectDetailsForm(): FormGroup {
    return this.objectDetailsService.objectDetailsForm;
  }

  onSelectRow(entry) {
    this.selectedNode = entry;
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
      id:  this.selectedNode.id,
      category: this.selectedNode.category,
      name: this.objectDetailsForm.value.name,
      owner: this.objectDetailsForm.value.owner,
      description: this.objectDetailsForm.value.description,
      tags: this.objectDetailsForm.value.tags
    };

    const dataLink = {
      id: this.selectedNode.id,
      category: this.selectedNode.category,
      name: this.objectDetailsForm.value.name,
      description: this.objectDetailsForm.value.description
    };

    // System
    this.store.dispatch(new VersionSystemActions.UpdateVersionSystem({
      versionId: this.versionId, system: { data: { ...data }}}));
    // System Link
    this.store.dispatch(new VersionSystemLinkActions.UpdateSystemLinks([{
      versionId: this.versionId, systemLink: { data: { ...dataLink }}}]));

    // Model
    this.store.dispatch(new ModelActions.UpdateModel({
      versionId: this.versionId, model: { data: { ...data }}}));
    // Model Link
    this.store.dispatch(new ModelLinkActions.UpdateModelLink([{
      versionId: this.versionId, modelLink: { data: { ...dataLink }}}]));

    // Dimension
    this.store.dispatch(new DimensionActions.UpdateDimension({
      versionId: this.versionId, dimension: {data: {...data}}}));
    // Dimension Link
    this.store.dispatch(new DimensionLinkActions.UpdateDimensionLink([{
      versionId: this.versionId, dimensionLink: { data: { ...dataLink }}}]));

    // Element
    this.store.dispatch(new ElementActions.UpdateElement({
      versionId: this.versionId, element: { data: { ...data }}}));
    // Element Link
    this.store.dispatch(new ElementLinkActions.UpdateElementLink([{
      versionId: this.versionId, elementLink: { data: { ...dataLink }}}]));

    // Attributes
    this.store.dispatch(new AttributeActions.UpdateAttribute({
      versionId: this.versionId, attribute: { data: { ...data }}}));

    // Update the diagram to reflect changed properties
    this.diagramComponent.updatePartData(this.node, data);

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
        payload: {versionId: this.versionId, nodeId: node.id, nodeType: type}
      }
    }).beforeClosed().subscribe(action  => {
      if (action instanceof DeleteNodeSuccess) {
        this.store.dispatch(new RefetchVersionData({versionId: this.versionId}));
      }
    });
  }

  handleLinkDeleteRequested(data: {link: any, type: LinkType}) {
    const {link, type} = data;
    this.dialog.open(DeleteLinkModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        payload: {versionId: this.versionId, linkId: link.id, linkType: type}
      }
    }).beforeClosed().subscribe(action  => {
      if (action instanceof DeleteLinkSuccess) {
        this.store.dispatch(new RefetchVersionData({versionId: this.versionId}));
      }
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
        this.store.dispatch(new AttributeActions.DeleteAttribute({versionId: this.versionId, attributeId: this.selectedNode.id}));
      }
    });
  }

  onAddAttribute() {
    this.store.dispatch(new AttributeActions.AddAttribute({
      versionId: this.versionId,
      attribute: {
        data: {
          name: 'New Attribute',
          category: 'attribute',
          scope: 'global'
        }
      }
    }));
  }

  onAddRule() {
    this.store.dispatch(new AttributeActions.AddAttribute({
      versionId: this.versionId,
      attribute: {
        data: {
          name: 'New Rule',
          category: 'rule',
          scope: 'global'
        }
      }
    }));
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
