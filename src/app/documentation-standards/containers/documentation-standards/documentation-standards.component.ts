import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as DocumentationStandardState } from '../../store/reducers/documentation-standards.reducer';
import {
  LoadDocumentationStandards,
  AddDocumentationStandard
} from '../../store/actions/documentation-standards.actions';
import { getDocumentStandards } from '../../store/selectors/documentation-standards.selector';
import { Observable } from 'rxjs';
import { DocumentStandard } from '../../store/models/documentation-standards.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DocumentModalComponent } from '../document-modal/document-modal.component';

@Component({
  selector: 'smi-documentation-standards-component',
  templateUrl: 'documentation-standards.component.html',
  styleUrls: ['documentation-standards.component.scss']
})
export class DocumentationStandardsComponent implements OnInit {
  public documentStandards$: Observable<DocumentStandard[]>;
  public documentStandard: DocumentStandard;

  constructor(
    private store: Store<DocumentationStandardState>,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadDocumentationStandards({}));
    this.documentStandards$ = this.store.pipe(select(getDocumentStandards));
  }

  onSelectDocument(documentStandard: DocumentStandard): void {
    this.router.navigate(['documentation-standards', documentStandard.id], { queryParamsHandling: 'preserve' });
  }

  onAddDocument(): void {
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      disableClose: false,
      width: '600px',
      data: {
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.documentStandard) {
        this.store.dispatch(new AddDocumentationStandard({ data: data.documentStandard }));
      }
    });
  }
}
