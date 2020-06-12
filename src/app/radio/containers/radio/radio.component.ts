import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LoadNodes, LoadTags } from '@app/architecture/store/actions/node.actions';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { DownloadCSVModalComponent } from '@app/core/layout/components/download-csv-modal/download-csv-modal.component';
import { LoadUsers } from '@app/settings/store/actions/user.actions';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { currentArchitecturePackageId } from '@app/workpackage/store/models/workpackage.models';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash.isequal';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { RadioValidatorService } from '../../components/radio-detail/services/radio-detail-validator.service';
import { RadioDetailService } from '../../components/radio-detail/services/radio-detail.service';
import {
  AddRadioEntity,
  LoadRadios,
  RadioActionTypes,
  RadioFilter,
  SearchRadio
} from '../../store/actions/radio.actions';
import { RadioDetail, RadioEntity, RadiosAdvancedSearch, TableData } from '../../store/models/radio.model';
import { State as RadioState } from '../../store/reducers/radio.reducer';
import {
  getRadioEntities,
  getRadioFilter,
  getSelectedRadio,
  getRadioTableData
} from '../../store/selectors/radio.selector';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { RadioModalComponent } from '../radio-modal/radio-modal.component';
import { LoadWorkPackages } from '@app/workpackage/store/actions/workpackage.actions';

@Component({
  selector: 'smi-radio',
  templateUrl: 'radio.component.html',
  styleUrls: ['radio.component.scss'],
  providers: [RadioDetailService, RadioValidatorService]
})
export class RadioComponent implements OnInit, OnDestroy {
  public radio$: Observable<TableData<RadioEntity>>;
  public loading$: Observable<boolean>;
  public radioSelected: boolean;
  public filterData: RadiosAdvancedSearch;
  public selectedLeftTab: number | string;
  public selectedRadioIndex: string | number;
  private subscriptions: Subscription[] = [];

  constructor(
    private actions: Actions,
    private nodeStore: Store<NodeState>,
    private userStore: Store<UserState>,
    private store: Store<RadioState>,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadTags());
    this.store.dispatch(new LoadWorkPackages({}));
    this.userStore.dispatch(new LoadUsers({}));
    this.store.dispatch(
      new LoadRadios({
        page: String(0),
        size: String(10)
      })
    );
    this.nodeStore.dispatch(new LoadNodes());
    this.radio$ = this.store.pipe(select(getRadioTableData));
    // .pipe(
    //   map(radios => radios.entities.filter(radio => (this.filterData === null ? radio.status !== 'closed' : radio)))
    // );

    this.store.pipe(select(getRadioFilter)).subscribe(data => {
      if (data) {
        this.filterData = data;
      }
    });

    this.subscriptions.push(
      this.store
        .pipe(
          select(getRadioFilter),
          distinctUntilChanged(isEqual)
        )
        .subscribe(data => {
          if (data) {
            this.store.dispatch(
              new SearchRadio({
                data: this.transformFilterIntoAdvancedSearchData(data),
                page: '0',
                size: '10'
              })
            );
          } else {
            this.store.dispatch(
              new LoadRadios({
                page: '0',
                size: '10'
              })
            );
          }
        })
    );

    this.subscriptions.push(
      this.store.pipe(select(getSelectedRadio)).subscribe((action: RadioDetail) => {
        if (action) {
          this.selectedRadioIndex = action.id;
        }
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(RadioActionTypes.AddRadioSuccess)).subscribe((action: { payload: RadioDetail }) => {
        this.selectedRadioIndex = action.payload.id;
        if (this.filterData) {
          this.store.dispatch(
            new SearchRadio({
              data: this.transformFilterIntoAdvancedSearchData(this.filterData)
            })
          );
        } else {
          this.store.dispatch(
            new LoadRadios({
              page: '0',
              size: '10'
            })
          );
        }
        this.onSelectRadio(action.payload);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
    this.store.dispatch(new RadioFilter(null));
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSelectRadio(row: RadioEntity) {
    this.router.navigate(['radio', row.id], { queryParamsHandling: 'preserve' });
  }

  onAddRadio(): void {
    const dialogRef = this.dialog.open(RadioModalComponent, {
      disableClose: false,
      width: '800px',
      data: {
        selectedNode: null
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        this.store.dispatch(
          new AddRadioEntity({
            data: {
              title: data.radio.title,
              status: data.radio.status,
              category: data.radio.category,
              description: data.radio.description,
              assignedTo: data.radio.assignedTo,
              author: data.radio.author,
              relatesTo: [{ workPackage: { id: currentArchitecturePackageId } }],
              actionBy: data.radio.actionBy,
              mitigation: data.radio.mitigation,
              severity: data.radio.severity,
              frequency: data.radio.frequency
            }
          })
        );
      }
    });
  }

  onFilter(): void {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      disableClose: false,
      data: {
        filterData: this.filterData,
        mode: this.filterData ? 'filter' : null
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.radio) {
        this.store.dispatch(new RadioFilter(data.radio));
      }
    });
  }

  handlePageChange(nextPage: { previousPageIndex: number; pageIndex: number; pageSize: number; length: number }): void {
    if (this.filterData) {
      this.store.dispatch(
        new SearchRadio({
          data: this.transformFilterIntoAdvancedSearchData(this.filterData),
          page: String(nextPage.pageIndex),
          size: String(nextPage.pageSize)
        })
      );
    } else {
      this.store.dispatch(
        new LoadRadios({
          page: String(nextPage.pageIndex),
          size: String(nextPage.pageSize)
        })
      );
    }
  }

  downloadCSV(): void {
    this.dialog.open(DownloadCSVModalComponent, {
      width: '250px',
      disableClose: true,
      data: {
        GET: 'radio',
        fileName: 'RADIO'
      }
    });
  }

  isFilterEnabled(filter: string | boolean | [] | number): boolean {
    if (Array.isArray(filter) && filter.length === 0) {
      return false;
    }
    if (Number.isInteger(filter as any)) {
      return true;
    }
    return !!filter;
  }

  transformFilterIntoAdvancedSearchData(data: any): RadiosAdvancedSearch {
    return {
      status: {
        enabled: this.isFilterEnabled(data.status),
        values: data.status
      },
      type: {
        enabled: this.isFilterEnabled(data.type),
        values: data.type
      },
      assignedTo: {
        enabled: this.isFilterEnabled(data.assignedTo),
        values: data.assignedTo
      },
      workpackages: {
        enabled: this.isFilterEnabled(data.relatesToWorkPackages),
        includeBaseline: this.isFilterEnabled(data.relatesToWorkPackages),
        values: data.relatesToWorkPackages
      },
      relatesTo: {
          enabled: this.isFilterEnabled(data.relatesTo),
          includeDescendants: this.isFilterEnabled(data.relatesTo),
          includeLinks: this.isFilterEnabled(data.relatesTo),
          values: data.relatesTo
        },
      dueDate: {
        enabled: this.isFilterEnabled(data.from) || this.isFilterEnabled(data.to),
        from: data.from,
        to: data.to
      },
      text: {
        enabled: this.isFilterEnabled(data.text),
        value: data.text
      },
      severityRange: {
        enabled: this.isFilterEnabled(data.severityRangeFrom) || this.isFilterEnabled(data.severityRangeTo),
        from: data.severityRangeFrom,
        to: data.severityRangeTo
      },
      frequencyRange: {
        enabled: this.isFilterEnabled(data.frequencyRangeFrom) || this.isFilterEnabled(data.frequencyRangeTo),
        from: data.frequencyRangeFrom,
        to: data.frequencyRangeTo
      },
      tags: {
        enabled: this.isFilterEnabled(data.hasTag),
        values: data.hasTag
      }
    };
  }
}
