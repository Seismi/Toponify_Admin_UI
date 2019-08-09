import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as DocumentationStandardState } from '../../store/reducers/documentation-standards.reducer'
import { LoadDocumentationStandards, AddDocumentationStandard } from '../../store/actions/documentation-standards.actions';
import { getDocumentStandards } from '../../store/selectors/documentation-standards.selector';
import { Observable } from 'rxjs';
import { DocumentStandard } from '../../store/models/documentation-standards.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DocumentModalComponent } from '../document-modal/document-modal.component';
import { DocumentationStandardsService } from '@app/documentation-standards/services/dcoumentation-standards.service';
import { State as SearchState } from '@app/core/store/reducers/search.reducer';
import { Search } from '@app/core/store/actions/search.actions';
import { getSearchResults } from '@app/core/store/selectors/search.selectors';
import { SearchEntity } from '@app/core/store/models/search.models';


@Component({
  selector: 'smi-documentation-standards-component',
  templateUrl: 'documentation-standards.component.html',
  styleUrls: ['documentation-standards.component.scss']
})
export class DocumentationStandardsComponent implements OnInit {

  search$: Observable<SearchEntity[]>;
  documentStandards$: Observable<DocumentStandard[]>;
  documentStandard: DocumentStandard;

  constructor(
    private searchStore: Store<SearchState>,
    private documentationStandardsService: DocumentationStandardsService,
    private store: Store<DocumentationStandardState>,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadDocumentationStandards({}));
    this.documentStandards$ = this.store.pipe(select(getDocumentStandards));
  }

  onSelectDocument(row) {
    this.router.navigate(['documentation-standards', row.id]);
  }

  onAddDocument() {
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.documentStandard) {
        this.store.dispatch(new AddDocumentationStandard({
          data: {
            name: data.documentStandard.name,
            description: data.documentStandard.description,
            type: data.documentStandard.type,
            levels: this.documentationStandardsService.selectedLevels
          }
        }))
      }
    });
  }

  onSearch(query: string) {
    this.search(query);
  }

  search(text: string) {
    const queryParams = {
      text: text
    };

    this.searchStore.dispatch(new Search(queryParams));
    this.search$ = this.searchStore.pipe(select(getSearchResults));
  }
}