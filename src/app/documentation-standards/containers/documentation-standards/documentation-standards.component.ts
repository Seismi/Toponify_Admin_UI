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
import { DocumentationStandardsService } from '@app/documentation-standards/services/dcoumentation-standards.service';

@Component({
  selector: 'smi-documentation-standards-component',
  templateUrl: 'documentation-standards.component.html',
  styleUrls: ['documentation-standards.component.scss']
})
export class DocumentationStandardsComponent implements OnInit {
  documentStandards$: Observable<DocumentStandard[]>;
  documentStandard: DocumentStandard;

  constructor(
    private documentationStandardsService: DocumentationStandardsService,
    private store: Store<DocumentationStandardState>,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.dispatch(new LoadDocumentationStandards({}));
    this.documentStandards$ = this.store.pipe(select(getDocumentStandards));
  }

  onSelectDocument(row) {
    this.router.navigate(['documentation-standards', row.id], { queryParamsHandling: 'preserve' });
  }

  onAddDocument() {
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.documentStandard) {
        this.store.dispatch(
          new AddDocumentationStandard({
            data: {
              name: data.documentStandard.name,
              description: data.documentStandard.description,
              type: data.documentStandard.type,
              levels: this.documentationStandardsService.selectedLevels
            }
          })
        );
      }
    });
  }
}
