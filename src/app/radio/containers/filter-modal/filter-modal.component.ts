import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FilterRadioFormService } from '@app/radio/components/filter-radio-form/services/filter-radio-form.service';
import { FilterRadioFormValidatorService } from '@app/radio/components/filter-radio-form/services/filter-radio-form-validator.service';
import { FormGroup } from '@angular/forms';
import { User } from '@app/settings/store/models/user.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { getUsers } from '@app/settings/store/selectors/user.selector';
import { RadiosAdvancedSearch } from '@app/radio/store/models/radio.model';
import { Node, Tag } from '@app/architecture/store/models/node.model';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { getNodeEntities, getTags } from '@app/architecture/store/selectors/node.selector';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getAllWorkPackages } from '@app/workpackage/store/selectors/workpackage.selector';

@Component({
  selector: 'smi-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  providers: [FilterRadioFormService, FilterRadioFormValidatorService]
})
export class FilterModalComponent implements OnInit {
  public users$: Observable<User[]>;
  public nodes$: Observable<Node[]>;
  public workpackages$: Observable<WorkPackageEntity[]>;
  public tags$: Observable<Tag[]>;
  public radio: RadiosAdvancedSearch;
  public filterData: RadiosAdvancedSearch | any;
  public mode: string;

  constructor(
    private workPackageStore: Store<WorkPackageState>,
    private nodeStore: Store<NodeState>,
    private userStore: Store<UserState>,
    private filterRadioService: FilterRadioFormService,
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.radio = data.radio;
    this.filterData = data.filterData;
    this.mode = data.mode;
  }

  ngOnInit(): void {
    this.tags$ = this.nodeStore.pipe(select(getTags));
    this.workpackages$ = this.workPackageStore.pipe(select(getAllWorkPackages));
    this.nodes$ = this.nodeStore.pipe(select(getNodeEntities));
    this.users$ = this.userStore.pipe(select(getUsers));

    this.filterRadioService.filterRadioForm.patchValue({
      status: this.filterData.status,
      type: this.filterData.type,
      assignedTo: this.filterData.assignedTo,
      relatesToWorkPackages: this.filterData.relatesToWorkPackages,
      relatesTo: this.filterData.relatesTo,
      from: this.filterData.from,
      to: this.filterData.to,
      text: this.filterData.text,
      severityRangeFrom: (this.filterData.severityRangeFrom) ? (this.filterData.severityRangeFrom) : 1,
      severityRangeTo: (this.filterData.severityRangeTo) ? this.filterData.severityRangeTo : 5,
      frequencyRangeFrom: (this.filterData.frequencyRangeFrom) ? this.filterData.frequencyRangeFrom : 1,
      frequencyRangeTo: (this.filterData.frequencyRangeTo) ? this.filterData.frequencyRangeTo : 5,
      hasTag: this.filterData.hasTag
    });
  }

  get filterRadioForm(): FormGroup {
    return this.filterRadioService.filterRadioForm;
  }

  onSubmit(): void {
    this.dialogRef.close({ radio: this.filterRadioForm.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
