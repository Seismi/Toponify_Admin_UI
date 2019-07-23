import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
    selector: 'smi-attribute-detail',
    templateUrl: 'attribute-detail.component.html',
    styleUrls: ['attribute-detail.component.scss']
})
export class AttributeDetailComponent {

    owners: NodeDetail[];
    
    @Input() set data(data: any[]) {
        this.owners = data
    }

    categories = ['rule', 'attribute'];

    @Input() group: FormGroup;
}