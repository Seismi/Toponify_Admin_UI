import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as DocumentationStandardState } from './../store/reducers/documentation-standards.reducer'
import { LoadDocumentationStandards } from '../store/actions/documentation-standards.actions';
import { getDocumentStandards } from '../store/selectors/documentation-standards.selector';
import { Observable } from 'rxjs';
import { DocumentStandard } from '../store/models/documentation-standards.model';
import { DocumentStandardsService } from '../components/documentation-standards-detail/services/document-standards.service';
import { DocumentStandardsValidatorService } from '../components/documentation-standards-detail/services/document-standards-validator.service';

@Component({
  selector: 'smi-documentation-standards-component',
  templateUrl: 'documentation-standards.component.html',
  styleUrls: ['documentation-standards.component.scss'],
  providers: [DocumentStandardsService, DocumentStandardsValidatorService]
})

export class DocumentationStandardsComponent implements OnInit {

  rowSelected = false;
  documentStandards$: Observable<DocumentStandard[]>;

  constructor(
    private store: Store<DocumentationStandardState>,
    private documentStandardsService: DocumentStandardsService
  ) { }

  ngOnInit() { 
    this.store.dispatch(new LoadDocumentationStandards({}));
    this.documentStandards$ = this.store.pipe(select(getDocumentStandards));
  }

  get documentStandardsForm() {
    return this.documentStandardsService.documentStandardsForm;
  }

  onSelectDocumentation(row) {
    this.rowSelected = true;
    this.documentStandardsService.documentStandardsForm.patchValue({
      name: row.name,
      description: row.description,
      type: row.type,
      levels: row.levels
    })
  }

}