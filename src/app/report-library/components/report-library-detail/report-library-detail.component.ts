import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity,
  Dimension,
  OwnersEntity
} from '@app/report-library/store/models/report.model';
import { Tag, Node, LoadingStatus } from '@app/architecture/store/models/node.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getLoadingNodesStatus } from '@app/architecture/store/selectors/node.selector';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';

@Component({
  selector: 'smi-report-library-detail',
  templateUrl: 'report-library-detail.component.html',
  styleUrls: ['report-library-detail.component.scss']
})
export class ReportLibraryDetailComponent implements OnChanges {
  public loadingStatus = LoadingStatus;
  filteredOptions$: Observable<Node[]>;
  public group: FormGroup;
  private values;
  @Input('group') set setGroup(group) {
    this.group = group;
    this.values = group.value;
  }

  @Input() isEditable: boolean;
  @Input() dataSets: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];
  @Input() system: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity;
  @Input() owners: OwnersEntity[];
  @Input() dimensions: Dimension[];
  @Input() reportingConcepts: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[];
  @Input() modalMode = false;
  @Input() workPackageIsEditable: boolean;
  @Input() selectedOwner: boolean;
  @Input() selectedOwnerIndex: any;
  @Input() tags: Tag[];
  @Input() availableTags: Tag[];
  @Input() systems: Node[];

  @Output() saveReport = new EventEmitter<void>();
  @Output() deleteReport = new EventEmitter<string>();
  @Output() addOwner = new EventEmitter<void>();
  @Output() deleteOwner = new EventEmitter<string>();
  @Output() editSourceSystem = new EventEmitter<void>();
  @Output() addDataSets = new EventEmitter<void>();
  @Output() removeDataSet = new EventEmitter<string>();
  @Output() dimensionEdit = new EventEmitter<Dimension>();
  @Output() addTag = new EventEmitter<string>();
  @Output() removeTag = new EventEmitter<Tag>();
  @Output() updateAvailableTags = new EventEmitter<void>();
  @Output() goToTopology = new EventEmitter<void>();

  get isLoading$(): Observable<LoadingStatus> {
    return this.store.select(getLoadingNodesStatus);
  }

  constructor(private store: Store<NodeState>) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.systems && changes.systems.currentValue) {
      this.filteredOptions$ = this.group.get('system').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : changes.systems.currentValue.slice())
        );
    }
  }

  onSave(): void {
    this.saveReport.emit();
  }

  onCancel(): void {
    this.group.reset(this.values);
  }

  onDelete(): void {
    this.deleteReport.emit();
  }

  onSourceEdit(): void {
    this.editSourceSystem.emit();
  }

  onDatasetAdd(): void {
    this.addDataSets.emit();
  }

  onRemoveDataSet(id: string): void {
    this.removeDataSet.emit(id);
  }

  onDimensionEdit(dimension: Dimension): void {
    this.dimensionEdit.emit(dimension);
  }

  onGoToTopology(): void {
    this.goToTopology.emit();
  }

  displayFn(system: Node): string {
    return system && system.name ? system.name : '';
  }

  private _filter(name: string): Node[] {
    const filterValue = name.toLowerCase();
    return this.systems.filter(system => system.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
