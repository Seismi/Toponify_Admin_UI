import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromNode from './../../nodes/store/reducers';
import * as NodeActions from './../../nodes/store/actions/node.actions';

@Component({
  selector: 'smi-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {
  constructor(
    private store: Store<fromNode.NodesState>
  ) { }

  ngOnInit() {
    this.store.dispatch((new NodeActions.LoadNodes()));
   }
}