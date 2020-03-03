import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
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
  DeleteRelated,
  LoadAttributeTags,
  AddAttributeTags,
  DeleteAttributeTags
} from '@app/attributes/store/actions/attributes.actions';
import { getSelectedAttribute, getAttributeAvailableTags } from '@app/attributes/store/selectors/attributes.selector';
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
import { OwnersEntityOrTeamEntityOrApproversEntity, Tag } from '@app/architecture/store/models/node.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-attribute-details',
  templateUrl: './attribute-details.component.html',
  styleUrls: ['./attribute-details.component.scss'],
  providers: [ObjectDetailsService, ObjectDetailsValidatorService]
})
export class AttributeDetailsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public attribute: AttributeDetail;
  public attributeId: string;
  public workpackageId: string;
  public selectedOwner = false;
  public workPackageIsEditable: boolean;
  public selectedRelatedIndex: string | null;
  public selectAttribute = false;
  public relatedAttributeId: string;
  public availableTags$: Observable<Tag[]>;

  constructor(
    private dialog: MatDialog,
    private workPackageStore: Store<WorkPackageState>,
    private route: ActivatedRoute,
    private router: Router,
    private objectDetailsService: ObjectDetailsService,
    private store: Store<AttributeState>
  ) {}

  ngOnInit() {
    this.availableTags$ = this.store.select(getAttributeAvailableTags);
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.attributeId = params['attributeId'];
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
          this.objectDetailsService.updateForm({...attribute});
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

  onSaveAttribute(): void {
    this.store.dispatch(
      new UpdateAttribute({
        workPackageId: this.workpackageId,
        attributeId: this.attributeId,
        entity: {
          data: {
            id: this.attributeId, ...this.objectDetailsForm.value
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
        this.router.navigate(['attributes-and-rules'], { queryParamsHandling: 'preserve' });
      }
    });
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

  onDeleteOwner(owner: OwnersEntityOrTeamEntityOrApproversEntity): void {
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
            ownerId: owner.id
          })
        );
      }
    });
  }

  onSaveProperties(data: { propertyId: string, value: string }): void {
    this.store.dispatch(
      new UpdateProperty({
        workPackageId: this.workpackageId,
        attributeId: this.attributeId,
        customPropertyId: data.propertyId,
        data: data.value
      })
    );
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
        this.store.dispatch(
          new DeleteProperty({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            customPropertyId: property.propertyId
          })
        );
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

  onUpdateAvailableTags(): void {
    this.store
      .pipe(
        select(getAttributeAvailableTags),
        take(1)
      )
      .subscribe(tags => {
        if (!this.workpackageId) {
          return;
        }
        this.store.dispatch(
          new LoadAttributeTags({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId
          })
        );
      });
  }

  onAddTag(tagId: string): void {
    this.store.dispatch(
      new AddAttributeTags({
        workPackageId: this.workpackageId,
        attributeId: this.attributeId,
        tagIds: [{ id: tagId }]
      })
    )
  }

  onRemoveTag(tag: Tag): void {
    this.store.dispatch(
      new DeleteAttributeTags({
        workPackageId: this.workpackageId,
        attributeId: this.attributeId,
        tagId: tag.id
      })
    )
  }
}
