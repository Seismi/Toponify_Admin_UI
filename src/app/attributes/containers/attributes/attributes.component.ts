import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AttributeEntity } from '../../store/models/attributes.model';
import { State as AttributeState } from '../../store/reducers/attributes.reducer';
import { Store, select } from '@ngrx/store';
import { LoadAttributes } from '../../store/actions/attributes.actions';
import * as fromAttributeEntities from '../../store/selectors/attributes.selector';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';
import { Router } from '@angular/router';

@Component({
    selector: 'smi-attributes',
    templateUrl: 'attributes.component.html',
    styleUrls: ['attributes.component.scss']
})
export class AttributesComponent implements OnInit {

    attributes: Subscription;
    attribute: AttributeEntity[];
    workpackage$: Observable<WorkPackageEntity[]>;

    constructor(
        private store: Store<AttributeState>, 
        private workPackageStore: Store<WorkPackageState>,
        private router: Router) { }

    ngOnInit() {
        // Attributes
        this.store.dispatch(new LoadAttributes({}));
        this.attributes = this.store.pipe(select(fromAttributeEntities.getAttributeEntities)).subscribe((data) => {
            this.attribute = data;
        });

        // Work Packages
        this.workPackageStore.dispatch(new LoadWorkPackages({}));
        this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
    }

    get categoryTableData() {
        return this.attribute;
    }

    onSelectAttribute(entry) {
        this.router.navigate(['/attributes-and-rules', entry.id])
    }
}