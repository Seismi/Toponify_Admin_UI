import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { State as ArchitectureState } from '@app/architecture/store/reducers/architecture.reducer';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import { getNodeEntitiesBy } from '@app/architecture/store/selectors/node.selector';
import { Level } from '@app/architecture/services/diagram-level.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FilterService } from '@app/architecture/services/filter.service';

@Component({
  selector: 'smi-descendants-modal',
  templateUrl: './descendants-modal.component.html',
  styleUrls: ['./descendants-modal.component.scss']
})

export class DescendantsModalComponent implements OnInit {

  public dataSource$: Observable<MatTableDataSource<DescendantsEntity>>;
  public displayedColumns: string[] = ['name'];
  public selectedDescendant: DescendantsEntity;


  constructor(
    private store: Store<ArchitectureState>,
    private filterService: FilterService,
    public dialogRef: MatDialogRef<DescendantsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {currentLevel: Level}) {
  }

  ngOnInit() {
    let layer: Level;
    switch (this.data.currentLevel) {
      case Level.system: {
        layer = Level.dataSet;
      }
      break;
      case Level.dataSet: {
        layer = Level.dimension;
      }
      break;
      case Level.dimension:
      default: {
        layer = Level.reportingConcept;
      }
    }
    this.dataSource$ = this.store.pipe(
      select(getNodeEntitiesBy, {layer}),
      map(descendants => new MatTableDataSource<DescendantsEntity>(descendants))
    );
  }

  onSubmit() {
    this.dialogRef.close({descendant: this.selectedDescendant});
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSelectDescendant(descendant: DescendantsEntity) {
    this.selectedDescendant = descendant;
  }
}
