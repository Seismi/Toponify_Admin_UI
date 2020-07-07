import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as DocumentationStandardState } from '../../store/reducers/documentation-standards.reducer';
import {
  LoadDocumentationStandards,
  AddDocumentationStandard
} from '../../store/actions/documentation-standards.actions';
import { getDocumentStandards, getDocumentStandardPage } from '../../store/selectors/documentation-standards.selector';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DocumentStandard, DocumentStandardsApiRequest } from '../../store/models/documentation-standards.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DocumentModalComponent } from '../document-modal/document-modal.component';
import { Roles } from '@app/core/directives/by-role.directive';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';

@Component({
  selector: 'smi-documentation-standards-component',
  templateUrl: 'documentation-standards.component.html',
  styleUrls: ['documentation-standards.component.scss']
})
export class DocumentationStandardsComponent implements OnInit {
  public documentStandards$: Observable<DocumentStandard[]>;
  public documentStandard: DocumentStandard;
  public selectedLeftTab: number | string;
  public Roles = Roles;

  private documentStandardParams: DocumentStandardsApiRequest = {
    textFilter: '',
    page: 0,
    size: 10,
  }
  search$ = new Subject<string>();
  page$: Observable<any>;

  constructor(private store: Store<DocumentationStandardState>, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadDocumentationStandards(this.documentStandardParams));
    this.documentStandards$ = this.store.pipe(select(getDocumentStandards));

    this.search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(textFilter => {
        this.documentStandardParams = {
          textFilter: textFilter,
          page: 0,
          size: this.documentStandardParams.size,
        }
        this.store.dispatch(new LoadDocumentationStandards(this.documentStandardParams));
      });

    this.page$ = this.store.pipe(
      select(
        getDocumentStandardPage)
    )

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

  onPageChange(page) {
    this.documentStandardParams = {
      textFilter: this.documentStandardParams.textFilter,
      page: page.pageIndex,
      size: page.pageSize,
    }
    this.store.dispatch(new LoadDocumentationStandards(this.documentStandardParams))
  }
}
