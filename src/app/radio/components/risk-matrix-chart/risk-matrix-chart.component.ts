import { Component, Output, Input, EventEmitter } from "@angular/core";

export type RiskMatrixData = number[][];

@Component({
  selector: "risk-matrix-chart",
  templateUrl: "./risk-matrix-chart.component.html",
  styleUrls: ["./risk-matrix-chart.component.scss"]
})
export class RiskMatrixChartComponent {
  public colours = [
    "#00ce00",
    "#00ce00",
    "#6c9712",
    "#6c9712",
    "#f1b301",
    "#e97600",
    "#e97600",
    "#df1627",
    "#df1627"
  ];

  @Input()
  selected: { x: number; y: number } | null = null;

  @Input()
  matrix: RiskMatrixData = [];

  @Input("colours")
  set setColours(colours: string[]) {
    this.entities = colours;
  }

  @Output("clicked")
  clicked = new EventEmitter<any>();

  getColorAccordingIndex(index: number): string {
    return this.colours[index] ? this.colours[index] : "transparent";
  }

  handleColClick(probability: number, impact: number): void {
    this.clicked.emit({
      probability,
      impact
    });
  }
}
