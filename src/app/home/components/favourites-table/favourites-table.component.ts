import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { RadioTokenColours } from '@app/radio/store/models/radio.model';
import { Favourites } from '@app/settings/store/models/user.model';
import { Router } from '@angular/router';
import { Level } from '@app/architecture/services/diagram-level.service';

enum FavouriteType {
  radioView = 'radioView',
  scope = 'scope'
}

type Button = 'systems' | 'data' | 'reports' | 'radios';

@Component({
  selector: 'smi-favourites-table',
  templateUrl: './favourites-table.component.html',
  styleUrls: ['./favourites-table.component.scss']
})
export class FavouritesTableComponent {
  public FavouriteType = FavouriteType;
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router) { }

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<any>;

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
    const queryParams: { [key: string]: any } = { scope: favourite.id };
    switch (button) {
      case 'systems':
        queryParams.filterLevel = Level.system;
        this.goToTopology(queryParams);
        break;
      case 'data':
        queryParams.filterLevel = Level.data;
        this.goToTopology(queryParams);
        break;
      case 'reports':
        this.router.navigate(['/report-library', favourite.id], { queryParams });
        break;
      case 'radios':
        queryParams.radioViewId = favourite.id;
        this.router.navigate(['/radio'], { queryParams });
        break;
    }
  }

  goToTopology(queryParams: { [key: string]: any }): void {
    this.router.navigate(['/topology'], { queryParams });
  }
}
