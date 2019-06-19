import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-scopes-and-layouts-component',
  templateUrl: 'scopes-and-layouts.component.html',
  styleUrls: ['scopes-and-layouts.component.scss']
})

export class ScopesAndLayoutsComponent implements OnInit {

  scopeSelected: boolean;
  layoutSelected: boolean;

  constructor(private router: Router) { }

  ngOnInit() { }

  onScopeSelect(row: any) {
    this.router.navigate(['scopes-and-layouts', row.id]);
  }

  onSearchVersion(evt: any) {}
}
