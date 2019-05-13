import { Component, OnInit } from '@angular/core';
import { getNodeEntities, getNodeLinks } from '@app/nodes/store/selectors/node.selector';
import { LoadNodeLinks, LoadNodes } from '@app/nodes/store/actions/node.actions';
import { Node } from './../../nodes/store/models/node.model';
import { NodeLink } from '@app/nodes/store/models/node-link.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State as NodeState } from '../../nodes/store/reducers/node.reducer';


@Component({
    selector: 'smi-architecture',
    templateUrl: 'architecture.component.html',
    styleUrls: ['architecture.component.scss']
})

export class ArchitectureComponent implements OnInit {
    nodes$: Observable<Node[]>;
    nodeLinks$: Observable<NodeLink[]>;

    constructor(
        private nodeStore: Store<NodeState>,
    ) { }

    ngOnInit() {
        this.nodeStore.dispatch((new LoadNodes()));
        this.nodeStore.dispatch((new LoadNodeLinks()));

        this.nodes$ = this.nodeStore.pipe(select(getNodeEntities));
        this.nodeLinks$ = this.nodeStore.pipe(select(getNodeLinks));
    }
}