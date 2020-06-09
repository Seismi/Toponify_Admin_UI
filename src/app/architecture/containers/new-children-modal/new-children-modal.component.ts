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
import {layers, nodeCategories} from '@app/architecture/store/models/node.model';
import {Level} from '@app/architecture/services/diagram-level.service';

const systemCategories = [
  nodeCategories.transactional,
  nodeCategories.analytical,
  nodeCategories.reporting,
  nodeCategories.masterData,
  nodeCategories.file
];
const dataCategories = [nodeCategories.dataSet, nodeCategories.masterDataSet, nodeCategories.dataStructure];
const groupableDataCategories = [nodeCategories.dataSet, nodeCategories.masterDataSet];
const dimensionCategories = [nodeCategories.dimension];
const reportingConceptCategories = [nodeCategories.structure, nodeCategories.list, nodeCategories.key];

@Component({
  selector: 'smi-new-children-modal',
  templateUrl: './new-children-modal.component.html',
  styleUrls: ['./new-children-modal.component.scss'],
  providers: [NewChildrenService, NewChildrenValidatorService]
})
export class NewChildrenModalComponent implements OnInit, OnDestroy {
  public filterLevelSubscription: Subscription;
  public group: string;
  public parentId: string;
  public layer: string;
  public addGroupMember: boolean;
  public filterLevel: string;

  constructor(
    private newChildrenService: NewChildrenService,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    public dialogRef: MatDialogRef<NewChildrenModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.parentId = data.parentId;
    this.group = data.group;
    this.addGroupMember = data.addGroupMember;
  }

  ngOnInit(): void {
    this.filterLevelSubscription = this.routerStore.select(getFilterLevelQueryParams).subscribe(filterLevel => {
      this.filterLevel = filterLevel;
    });
    this.newChildrenForm.patchValue({ category: this.getCategories(this.filterLevel)[0] });
  }

  ngOnDestroy(): void {
    this.filterLevelSubscription.unsubscribe();
  }

  get newChildrenForm(): FormGroup {
    return this.newChildrenService.newChildrenForm;
  }

  getCategories(filterLevel: string): string[] {
    if (this.addGroupMember) {
      switch (filterLevel) {
        case Level.system:
        case Level.systemMap:
          return systemCategories;
        case Level.data:
        case Level.dataMap:
          return groupableDataCategories;
      }
    }
    switch (filterLevel) {
      case Level.system:
      case Level.systemMap:
        return dataCategories;
      case Level.data:
      case Level.dataMap:
        return dimensionCategories;
      case Level.dimension:
      case Level.dimensionMap:
        return reportingConceptCategories;
    }
  }

  getLayer(filterLevel: string): string {
    if (this.addGroupMember) {
      switch (filterLevel) {
        case Level.system:
        case Level.systemMap:
          return layers.system;
        case Level.data:
        case Level.dataMap:
          return layers.data;
      }
    }
    switch (filterLevel) {
      case Level.system:
      case Level.systemMap:
        return layers.data;
      case Level.data:
      case Level.dataMap:
        return layers.dimension;
      case Level.dimension:
      case Level.dimensionMap:
        return layers.reportingConcept;
    }
  }

  onSubmit(): void {
    if (!this.newChildrenService.isValid) {
      return;
    }
    this.dialogRef.close({
      data: {
        ...this.newChildrenForm.value,
        layer: this.getLayer(this.filterLevel),
        parentId: this.parentId,
        group: this.group
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
