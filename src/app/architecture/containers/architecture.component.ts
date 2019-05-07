
import * as fromNode from '../../nodes/store/reducers';
import { LoadNodes, LoadNodeLinks } from '@app/nodes/store/actions/node.actions';
import { OnInit, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Node } from './../../nodes/store/models/node.model';
import { NodeLink } from '@app/nodes/store/models/node-link.model';

@Component({
    selector: 'smi-architecture',
    templateUrl: 'architecture.component.html',
    styleUrls: ['architecture.component.scss']
})

export class ArchitectureComponent implements OnInit {
    nodes$: Observable<Node[]>;
    nodeLinks$: Observable<NodeLink[]>;

    constructor(
        private store: Store<fromNode.NodesState>
    ) { }

    ngOnInit() {
        this.store.dispatch((new LoadNodes()));
        this.store.dispatch((new LoadNodeLinks()));

        this.nodes$ = this.store.pipe(select(fromNode.getNodes));
        this.nodeLinks$ = this.store.pipe(select(fromNode.getNodeLinks));
    }
}
