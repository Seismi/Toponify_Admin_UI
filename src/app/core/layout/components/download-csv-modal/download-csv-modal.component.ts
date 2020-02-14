import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { getQueryParams } from '@app/core/store/selectors/route.selectors';
import { take, switchMap } from 'rxjs/operators';
import { ReportService } from '@app/report-library/services/report.service';
import { RadioService } from '@app/radio/services/radio.service';

@Component({
  selector: 'smi-download-csv-modal',
  templateUrl: './download-csv-modal.component.html',
  styleUrls: ['./download-csv-modal.component.scss']
})
export class DownloadCSVModalComponent implements OnInit {
  constructor(
    private radioService: RadioService,
    private reportService: ReportService,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>,
    public dialogRef: MatDialogRef<DownloadCSVModalComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: { 
      GET: string,
      fileName: string 
    }
  ) { }

  ngOnInit() {
    this.routerStore
      .select(getQueryParams)
      .pipe(
        take(1),
        switchMap(params => {
          let workPackages = [];
          if (params.workpackages && typeof params.workpackages === 'string') {
            workPackages.push(params.workpackages);
          } else if (params.workpackages) {
            workPackages = params.workpackages;
          }
          const queryParams = {
            workPackageQuery: workPackages,
            scopeQuery: params.scope,
            format: 'csv'
          };
          return this.getData(queryParams);
        })
      )
      .subscribe(
        csv => {
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${this.data.fileName}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.dialogRef.close();
        },
        () => this.dialogRef.close()
      )
  }

  getData(queryParams) {
    switch(this.data.GET) {
      case 'report-library':
        return this.reportService.getReports(queryParams);
      case 'radio':
        return this.radioService.getRadioEntities(queryParams);
    }
  }

}