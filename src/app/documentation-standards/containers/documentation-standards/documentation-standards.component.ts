import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as DocumentationStandardState } from '../../store/reducers/documentation-standards.reducer';
import {
  LoadDocumentationStandards,
  AddDocumentationStandard
} from '../../store/actions/documentation-standards.actions';
import {
  getDocumentStandards,
  getDocumentStandardPage,
  getDocumentStandardsLoadingStatus
} from '../../store/selectors/documentation-standards.selector';
import { Observable, Subject } from 'rxjs';
import { DocumentStandard, DocumentStandardsApiRequest } from '../../store/models/documentation-standards.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DocumentModalComponent } from '../document-modal/document-modal.component';
import { Roles } from '@app/core/directives/by-role.directive';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'smi-documentation-standards-component',
  templateUrl: 'documentation-standards.component.html',
  styleUrls: ['documentation-standards.component.scss']
})
export class DocumentationStandardsComponent implements OnInit {
  public documentStandards$: Observable<DocumentStandard[]>;
  public documentStandard: DocumentStandard;
  public Roles = Roles;

  private documentStandardParams: DocumentStandardsApiRequest = {
    textFilter: '',
    page: 0,
    size: 10
  };

  search$ = new Subject<string>();
  page$: Observable<any>;

  get isLoading$(): Observable<boolean> {
    return this.store.select(getDocumentStandardsLoadingStatus);
  }

  constructor(private store: Store<DocumentationStandardState>, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadDocumentationStandards(this.documentStandardParams));
    this.documentStandards$ = this.store.pipe(select(getDocumentStandards));

    this.search$.pipe(debounceTime(500), distinctUntilChanged()).subscribe(textFilter => {
      this.documentStandardParams = {
        textFilter: textFilter,
        page: 0,
        size: this.documentStandardParams.size,
        ...(this.documentStandardParams.sortBy && { sortBy: this.documentStandardParams.sortBy }),
        ...(this.documentStandardParams.sortOrder && { sortOrder: this.documentStandardParams.sortOrder })
      };
      this.store.dispatch(new LoadDocumentationStandards(this.documentStandardParams));
    });

    this.page$ = this.store.pipe(select(getDocumentStandardPage));
  }

  onSelectDocument(documentStandard: DocumentStandard): void {
    this.router.navigate(['documentation-standards', documentStandard.id], { queryParamsHandling: 'preserve' });
  }

  onAddDocument(): void {
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      disableClose: false,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.documentStandard) {
        this.store.dispatch(new AddDocumentationStandard({ data: data.documentStandard }));
      }
    });
  }

  onSearch(textFilter: string): void {
    this.search$.next(textFilter);
  }

  refreshSearch(textFilter: string): void {
    this.documentStandardParams = {
      textFilter: textFilter,
      page: 0,
      size: this.documentStandardParams.size,
      ...(this.documentStandardParams.sortBy && { sortBy: this.documentStandardParams.sortBy }),
      ...(this.documentStandardParams.sortOrder && { sortOrder: this.documentStandardParams.sortOrder })
    };
    this.store.dispatch(new LoadDocumentationStandards(this.documentStandardParams));
  }

  onPageChange(page) {
    this.documentStandardParams = {
      textFilter: this.documentStandardParams.textFilter,
      page: page.pageIndex,
      size: page.pageSize,
      ...(this.documentStandardParams.sortBy && { sortBy: this.documentStandardParams.sortBy }),
      ...(this.documentStandardParams.sortOrder && { sortOrder: this.documentStandardParams.sortOrder })
    };
    this.store.dispatch(new LoadDocumentationStandards(this.documentStandardParams));
  }

  handleTableSortChange(sort: { sortOrder: string; sortBy: string }) {
    this.documentStandardParams = {
      textFilter: this.documentStandardParams.textFilter,
      page: this.documentStandardParams.page,
      size: this.documentStandardParams.size,
      ...(sort.sortOrder && { sortBy: sort.sortBy, sortOrder: sort.sortOrder })
    };
    this.store.dispatch(new LoadDocumentationStandards(this.documentStandardParams));
  }
}
