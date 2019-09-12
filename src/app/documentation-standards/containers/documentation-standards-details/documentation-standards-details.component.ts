import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State as DocumentStandardsState } from '../../store/reducers/documentation-standards.reducer';
import { Subscription } from 'rxjs';
import { DocumentStandardsService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards.service';
import { FormGroup } from '@angular/forms';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';
import { DocumentStandardsValidatorService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards-validator.service';
import { LoadDocumentationStandard, UpdateDocumentationStandard, DeleteDocumentationStandard } from '@app/documentation-standards/store/actions/documentation-standards.actions';
import { getDocumentStandard } from '@app/documentation-standards/store/selectors/documentation-standards.selector';
import { DeleteDocumentModalComponent } from '../delete-document-modal/delete-document.component';
import { MatDialog } from '@angular/material';
import { DocumentationStandardsService } from '@app/documentation-standards/services/dcoumentation-standards.service';

@Component({
  selector: 'app-documentation-standards-details',
  templateUrl: './documentation-standards-details.component.html',
  styleUrls: ['./documentation-standards-details.component.scss'],
  providers: [DocumentStandardsService, DocumentStandardsValidatorService]
})
export class DocumentationStandardsDetailsComponent implements OnInit, OnDestroy {

  documentStandard: DocumentStandard;
  subscriptions: Subscription[] = [];
  documentStandardId: string;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store<DocumentStandardsState>,
    private documentStandardsService: DocumentStandardsService,
    private documentationStandardsService: DocumentationStandardsService
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const id = params['documentStandardId'];
      this.documentStandardId = id;
      this.store.dispatch(new LoadDocumentationStandard(id));
    }));
    this.subscriptions.push(this.store.pipe(select(getDocumentStandard)).subscribe(documentStandard => {
      if(documentStandard) {
        this.documentStandardsService.documentStandardsForm.patchValue({
          name: documentStandard.name,
          description: documentStandard.description,
          type: documentStandard.type
        });
      }
    }));
  }

  get documentStandardsForm(): FormGroup {
    return this.documentStandardsService.documentStandardsForm;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSaveDocument() {
    this.store.dispatch(new UpdateDocumentationStandard({
      id: this.documentStandardId,
      data: {
        data: {
          id: this.documentStandardId,
          type: this.documentStandardsForm.value.type,
          name: this.documentStandardsForm.value.name,
          description: this.documentStandardsForm.value.description,
          levels: this.documentationStandardsService.selectedLevels
        }
      }
    }));
  }

  onDeleteDocument() {
    const dialogRef = this.dialog.open(DeleteDocumentModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.mode === 'delete') {
        this.store.dispatch(new DeleteDocumentationStandard(this.documentStandardId))
      }
    });
  }
}