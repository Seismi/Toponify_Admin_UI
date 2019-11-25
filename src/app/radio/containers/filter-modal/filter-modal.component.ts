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
import { Node } from '@app/nodes/store/models/node.model';
import { State as NodeState } from '@app/nodes/store/reducers/node.reducer';
import { getNodeEntities } from '@app/nodes/store/selectors/node.selector';

@Component({
  selector: 'smi-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  providers: [FilterRadioFormService, FilterRadioFormValidatorService]
})

export class FilterModalComponent implements OnInit {

  public users$: Observable<User[]>;
  public nodes$: Observable<Node[]>;
  public radio: RadiosAdvancedSearch;
  public filterData: RadiosAdvancedSearch | any;
  public filterApplied: boolean;
  public mode: string;

  constructor(
    private nodeStore: Store<NodeState>,
    private userStore: Store<UserState>,
    private filterRadioService: FilterRadioFormService,
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.radio = data.radio;
      this.filterData = data.filterData;
      this.mode = data.mode;
      (this.mode === 'filter') ? this.filterApplied = true : this.filterApplied = false;
    }

  ngOnInit(): void {
    this.nodes$ = this.nodeStore.pipe(select(getNodeEntities));
    this.users$ = this.userStore.pipe(select(getUsers));

    if (this.filterApplied) {
      this.filterRadioService.filterRadioForm.patchValue({
        status: this.filterData.status,
        type: this.filterData.type,
        assignedTo: this.filterData.assignedTo,
        relatesTo: this.filterData.relatesTo,
        from: this.filterData.from,
        to: this.filterData.to,
        text: this.filterData.text
      })
    }
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