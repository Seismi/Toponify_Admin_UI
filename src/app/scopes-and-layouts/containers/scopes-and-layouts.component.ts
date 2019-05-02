import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smi-scopes-and-layouts-component',
  templateUrl: 'scopes-and-layouts.component.html',
  styleUrls: ['scopes-and-layouts.component.scss']
})

export class ScopesAndLayoutsComponent implements OnInit {
  
  scopeSelected: boolean;
  layoutSelected: boolean;

  constructor() { }

  ngOnInit() { }

  onScopeSelect(row) {
    if(this.scopeSelected = true) {
      this.layoutSelected = false;
    }
  }

  onLayoutSelect(row) {
    this.layoutSelected = true;
  }

}