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
import { LoadNodes } from '@app/nodes/store/actions/node.actions';
import { getNodeEntities } from '@app/nodes/store/selectors/node.selector';

@Component({
  selector: 'smi-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  providers: [FilterRadioFormService, FilterRadioFormValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class FilterModalComponent implements OnInit {

  public users$: Observable<User[]>;
  public nodes$: Observable<Node[]>;
  public radio: RadiosAdvancedSearch;

  constructor(
    private nodeStore: Store<NodeState>,
    private userStore: Store<UserState>,
    private filterRadioService: FilterRadioFormService,
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.radio = data.radio;
    }

  ngOnInit(): void { 
    this.users$ = this.userStore.pipe(select(getUsers));

    this.nodeStore.dispatch(new LoadNodes());
    this.nodes$ = this.nodeStore.pipe(select(getNodeEntities));
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