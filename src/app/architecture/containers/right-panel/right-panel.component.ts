import {Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {GojsCustomObjectsService} from '@app/architecture/services/gojs-custom-objects.service';

@Component({
  selector: 'smi-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit, OnDestroy {

  private showDetailTabRef;

  @Input() group: FormGroup;
  @Input() clickedOnLink = false;
  @Input() nodeSelected = true;
  @Input() isEditable = false;
  @Input() workPackageIsEditable = false;
  @Input() selectedRightTab: number;
  @Input() attributes: any;
  @Input() radio: any;
  @Input() properties: any;
  @Input() workpackages: any;

  @Output()
  saveAttribute = new EventEmitter();

  @Output()
  deleteAttribute = new EventEmitter();

  @Output()
  editDetails = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Output()
  addRadio = new EventEmitter();

  @Output()
  addAttribute = new EventEmitter();

  @Output()
  hideRightPane = new EventEmitter();


  constructor(
    public gojsCustomObjectsService: GojsCustomObjectsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Observable to capture instruction to switch to the Detail tab from GoJS context menu
    this.showDetailTabRef = this.gojsCustomObjectsService.showDetailTab$.subscribe(function() {
      // change selected tab to the "Details" tab
      this.selectedRightTab = 0;
      this.changeDetectorRef.detectChanges();
    }.bind(this));
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

  onAddRadio() {
    this.addRadio.emit();
  }

  onAddAttribute() {
    this.addAttribute.emit();
  }

}
