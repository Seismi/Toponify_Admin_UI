import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as DocumentationStandardState } from './../store/reducers/documentation-standards.reducer'
import { LoadDocumentationStandards } from '../store/actions/documentation-standards.actions';
import { getDocumentStandards } from '../store/selectors/documentation-standards.selector';
import { Observable } from 'rxjs';
import { DocumentStandard } from '../store/models/documentation-standards.model';

@Component({
  selector: 'smi-documentation-standards-component',
  templateUrl: 'documentation-standards.component.html',
  styleUrls: ['documentation-standards.component.scss']
})

export class DocumentationStandardsComponent implements OnInit {

  rowSelected = false;
  documentStandards$: Observable<DocumentStandard[]>;

  constructor(
    private store: Store<DocumentationStandardState>,
  ) { }

  ngOnInit() { 
    this.store.dispatch(new LoadDocumentationStandards({}));
    this.documentStandards$ = this.store.pipe(select(getDocumentStandards));
  }

  onSelectDocumentation() {
    this.rowSelected = true;
  }

}