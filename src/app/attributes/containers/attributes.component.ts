import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AttributeEntity } from '../store/models/attributes.model';
import { State as AttributeState } from '../store/reducers/attributes.reducer';
import { Store, select } from '@ngrx/store';
import { ObjectDetailsValidatorService } from '@app/architecture/components/object-details-form/services/object-details-form-validator.service';
import { ObjectDetailsService } from '@app/architecture/components/object-details-form/services/object-details-form.service';
import { FormGroup } from '@angular/forms';
import { LoadAttributes } from '../store/actions/attributes.actions';
import * as fromAttributeEntities from '../store/selectors/attributes.selector';

@Component({
    selector: 'smi-attributes',
    templateUrl: 'attributes.component.html',
    styleUrls: ['attributes.component.scss'],
    providers: [ObjectDetailsValidatorService, ObjectDetailsService],
})
export class AttributesComponent implements OnInit {

    attributes: Subscription;
    attribute: AttributeEntity[];
    isEditable = false;
    objectSelected = true;
    workPackageIsEditable = false;

    constructor(private store: Store<AttributeState>, private objectDetailsService: ObjectDetailsService) { }

    ngOnInit() { 
        this.store.dispatch(new LoadAttributes({}));
        this.attributes = this.store.pipe(select(fromAttributeEntities.getAttributeEntities)).subscribe((data) => {
            this.attribute = data;
        });
    }

    get categoryTableData() {
        return this.attribute;
    }

    get objectDetailsForm(): FormGroup {
        return this.objectDetailsService.objectDetailsForm;
    }

    onSelectedRow(entry) {
        this.isEditable = false;
        this.objectSelected = false;
        this.workPackageIsEditable = true;
        this.objectDetailsService.objectDetailsForm.patchValue({
            name: entry.name,
            category: entry.category,
            owner: entry.owner,
            description: entry.description,
            tags: entry.tags
        });
    }

    onEditDetails() {
        this.isEditable = true;
    }

    onCancelEdit() {
        this.isEditable = false;
    }

    onSaveAttribute() {
        this.isEditable = false;
    // this.store.dispatch(new AttributeActions.UpdateAttribute({
    //     versionId: this.versionId, attribute: { data: { ...data }}}));
    }

    onDeleteAttribute() {
        // const dialogRef = this.dialog.open(DeleteModalComponent, {
        //   disableClose: false,
        //   width: 'auto',
        //   data: {
        //     mode: 'delete'
        //   }
        // });
    
        // dialogRef.afterClosed().subscribe((data) => {
        //   if (data.mode === 'delete') {
        //     this.store.dispatch(new AttributeActions.DeleteAttribute({versionId: this.versionId, attributeId: this.selectedNode.id}));
        //   }
        // });
      }
    
      onAddAttribute() {
        // this.store.dispatch(new AttributeActions.AddAttribute({
        //   versionId: this.versionId,
        //   attribute: {
        //     data: {
        //       name: 'New Attribute',
        //       category: 'attribute',
        //       scope: 'global'
        //     }
        //   }
        // }));
      }
    
      onAddRule() {
        // this.store.dispatch(new AttributeActions.AddAttribute({
        //   versionId: this.versionId,
        //   attribute: {
        //     data: {
        //       name: 'New Rule',
        //       category: 'rule',
        //       scope: 'global'
        //     }
        //   }
        // }));
      }
}