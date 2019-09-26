import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GojsCustomObjectsService } from '@app/architecture/services/gojs-custom-objects.service';
import { AttributesEntity, OwnersEntityOrTeamEntityOrApproversEntity } from '@app/architecture/store/models/node-link.model';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit, OnDestroy {
  private showDetailTabRef;

  @Input() owners: OwnersEntityOrTeamEntityOrApproversEntity[];
  @Input() descendants: DescendantsEntity;
  @Input() group: FormGroup;
  @Input() clickedOnLink = false;
  @Input() isEditable = false;
  @Input() workPackageIsEditable = false;
  @Input() selectedRightTab: number;
  @Input() attributes: AttributesEntity[] | null;
  @Input() relatedRadios: any;
  @Input() properties: any;
  @Input() workpackages: any;
  @Input() objectSelected = false;
  @Input() radio: any;
  @Input() multipleSelected = false;
  @Input() selectedOwner: boolean;
  @Input() selectedOwnerIndex: string | null;

  @Output()
  saveAttribute = new EventEmitter();

  @Output()
  deleteAttribute = new EventEmitter();

  @Output()
  editDetails = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Output()
  addRelatedRadio = new EventEmitter();

  @Output()
  addAttribute = new EventEmitter();

  @Output()
  hideRightPane = new EventEmitter();

  @Output()
  addRadio = new EventEmitter();

  @Output()
  addScope = new EventEmitter();

  @Output()
  addOwner = new EventEmitter();

  @Output() selectOwner = new EventEmitter<string>();

  @Output()
  deleteOwner = new EventEmitter();

  @Output()
  editProperties = new EventEmitter();

  @Output() addDescendant = new EventEmitter<void>();

  @Output() deleteDescendant = new EventEmitter<string>();


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

  onSaveAttribute() {
    this.saveAttribute.emit();
  }

  onEditDetails() {
    this.editDetails.emit();
  }

  onDeleteAttribute() {
    this.deleteAttribute.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onHidePane() {
    this.hideRightPane.emit();
  }

  onAddRelatedRadio() {
    this.addRelatedRadio.emit();
  }

  onAddAttribute() {
    this.addAttribute.emit();
  }

  onAddRadio() {
    this.addRadio.emit();
  }

  onAddScope() {
    this.addScope.emit();
  }

  onAddOwner() {
    this.addOwner.emit();
  }

  onSelectOwner(ownerId: string) {
    this.selectOwner.emit(ownerId);
  }

  onDeleteOwner() {
    this.deleteOwner.emit();
  }

  onEditProperties(id: string) {
    this.editProperties.emit(id);
  }

  onAddDescendant() {
    this.addDescendant.emit();
  }

  onDeleteDescendant(id: string) {
    this.deleteDescendant.emit(id);
  }

}
