import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { of } from 'rxjs';
import { Dimension, ReportingConcept } from '@app/report-library/store/models/report.model';
import { ReportService } from '@app/report-library/services/report.service';
import { SelectModalComponent } from '@app/core/layout/components/select-modal/select-modal.component';

@Component({
  selector: 'smi-reporting-concept-filter-modal',
  templateUrl: './reporting-concept-filter-modal.component.html',
  styleUrls: ['./reporting-concept-filter-modal.component.scss']
})
export class ReportingConceptFilterModalComponent implements OnInit {
  public selectedFilter: string;
  public dataSource: MatTableDataSource<ReportingConcept>;
  public initialSelectedConcepts: ReportingConcept[];
  public selectedConcepts: ReportingConcept[];
  private availableConcepts: ReportingConcept[];
  public dimensionName: string;

  constructor(
    public dialogRef: MatDialogRef<ReportingConceptFilterModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      workpackageId: string;
      reportId: string;
      dimension: Dimension;
    },
    private reportService: ReportService,
    private dialog: MatDialog
  ) {
    this.selectedFilter = data.dimension.filter || 'all';
    this.dimensionName = data.dimension.name;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ReportingConcept>([]);
    this.reportService
      .getReportingConcepts(this.data.workpackageId, this.data.reportId, this.data.dimension.id)
      .subscribe(data => {
        this.selectedConcepts = data.data.selected || [];
        this.availableConcepts = data.data.available || [];
        this.initialSelectedConcepts = [...this.selectedConcepts];
        this.dataSource = new MatTableDataSource(this.selectedConcepts);
      });
  }

  onConfirm() {
    if (this.selectedFilter !== 'selected') {
      this.dialogRef.close({
        filter: this.selectedFilter
      });
    } else {
      const unlinked = this.initialSelectedConcepts.filter(concept =>
        this.selectedConcepts.some(c => c.id !== concept.id)
      );
      const added = this.selectedConcepts.filter(
        concept => !this.initialSelectedConcepts.some(c => c.id === concept.id)
      );
      this.dialogRef.close({
        filter: this.selectedFilter,
        unlinked,
        added
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUnlink(concept: ReportingConcept): void {
    this.selectedConcepts = this.selectedConcepts.filter(c => c.id !== concept.id);
    this.availableConcepts = this.availableConcepts.filter(a => !this.selectedConcepts.some(c => c.id === a.id));
    this.dataSource = new MatTableDataSource(this.selectedConcepts);
  }

  addConcept(): void {
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: 'auto',
      minWidth: '400px',
      data: {
        title: 'Add reporting concept to dimension',
        multi: true,
        options$: of(this.availableConcepts),
        selectedIds: []
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.selectedConcepts = [...this.selectedConcepts, ...data.value];
        this.availableConcepts = this.availableConcepts.filter(
          concept => !this.selectedConcepts.some(c => c.id === concept.id)
        );
        this.dataSource = new MatTableDataSource(this.selectedConcepts);
      }
    });
  }
}
