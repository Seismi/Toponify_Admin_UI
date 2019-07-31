import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ObjectDetailsService } from '@app/architecture/components/object-details-form/services/object-details-form.service';
import { ObjectDetailsValidatorService } from '@app/architecture/components/object-details-form/services/object-details-form-validator.service';
import { Store, select } from '@ngrx/store';
import { State as AttributeState } from '@app/attributes/store/reducers/attributes.reducer';
import { LoadAttribute } from '@app/attributes/store/actions/attributes.actions';
import { getSelectedAttribute } from '@app/attributes/store/selectors/attributes.selector';
import { AttributeDetail } from '@app/attributes/store/models/attributes.model';

@Component({
  selector: 'app-attribute-details',
  templateUrl: './attribute-details.component.html',
  styleUrls: ['./attribute-details.component.scss'],
  providers: [ObjectDetailsService, ObjectDetailsValidatorService]
})
export class AttributeDetailsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  attribute: AttributeDetail;
  isEditable = false;
  showOrHideRightPane = false;
  selectedRightTab: number;

  constructor(
    private route: ActivatedRoute,
    private objectDetailsService: ObjectDetailsService,
    private store: Store<AttributeState>
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(params => {
      const id = params['attributeId'];
      this.store.dispatch(new LoadAttribute(id));
    }));

    this.subscriptions.push(this.store.pipe(select(getSelectedAttribute)).subscribe(attribute => {
      this.attribute = attribute;
      if(attribute) {
        this.objectDetailsService.objectDetailsForm.patchValue({
          name: attribute.name,
          category: attribute.category,
          description: attribute.description,
          tags: attribute.tags
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get objectDetailsForm(): FormGroup {
    return this.objectDetailsService.objectDetailsForm;
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

  onEditDetails() {
    this.isEditable = true;
  }

  onCancelEdit() {
    this.isEditable = false;
  }

  onSaveAttribute() {
    this.isEditable = false;
  }
  
}