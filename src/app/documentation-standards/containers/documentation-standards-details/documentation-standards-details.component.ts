import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State as DocumentStandardsState } from '../../store/reducers/documentation-standards.reducer';
import { Subscription } from 'rxjs';
import { DocumentStandardsService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards.service';
import { FormGroup } from '@angular/forms';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';
import { DocumentStandardsValidatorService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards-validator.service';
import {
  LoadDocumentationStandard,
  UpdateDocumentationStandard,
  DeleteDocumentationStandard,
  DocumentationStandardActionTypes
} from '@app/documentation-standards/store/actions/documentation-standards.actions';
import { getDocumentStandard } from '@app/documentation-standards/store/selectors/documentation-standards.selector';
import { DeleteDocumentModalComponent } from '../delete-document-modal/delete-document.component';
import { MatDialog } from '@angular/material';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-documentation-standards-details',
  templateUrl: './documentation-standards-details.component.html',
  styleUrls: ['./documentation-standards-details.component.scss'],
  providers: [DocumentStandardsService, DocumentStandardsValidatorService]
})
export class DocumentationStandardsDetailsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public documentStandard: DocumentStandard;

  constructor(
    private actions: Actions,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store<DocumentStandardsState>,
    private documentStandardsService: DocumentStandardsService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const id = params['documentStandardId'];
        this.store.dispatch(new LoadDocumentationStandard(id));
      })
    );
    this.subscriptions.push(
      this.store.pipe(select(getDocumentStandard)).subscribe(documentStandard => {
        this.documentStandard = documentStandard;
        if (documentStandard) {
          this.documentStandardsService.updateForm(documentStandard);
        }
      })
    );
  }

  get documentStandardsForm(): FormGroup {
    return this.documentStandardsService.documentStandardsForm;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSaveDocument(): void {
    this.store.dispatch(
      new UpdateDocumentationStandard({
        id: this.documentStandard.id,
        data: {
          data: {
            id: this.documentStandard.id,
            type: this.documentStandardsForm.value.type,
            name: this.documentStandardsForm.value.name,
            description: this.documentStandardsForm.value.description,
            levels: this.documentStandardsForm.value.levels
          }
        }
      })
    );
  }

  onDeleteDocument(): void {
    const dialogRef = this.dialog.open(DeleteDocumentModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete',
        name: this.documentStandard.name
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data.mode === 'delete') {
        this.store.dispatch(new DeleteDocumentationStandard(this.documentStandard.id));
        this.actions.pipe(ofType(DocumentationStandardActionTypes.DeleteDocumentationStandardSuccess)).subscribe(_ => {
          this.router.navigate(['/documentation-standards']);
        });
      }
    });
  }
}
