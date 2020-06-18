import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as OrganisationState } from '@app/settings/store/reducers/organisation.reducer';
import { getOrganisationName, getOrganisationDomain, getOrganisationLicenceInfo, getOrganisationAccountAdmins, getOrganisationEmailDomains } from '@app/settings/store/selectors/organisation.selector';
import { LoadOrganisationName, LoadOrganisationDomain, LoadOrganisationLicenceInfo, LoadOrganisationAccountAdmins, AddOrganisationAccountAdmins, DeleteOrganisationAccountAdmins, UpdateOrganisationEmailDomains, LoadOrganisationEmailDomains } from '@app/settings/store/actions/organisation.actions';
import { OrganisationLicenceInfo, OrganisationName, OrganisationDomain, OrganisationAccountAdmins, OrganisationEmailDomains } from '@app/settings/store/models/organisation.model';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { SelectModalComponent } from '@app/core/layout/components/select-modal/select-modal.component';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { LoadUsers } from '@app/settings/store/actions/user.actions';
import { getUsers } from '@app/settings/store/selectors/user.selector';
import { map } from 'rxjs/operators';
import { EmailModalComponent } from '../email-modal/email-modal.component';

@Component({
  selector: 'smi-organisations',
  templateUrl: 'organisations.component.html',
  styleUrls: ['organisations.component.scss']
})
export class OrganisationsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public organisationName: OrganisationName;
  public organisationDomain: OrganisationDomain;
  public licenceInfo: OrganisationLicenceInfo;
  public accountAdmins$: Observable<OrganisationAccountAdmins[]>;
  public emailDomains$: Observable<OrganisationEmailDomains>;

  constructor(
    private userStore: Store<UserState>,
    private store: Store<OrganisationState>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadOrganisationName());
    this.store.dispatch(new LoadOrganisationDomain());
    this.store.dispatch(new LoadOrganisationLicenceInfo());
    this.store.dispatch(new LoadOrganisationAccountAdmins());
    this.store.dispatch(new LoadOrganisationEmailDomains());

    this.accountAdmins$ = this.store.pipe(select(getOrganisationAccountAdmins));
    this.emailDomains$ = this.store.pipe(select(getOrganisationEmailDomains));

    this.subscriptions.push(
      this.store.pipe(select(getOrganisationName)).subscribe(organisation => (this.organisationName = organisation)),
      this.store.pipe(select(getOrganisationDomain)).subscribe(organisation => (this.organisationDomain = organisation)),
      this.store.pipe(select(getOrganisationLicenceInfo)).subscribe(info => (this.licenceInfo = info)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  emailSupport(): string {
    return location.href = 'mailto:accounts@toponify.com';
  }

  onAddAdmins(): void {
    this.userStore.dispatch(new LoadUsers({}));
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: `Add Account Administrators`,
        placeholder: 'Administrators',
        options$: this.userStore.pipe(select(getUsers))
          .pipe(
            map(data => data.map(({ firstName: name, lastName, id }) => ({ name: name + ` ${lastName}`, lastName, id })))
          ),
        selectedIds: []
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.store.dispatch(
          new AddOrganisationAccountAdmins({
            userId: data.value[0].id
          })
        );
      }
    });
  }

  onDeleteAdmins(admin: OrganisationAccountAdmins): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure you want to un-associate?'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.store.dispatch(new DeleteOrganisationAccountAdmins({ userId: admin.id }));
      }
    });
  }

  onEditEmailDomain(): void {
    const dialogRef = this.dialog.open(EmailModalComponent, {
      disableClose: false,
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.emailDomains) {
        this.store.dispatch(new UpdateOrganisationEmailDomains({emailDomains: data.emailDomains.split(', ')}));
      }
    });
  }
}
