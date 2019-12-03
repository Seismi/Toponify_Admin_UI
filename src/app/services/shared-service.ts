import { Injectable } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';

@Injectable()
export class SharedService {
  /* In scopes and layouts modal there is a dropdown for owners and viewers
  and i'm pushing multiple selected values in here */
  selectedOwners = [];
  selectedViewers = [];

  public scope: ScopeDetails;
}
