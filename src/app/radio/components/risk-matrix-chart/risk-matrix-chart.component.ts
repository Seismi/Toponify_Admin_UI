import { Component, EventEmitter, Input, Output } from '@angular/core';

export type RiskMatrixData = number[][];

@Component({
  selector: 'smi-risk-matrix-chart',
  templateUrl: './risk-matrix-chart.component.html',
  styleUrls: ['./risk-matrix-chart.component.scss']
})
export class RiskMatrixChartComponent {
  // Colors to the matrix will be defined accordingly
  // x + y = colours array index
  public colours = ['#00ce00', '#00ce00', '#6c9712', '#6c9712', '#f1b301', '#e97600', '#e97600', '#df1627', '#df1627'];

  @Input()
  selected: number[] | null = null;

  @Input()
  matrix: RiskMatrixData = [];

  @Input('colours')
  set setColours(colours: string[]) {
    this.colours = colours;
  }

  @Output('clicked')
  clicked = new EventEmitter<number[]>();

  isSelected(x: number, y: number): boolean {
    if (!this.selected) {
      return false;
    }
    return this.selected[0] === x && this.selected[1] === y;
  }

  getColorAccordingIndex(index: number): string {
    return this.colours[index] ? this.colours[index] : 'transparent';
  }

  handleColClick(x: number, y: number): void {
    this.clicked.emit([x, y]);
  }
}
