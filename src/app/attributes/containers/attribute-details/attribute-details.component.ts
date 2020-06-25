import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State as AttributeState } from '@app/attributes/store/reducers/attributes.reducer';
import {
  LoadAttribute,
  UpdateAttribute,
  DeleteAttribute,
  UpdateProperty,
  DeleteProperty,
  AddRelated,
  DeleteRelated,
  LoadAttributeTags,
  AddAttributeTags,
  DeleteAttributeTags,
  AddAttributeRadio
} from '@app/attributes/store/actions/attributes.actions';
import { getSelectedAttribute, getAttributeAvailableTags, getAttributeEntities } from '@app/attributes/store/selectors/attributes.selector';
import { AttributeDetail } from '@app/attributes/store/models/attributes.model';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getSelectedWorkpackages, getEditWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { MatDialog } from '@angular/material';
import { currentArchitecturePackageId, CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';
import { Tag } from '@app/architecture/store/models/node.model';
import { take } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { RadioModalComponent } from '@app/radio/containers/radio-modal/radio-modal.component';
import { AddRadioEntity, RadioActionTypes } from '@app/radio/store/actions/radio.actions';
import { RadioListModalComponent } from '@app/workpackage/containers/radio-list-modal/radio-list-modal.component';
import { AttributeDetailsFormService } from '@app/attributes/components/attribute-details-form/services/attribute-details-form.service';
import { AttributeDetailsFormValidationService } from '@app/attributes/components/attribute-details-form/services/attribute-details-form-validator.service';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';
import { SelectModalComponent } from '@app/core/layout/components/select-modal/select-modal.component';

@Component({
  selector: 'app-attribute-details',
  templateUrl: './attribute-details.component.html',
  styleUrls: ['./attribute-details.component.scss'],
  providers: [AttributeDetailsFormService, AttributeDetailsFormValidationService]
})
export class AttributeDetailsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public attribute: AttributeDetail;
  public attributeId: string;
  public workpackageId: string;
  public workPackageIsEditable: boolean;
  public availableTags$: Observable<Tag[]>;

  constructor(
    private attributeDetailsFormService: AttributeDetailsFormService,
    private actions: Actions,
    private dialog: MatDialog,
    private workPackageStore: Store<WorkPackageState>,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AttributeState>
  ) {}

  ngOnInit() {
    this.availableTags$ = this.store.select(getAttributeAvailableTags);
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.attributeId = params['attributeId'];
        this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
          const workPackageIds = workpackages.map(item => item.id);
          this.setWorkPackage(workPackageIds);
        });
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getSelectedAttribute)).subscribe(attribute => {
        this.attribute = attribute;
        if (attribute) {
          this.attributeDetailsFormService.updateForm({...attribute});
        }
      })
    );

    this.subscriptions.push(
      this.workPackageStore.pipe(select(getEditWorkpackages)).subscribe(workpackages => {
        const edit = workpackages.map(item => item.edit);
        const workPackageId = workpackages.map(item => item.id);
        this.workpackageId = workPackageId[0];
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

  get attributeDetailsForm(): FormGroup {
    return this.attributeDetailsFormService.attributeDetailsForm;
  }

  onSaveAttribute(): void {
    this.store.dispatch(
      new UpdateAttribute({
        workPackageId: this.workpackageId,
        attributeId: this.attributeId,
        entity: {
          data: {
            id: this.attributeId, ...this.attributeDetailsForm.value
          }
        }
      })
    );
  }

  onDeleteAttribute(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: `Are you sure you want to delete "${this.attribute.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new DeleteAttribute({ workPackageId: this.workpackageId, attributeId: this.attributeId }));
        this.router.navigate(['attributes-and-rules'], { queryParamsHandling: 'preserve' });
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
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: 'Are you sure you want to delete?'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
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

  onAddRelatedAttribute(): void {
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Add Attribute or Rule',
        placeholder: 'Attributes and Rules',
        options$: this.store.pipe(select(getAttributeEntities)),
        selectedIds: [],
        multi: false,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.store.dispatch(
          new AddRelated({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            relatedAttributeId: data.value[0].id
          })
        );
      }
    });
  }

  onDeleteRelatedAttribute(relatedId: string): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: 'Are you sure you want to delete?'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(
          new DeleteRelated({
            workPackageId: this.workpackageId,
            attributeId: this.attributeId,
            relatedAttributeId: relatedId
          })
        );
      }
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
    );
  }

  onRemoveTag(tag: Tag): void {
    this.store.dispatch(
      new DeleteAttributeTags({
        workPackageId: this.workpackageId,
        attributeId: this.attributeId,
        tagId: tag.id
      })
    );
  }

  onRaiseNew(): void {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false,
      width: '800px',
      data: {
        selectedNode: this.attribute
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio || data.selectedWorkPackages) {
        this.store.dispatch(new AddRadioEntity({ data: { ...data.radio } }));
        this.actions.pipe(ofType(RadioActionTypes.AddRadioSuccess)).subscribe((action: any) => {
          const radioId = action.payload.id;
          if (action) {
            data.selectedWorkPackages.forEach(workpackage => {
              this.store.dispatch(
                new AddAttributeRadio({
                  workPackageId: workpackage.id,
                  attributeId: this.attributeId,
                  radioId: radioId
                })
              );
            });
          }
        });
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
        this.store.dispatch(
          new AddAttributeRadio({
            workPackageId: (this.workpackageId) ? this.workpackageId : currentArchitecturePackageId,
            attributeId: this.attributeId,
            radioId: data.radio.id
          })
        );
      }
    });

    dialogRef.componentInstance.addNewRadio.subscribe(() => {
      this.onRaiseNew();
    });
  }
}
