import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'smi-attribute-detail',
    templateUrl: 'attribute-detail.component.html',
    styleUrls: ['attribute-detail.component.scss']
})
export class AttributeDetailComponent {

    categories = ['rule', 'attribute'];

    @Input() group: FormGroup;
    
}