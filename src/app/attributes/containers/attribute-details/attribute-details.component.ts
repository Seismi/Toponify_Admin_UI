import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ObjectDetailsService } from '@app/architecture/components/object-details-form/services/object-details-form.service';
import { ObjectDetailsValidatorService } from '@app/architecture/components/object-details-form/services/object-details-form-validator.service';
import { Store, select } from '@ngrx/store';
import { State as AttributeState } from '@app/attributes/store/reducers/attributes.reducer';
import {
  LoadAttribute,
  UpdateAttribute,
  DeleteAttribute,
  AddOwner,
  DeleteOwner,
  UpdateProperty,
  DeleteProperty,
  AddRelated,
  DeleteRelated
} from '@app/attributes/store/actions/attributes.actions';
import { getSelectedAttribute } from '@app/attributes/store/selectors/attributes.selector';
import { AttributeDetail } from '@app/attributes/store/models/attributes.model';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkpackages, getEditWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { MatDialog } from '@angular/material';
import { OwnersModalComponent } from '@app/workpackage/containers/owners-modal/owners-modal.component';
import { DeleteModalComponent } from '@app/architecture/containers/delete-modal/delete-modal.component';
import { DeleteWorkPackageModalComponent } from '@app/workpackage/containers/delete-workpackage-modal/delete-workpackage.component';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';
import { DocumentModalComponent } from '@app/documentation-standards/containers/document-modal/document-modal.component';
import { DeleteRadioPropertyModalComponent } from '@app/radio/containers/delete-property-modal/delete-property-modal.component';
import { RelatedAttributesModalComponent } from '../related-attributes-modal/related-attributes-modal.component';

@Component({
  selector: 'app-attribute-details',
  templateUrl: './attribute-details.component.html',
  styleUrls: ['./attribute-details.component.scss'],
  providers: [ObjectDetailsService, ObjectDetailsValidatorService]
})
export class AttributeDetailsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public attribute: AttributeDetail;
  public isEditable: boolean = false;
  public showOrHideRightPane = false;
  public selectedRightTab: number;
  public attributeId: string;
  public workpackageId: string;
  public selectedOwnerIndex: string | null;
  public selectedOwner: boolean = false;
  public workPackageIsEditable: boolean;
  public selectedRelatedIndex: string | null;
  public selectAttribute: boolean = false;
  public relatedAttributeId: string;

  constructor(
    private dialog: MatDialog,
    private workPackageStore: Store<WorkPackageState>,
    private route: ActivatedRoute,
    private router: Router,
    private objectDetailsService: ObjectDetailsService,
    private store: Store<AttributeState>
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const id = params['attributeId'];
        this.attributeId = id;
        this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
          const workPackageIds = workpackages.map(item => item.id);
          this.workpackageId = workPackageIds[0];
          this.setWorkPackage(workPackageIds);
        });
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getSelectedAttribute)).subscribe(attribute => {
        this.attribute = attribute;
        if (attribute) {
          this.objectDetailsService.updateForm({
            name: attribute.name,
            category: attribute.category,
            description: attribute.description,
            tags: attribute.tags
          });
          this.isEditable = false;
        }
      })
    );

    this.subscriptions.push(
      this.workPackageStore.pipe(select(getEditWorkpackages)).subscribe(workpackages => {
        const edit = workpackages.map(item => item.edit);
        edit.length ? (this.workPackageIsEditable = true) : (this.workPackageIsEditable = false);
      })
    );
  }

  setWorkPackage(workpackageIds: string[] = []): void {
    const queryParams = {
      workPackageQuery: workpackageIds
    };
    this.store.dispatch(new LoadAttribute({ id: this.attributeId, queryParams: queryParams }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get objectDetailsForm(): FormGroup {
    return this.objectDetailsService.objectDetailsForm;
  }

  openRightTab(index: number): void {
    this.selectedRightTab = index;
    if (this.selectedRightTab === index) {
      this.showOrHideRightPane = false;
    }
  }

  onHideRightPane(): void {
    this.showOrHideRightPane = true;
  }

  onEditDetails(): void {
    this.isEditable = true;
  }

  onCancelEdit(): void {
    this.isEditable = false;
    this.selectedOwner = false;
    this.selectedOwnerIndex = null;
    this.selectAttribute = false;
    this.selectedRelatedIndex = null;
  }

  onSaveAttribute(): void {
    this.isEditable = false;
    this.selectedOwner = false;
    this.selectedOwnerIndex = null;
    this.selectAttribute = false;
    this.selectedRelatedIndex = null;

    this.store.dispatch(
      new UpdateAttribute({
        workPackageId: this.workpackageId,
        attributeId: this.attributeId,
        entity: {
          data: {
            id: this.attributeId,
            name: this.objectDetailsForm.value.name,
            description: this.objectDetailsForm.value.description,
            tags: this.objectDetailsForm.value.tags,
            category: this.attribute.category
          }
        }
      })
    );
  }

  onDeleteAttribute(): void {
    const dialogRef = this.dialog.open(DeleteWorkPackageModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: this.attribute.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(new DeleteAttribute({ workPackageId: this.workpackageId, attributeId: this.attributeId }));
        this.router.navigate(['attributes-and-rules']);
      }
    });
  }

  onSelectOwner(ownerId: string): void {
    this.selectedOwnerIndex = ownerId;
    this.selectedOwner = true;
  }

  onAddOwner(): void {
    const dialogRef = this.dialog.open(OwnersModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.owner) {
        this.store.dispatch(
          new AddOwner({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            ownerId: data.owner.id,
            entity: data.owner
          })
        );
      }
    });
  }

  onDeleteOwner(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(
          new DeleteOwner({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            ownerId: this.selectedOwnerIndex
          })
        );
        this.selectedOwner = false;
      }
    });
  }

  onEditProperty(property: CustomPropertiesEntity): void {
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        mode: 'edit',
        customProperties: property,
        name: property.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.customProperties) {
        this.store.dispatch(
          new UpdateProperty({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            customPropertyId: property.propertyId,
            entity: { data: { value: data.customProperties.value } }
          })
        );
      }
    });
  }

  onDeleteProperty(property: CustomPropertiesEntity): void {
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
        this.store.dispatch(
          new DeleteProperty({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            customPropertyId: property.propertyId
          })
        );
        this.selectAttribute = false;
      }
    });
  }

  onSelectRelatedAttribute(relatedAttributeId: string): void {
    this.relatedAttributeId = relatedAttributeId;
    this.selectedRelatedIndex = relatedAttributeId;
    this.selectAttribute = true;
  }

  onAddRelatedAttribute(): void {
    const dialogRef = this.dialog.open(RelatedAttributesModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.attribute) {
        this.store.dispatch(
          new AddRelated({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            relatedAttributeId: data.attribute.id
          })
        );
      }
    });
  }

  onDeleteRelatedAttribute(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.store.dispatch(
          new DeleteRelated({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            relatedAttributeId: this.relatedAttributeId
          })
        );
      }
      this.selectAttribute = false;
    });
  }
}
