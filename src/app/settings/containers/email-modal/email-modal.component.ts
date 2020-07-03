import { Component, OnInit, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { State as OrganisationState } from '@app/settings/store/reducers/organisation.reducer';
import { Store, select } from '@ngrx/store';
import { getOrganisationEmailDomains } from '@app/settings/store/selectors/organisation.selector';

@Component({
  selector: 'smi-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.scss']
})
export class EmailModalComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public domains: string[];

  constructor(
    private store: Store<OrganisationState>,
    public dialogRef: MatDialogRef<EmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  @ViewChild('input') input: ElementRef;

  ngOnInit(): void {
    this.subscription = this.store.pipe(select(getOrganisationEmailDomains)).subscribe(data => (this.domains = data.emailDomains));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSave(): void {
    this.dialogRef.close({ emailDomains: this.input.nativeElement.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
