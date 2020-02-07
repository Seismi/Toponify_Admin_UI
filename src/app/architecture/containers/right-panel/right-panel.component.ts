import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AttributesEntity, NodeLink, OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';
import { CustomPropertyValuesEntity, DescendantsEntity, Node, NodeReports } from '@app/architecture/store/models/node.model';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { WorkPackageNodeScopes } from '@app/workpackage/store/models/workpackage.models';
import { ArchitectureView } from '@app/architecture/components/switch-view-tabs/architecture-view.model';
import { Level } from '@app/architecture/services/diagram-level.service';
import { GojsCustomObjectsService } from '@app/architecture/services/gojs-custom-objects.service';

@Component({
  selector: 'smi-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent {
  private showDetailTabRef;
  
  @Input() nodeCategory: string;
  @Input() owners: OwnersEntityOrTeamEntityOrApproversEntity[];
  @Input() selectedView: ArchitectureView;
  @Input() nodes: Node[];
  @Input() links: NodeLink[];
  @Input() selectedNode: Node;
  @Input() descendants: DescendantsEntity[];
  @Input() group: FormGroup;
  @Input() clickedOnLink = false;
  @Input() workPackageIsEditable = false;
  @Input() selectedRightTab: number;
  @Input() attributes: AttributesEntity[] | null;
  @Input() relatedRadios: any;
  @Input() properties: CustomPropertyValuesEntity;
  @Input() workpackages: any;
  @Input() radio: any;
  @Input() multipleSelected: boolean;
  @Input() nodeScopes: WorkPackageNodeScopes[];
  @Input() viewLevel: Level;
  @Input() part: go.Part;
  @Input() filterLevel: string;
  @Input() nodeReports: NodeReports[];

  @Output() saveNode = new EventEmitter<void>();
  @Output() deleteNode = new EventEmitter<void>();
  @Output() addRelatedRadio = new EventEmitter<void>();
  @Output() addAttribute = new EventEmitter();
  @Output() deleteAttribute = new EventEmitter<AttributesEntity>();
  @Output() hideRightPane = new EventEmitter<void>();
  @Output() addRadio = new EventEmitter<void>();
  @Output() addScope = new EventEmitter<void>();
  @Output() addOwner = new EventEmitter<void>();
  @Output() deleteOwner = new EventEmitter<OwnersEntityOrTeamEntityOrApproversEntity>();
  @Output() saveProperties = new EventEmitter<Object>();
  @Output() deleteProperties = new EventEmitter<CustomPropertyValuesEntity>();
  @Output() addDescendant = new EventEmitter<void>();
  @Output() deleteDescendant = new EventEmitter<DescendantsEntity>();
  @Output() openRadio = new EventEmitter<RadioDetail>();
  @Output() deleteScope = new EventEmitter<WorkPackageNodeScopes>();
  @Output() addExistingScope = new EventEmitter<void>();
  @Output() addNewScope = new EventEmitter<void>();
  @Output() selectNode = new EventEmitter<Node | NodeLink>();
  @Output() assignRadio = new EventEmitter<void>();
  @Output() addExistingAttribute = new EventEmitter<void>();

  constructor(
    public gojsCustomObjectsService: GojsCustomObjectsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Observable to capture instruction to switch to the Detail tab from GoJS context menu
    this.showDetailTabRef = this.gojsCustomObjectsService.showDetailTab$.subscribe(
      function() {
        // change selected tab to the "Details" tab
        this.selectedRightTab = 0;
        this.changeDetectorRef.detectChanges();
      }.bind(this)
    );
  }

  ngOnDestroy() {
    this.showDetailTabRef.unsubscribe();
  }

  onSaveNode(): void {
    this.saveNode.emit();
  }

  onDeleteNode(): void {
    this.deleteNode.emit();
  }

  onHidePane(): void {
    this.hideRightPane.emit();
  }

  onAddRelatedRadio(): void {
    this.addRelatedRadio.emit();
  }

  onAddAttribute(): void {
    this.addAttribute.emit();
  }

  onDeleteAttribute(attribute: AttributesEntity): void {
    this.deleteAttribute.emit(attribute);
  }

  onAddRadio(): void {
    this.addRadio.emit();
  }

  onAddScope(): void {
    this.addScope.emit();
  }

  onAddOwner(): void {
    this.addOwner.emit();
  }

  onDeleteOwner(owner: OwnersEntityOrTeamEntityOrApproversEntity): void {
    this.deleteOwner.emit(owner);
  }

  onSaveProperty(documentStandard: Object): void {
    this.saveProperties.emit(documentStandard);
  }

  onDeleteProperty(customProperty: CustomPropertyValuesEntity): void {
    this.deleteProperties.emit(customProperty);
  }

  onAddDescendant(): void {
    this.addDescendant.emit();
  }

  onDeleteDescendant(descendant: DescendantsEntity): void {
    this.deleteDescendant.emit(descendant);
  }

  onOpenRadio(radio: RadioDetail): void {
    this.openRadio.emit(radio);
  }

  onDeleteScope(scope: WorkPackageNodeScopes): void {
    this.deleteScope.emit(scope);
  }

  onAddExistingScope(): void {
    this.addExistingScope.emit();
  }

  onAddNewScope(): void {
    this.addNewScope.emit();
  }

  onAssignRadio(): void {
    this.assignRadio.emit();
  }

  onAddExistingAttribute(): void {
    this.addExistingAttribute.emit();
  }

  isFirst(): boolean {
    if (!this.selectedNode) {
      return true;
    }
    if (this.selectedView === ArchitectureView.System) {
      return this.nodes[0].id === this.selectedNode.id;
    } else {
      return this.links[0].id === this.selectedNode.id;
    }
  }

  isLast(): boolean {
    if (!this.selectedNode) {
      return false;
    }
    if (this.selectedView === ArchitectureView.System) {
      return this.nodes[this.nodes.length - 1].id === this.selectedNode.id;
    } else {
      return this.links[this.links.length - 1].id === this.selectedNode.id;
    }
  }

  next(): void {
    const list = this.selectedView === ArchitectureView.System ? this.nodes : this.links;
    if (!this.selectedNode) {
      this.selectNode.emit(list[0]);
    } else {
      const currentIndex = (list as any).findIndex(item => item.id === this.selectedNode.id);
      if (currentIndex < list.length) {
        this.selectNode.emit(list[currentIndex + 1]);
      } else {
        this.selectNode.emit(list[list.length - 1]);
      }
    }
  }

  previous(): void {
    const list = this.selectedView === ArchitectureView.System ? this.nodes : this.links;
    const currentIndex = (list as any).findIndex(item => item.id === this.selectedNode.id);
    if (currentIndex > 0) {
      this.selectNode.emit(list[currentIndex - 1]);
    } else {
      this.selectNode.emit(list[0]);
    }
  }

  showSkipButtons(): boolean {
    return this.selectedView !== ArchitectureView.Diagram;
  }
}
