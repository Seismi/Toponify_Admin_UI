import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener } from '@angular/material';

interface AnalysisProp {
  [key: string]: {
    filterValue: any;
    label: string;
    count: number;
  }[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-analysis-filter',
  templateUrl: './analysis-filter.component.html',
  styleUrls: ['./analysis-filter.component.scss']
})
export class AnalysisFilterComponent implements OnInit {
  @Input() analysis: AnalysisProp;
  @Input() selected: any;
  @Output() select = new EventEmitter();

  get sections(): string[] {
    return this.analysis ? Object.keys(this.analysis) : [];
  }

  constructor() {}

  ngOnInit() {}

  selectFilter(filter: any): void {
    this.select.emit(filter);
  }
}
