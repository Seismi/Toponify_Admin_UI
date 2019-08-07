import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  /* In scopes and layouts modal there is a dropdown for owners and viewers 
  and i'm pushing multiple selected values in here */
  selectedOwners = [];
  selectedViewers = [];
}