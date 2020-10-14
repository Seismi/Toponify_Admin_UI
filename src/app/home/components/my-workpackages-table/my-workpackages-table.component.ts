import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { Favourites } from '@app/settings/store/models/user.model';
import { RadioTokenColours } from '@app/radio/store/models/radio.model';
import { Router } from '@angular/router';

type Button = 'systems' | 'data' | 'reports' | 'radios';

enum TableStyles {
  SIMPLE = 'Simple Table',
  MANAGEMENT = 'Management Table'
}

@Component({
  selector: 'smi-my-workpackages-table',
  templateUrl: './my-workpackages-table.component.html',
  styleUrls: ['./my-workpackages-table.component.scss']
})
export class MyWorkpackagesTableComponent {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) { }

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<WorkPackageEntity>;

  @Output() openWorkPackage = new EventEmitter<string>();

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTooltip(radioSummary: { count: number, state: string }): string {
    if (radioSummary.count === 0) {
      return 'No item reported';
    } else {
      return `${radioSummary.count} items with at least one with ${radioSummary.state} importance`;
    }
  }

  getChipColour(radioSummary: { count: number, state: string }): string {
    if (radioSummary.count === 0) {
      return RadioTokenColours.none;
    }
    switch (radioSummary.state) {
      case 'critical':
        return RadioTokenColours.critical;
      case 'high':
        return RadioTokenColours.high;
      case 'medium':
        return RadioTokenColours.medium;
      case 'low':
        return RadioTokenColours.low;
      case 'minor':
        return RadioTokenColours.minor;
    }
  }

  onOpen(favourite: Favourites, button: Button): void {
    const queryParams = {
      status: ['new', 'open'],
      tableStyle: TableStyles.MANAGEMENT,
      relatesToWorkPackages: favourite.id
    };
    switch (button) {
      case 'radios':
        this.router.navigate(['/radio'], { queryParams });
        break;
    }
  }

  goToTopology(queryParams: { [key: string]: any }): void {
    this.router.navigate(['/topology'], { queryParams });
  }
}
