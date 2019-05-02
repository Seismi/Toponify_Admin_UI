
import * as fromNode from '../../nodes/store/reducers';
import { LoadNodes } from '@app/nodes/store/actions/node.actions';
import { OnInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
    selector: 'smi-architecture',
    templateUrl: 'architecture.component.html',
    styleUrls: ['architecture.component.scss']
})

export class ArchitectureComponent implements OnInit {
    constructor(
        private store: Store<fromNode.NodesState>
    ) { }

    ngOnInit() {
        this.store.dispatch((new LoadNodes()));
     }
}