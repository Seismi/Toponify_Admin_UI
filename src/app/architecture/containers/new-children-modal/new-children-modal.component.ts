import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { getFilterLevelQueryParams } from '@app/core/store/selectors/route.selectors';
import { NewChildrenService } from './services/new-children-form.service';
import { NewChildrenValidatorService } from './services/new-children-form-validator.service';
import { FormGroup } from '@angular/forms';

const dataSetCategories = ['physical', 'virtual', 'master data'];
const dimensionCategories = ['dimension'];
const reportingConceptCategories = ['list', 'structure', 'key'];

@Component({
  selector: 'smi-new-children-modal',
  templateUrl: './new-children-modal.component.html',
  styleUrls: ['./new-children-modal.component.scss'],
  providers: [NewChildrenService, NewChildrenValidatorService]
})
export class NewChildrenModalComponent implements OnInit, OnDestroy {

  public categories: string[] = [];
  public filterLevelSubscription: Subscription;
  public parentId: string;
  public layer: string;

  constructor(
    private newChildrenService: NewChildrenService,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    public dialogRef: MatDialogRef<NewChildrenModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.parentId = data.parentId;
    }

  ngOnInit(): void {
    this.filterLevelSubscription = this.routerStore.select(getFilterLevelQueryParams).subscribe(filterLevel => {
      if (filterLevel === 'system') {
        this.categories = dataSetCategories;
      } else if (filterLevel === 'data set') {
        this.categories = dimensionCategories;
      } else {
        this.categories = reportingConceptCategories;
      }
      this.getLayer(filterLevel);
    });
  }

  ngOnDestroy(): void {
    this.filterLevelSubscription.unsubscribe();
  }

  get newChildrenForm(): FormGroup {
    return this.newChildrenService.newChildrenForm;
  }

  getLayer(filterLevel: string): string {
    if (filterLevel === 'system') {
      this.layer = 'data set';
    } else if (filterLevel === 'data set') {
      this.layer = 'dimension'
    } else {
      this.layer = 'reporting concept'
    }
    return this.layer;
  }

  onSubmit(): void {
    if (!this.newChildrenService.isValid) {
      return;
    }
    this.dialogRef.close({
      data: {
        category: this.newChildrenForm.value.category,
        name: this.newChildrenForm.value.name,
        description: this.newChildrenForm.value.description,
        layer: this.layer,
        parentId: this.parentId
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}