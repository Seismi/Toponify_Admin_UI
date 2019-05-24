import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smi-report-library-component',
  templateUrl: 'report-library.component.html',
  styleUrls: ['report-library.component.scss']
})

export class ReportLibraryComponent implements OnInit {

  reportSelected: boolean;

  constructor() { }

  ngOnInit() { }

  onSelectReport(row) {
    this.reportSelected = true;
  }
  
}