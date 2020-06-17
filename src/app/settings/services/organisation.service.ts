import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OrganisationName,
  OrganisationDomain,
  OrganisationLicenceInfo,
  OrganisationEmailDomains,
  OrganisationAccountAdmins
} from '../store/models/organisation.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OrganisationService {
  constructor(private http: HttpClient) {}

  getName(): Observable<{ data: OrganisationName }> {
    return this.http.get<{ data: OrganisationName }>(`/organisation/name`);
  }

  getDomain(): Observable<{ data: OrganisationDomain }> {
    return this.http.get<{ data: OrganisationDomain }>(`/organisation/domain`);
  }

  getLicenceInfo(): Observable<{ data: OrganisationLicenceInfo }> {
    return this.http.get<{ data: OrganisationLicenceInfo }>(`/organisation/licenceInfo`);
  }

  getEmailDomains(): Observable<{ data: OrganisationEmailDomains }> {
    return this.http.get<{ data: OrganisationEmailDomains }>(`/organisation/emailDomains`);
  }

  updateEmailDomains(): Observable<{ data: OrganisationEmailDomains }> {
    return this.http.put<{ data: OrganisationEmailDomains }>(`/organisation/emailDomains`, httpOptions);
  }

  getAccountAdmins(): Observable<{ data: OrganisationAccountAdmins[] }> {
    return this.http.get<{ data: OrganisationAccountAdmins[] }>(`/organisation/accountAdmins`);
  }

  addAccountAdmins(userId: string): Observable<{ data: OrganisationAccountAdmins[] }> {
    return this.http.post<{ data: OrganisationAccountAdmins[] }>(`/organisation/accountAdmins/${userId}`, httpOptions);
  }

  deleteAccountAdmins(userId: string): Observable<{ data: OrganisationAccountAdmins[] }> {
    return this.http.delete<{ data: OrganisationAccountAdmins[] }>(`/organisation/accountAdmins/${userId}`, httpOptions);
  }
}
