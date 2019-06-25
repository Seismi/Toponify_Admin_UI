import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadWorkPackage } from '@app/workpackage/store/actions/workpackage.actions';
import { Store, select } from '@ngrx/store';
import { State as DocumentStandardsState } from '../../store/reducers/documentation-standards.reducer';
import { Subscription } from 'rxjs';
import { DocumentStandardsService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards.service';
import { FormGroup } from '@angular/forms';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';
import { getDocumentStandard } from '@app/documentation-standards/store/selectors/documentation-standards.selector';
import { DocumentStandardsValidatorService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards-validator.service';

@Component({
  selector: 'app-documentation-standards-details',
  templateUrl: './documentation-standards-details.component.html',
  styleUrls: ['./documentation-standards-details.component.scss'],
  providers: [DocumentStandardsService, DocumentStandardsValidatorService]
})
export class DocumentationStandardsDetailsComponent implements OnInit, OnDestroy {

  @Output() selectDocumentStandard= new EventEmitter();

  documentationStandards: DocumentStandard;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<DocumentStandardsState>,
    private documentStandardsService: DocumentStandardsService
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe( params => {
      const id = params['documentStandardId'];
      this.store.dispatch(new LoadWorkPackage(id));
    }));
    this.subscriptions.push(this.store.pipe(select(getDocumentStandard)).subscribe(documentStandard => {
      this.documentationStandards = documentStandard;
      this.documentStandardsService.documentStandardsForm.patchValue({
        name: documentStandard.name,
        description: documentStandard.description,
        type: documentStandard.type,
        levels: documentStandard.levels
      });
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get documentStandardsForm(): FormGroup {
    return this.documentStandardsService.documentStandardsForm;
  }

}