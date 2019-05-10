import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State as NodeState } from '../../nodes/store/reducers/node.reducer';
import * as NodeActions from './../../nodes/store/actions/node.actions';

@Component({
  selector: 'smi-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {
  constructor(
    private store: Store<NodeState>
  ) { }

  ngOnInit() {
    this.store.dispatch((new NodeActions.LoadNodes()));
   }
}