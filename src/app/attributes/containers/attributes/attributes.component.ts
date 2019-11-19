import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AttributeEntity } from '../../store/models/attributes.model';
import { State as AttributeState } from '../../store/reducers/attributes.reducer';
import { Store, select } from '@ngrx/store';
import { LoadAttributes, AddAttribute } from '../../store/actions/attributes.actions';
import * as fromAttributeEntities from '../../store/selectors/attributes.selector';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackages, SetWorkpackageSelected, SetWorkpackageEditMode } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackageEntities, getSelectedWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AttributeModalComponent } from '../attribute-modal/attribute-modal.component';

@Component({
	selector: 'smi-attributes',
	templateUrl: 'attributes.component.html',
	styleUrls: ['attributes.component.scss']
})
export class AttributesComponent implements OnInit {

	public attributes: Subscription;
	public attribute: AttributeEntity[];
	public workpackage$: Observable<WorkPackageEntity[]>;
	public hideTab: boolean = true;
	public selectedLeftTab: number;
	public showOrHidePane: boolean;
	public subscriptions: Subscription[] = [];
	public workpackageId: string;
	public canSelectWorkpackage: boolean = true;
	public workPackageIsEditable: boolean;

	constructor(
		private store: Store<AttributeState>,
		private workPackageStore: Store<WorkPackageState>,
		private router: Router,
		private dialog: MatDialog) { }

	ngOnInit() {
		this.workPackageStore.dispatch(new LoadWorkPackages({}));
		this.workpackage$ = this.workPackageStore.pipe(select(getWorkPackageEntities));
		this.subscriptions.push(this.workPackageStore.pipe(select(getSelectedWorkpackages)).subscribe(workpackages => {
			const workPackageIds = workpackages.map(item => item.id);
			const selected = workpackages.map(item => item.selected);
			const edit = workpackages.map(item => item.edit);
			(edit[0] === true) ? this.workPackageIsEditable = true : this.workPackageIsEditable = false;
			if (!selected.length) {
				this.router.navigate(['/attributes-and-rules']);
			}
			this.setWorkPackage(workPackageIds);
		}));

		this.attributes = this.store.pipe(select(fromAttributeEntities.getAttributeEntities)).subscribe((data) => {
			this.attribute = data;
		});
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	setWorkPackage(workpackageIds: string[] = []): void {
		const queryParams = {
			workPackageQuery: workpackageIds
		};
		this.store.dispatch(new LoadAttributes(queryParams));
	}

	get categoryTableData(): AttributeEntity[] {
		return this.attribute;
	}

	onSelectAttribute(entry: AttributeEntity): void {
		this.router.navigate(['/attributes-and-rules', entry.id]);
	}

	onSelectWorkPackage(id: string): void {
		this.workPackageStore.dispatch(new SetWorkpackageSelected({ workpackageId: id }));
	}

	openLeftTab(index: number): void {
		this.selectedLeftTab = index;
		if (this.selectedLeftTab === index) {
			this.showOrHidePane = true;
		}
	}

	hideLeftPane(): void {
		this.showOrHidePane = false;
	}

	onSelectEditWorkpackage(workpackage: any): void {
    this.workpackageId = workpackage.id;
    this.workPackageStore.dispatch(new SetWorkpackageEditMode({ id: workpackage.id }));
	}
	
	onAdd(): void {
    const dialogRef = this.dialog.open(AttributeModalComponent, {
      disableClose: false, 
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((data) => {
      if(data && data.attribute) {
				this.store.dispatch(new AddAttribute({
					workPackageId: this.workpackageId,
					entity: { data: {...data.attribute }}
				}))
			}
    });
	}

}
