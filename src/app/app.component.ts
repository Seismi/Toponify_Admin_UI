import { AfterViewInit, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { State } from '@app/core/store';
import { getErrorMessage } from '@app/core/store/selectors/error.selectors';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NotificationState } from './core/store/reducers/notification.reducer';
import { NotificationGetAll } from './core/store/actions/notification.actions';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  constructor(
    private snackBar: MatSnackBar,
    private store: Store<State>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private notificationStore: Store<NotificationState>
  ) {
    const customIcons = [
      'data-data-set-master',
      'data-data-set-shared',
      'data-master-data-set-master',
      'data-master-data-set-shared',
      'data-data-structure',
      'dim',
      'rc-keyrc',
      'rc-list',
      'rc-structure',
      'sys-analytical',
      'sys-files',
      'sys-master-data',
      'sys-reporting',
      'sys-transactional',
      'data-interface',
      'transformation',
      'group',
      'sys-manual-processing',
      'sys-desktop-application',
      'sys-data-set'
    ];

    const tagIcons = ['tag_cloud', 'tag_external', 'tag_process', 'tag_timer', 'tag_user'];

    customIcons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/node-icons/${icon}.svg`)
      );
    });

    tagIcons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/tag-icons/${icon}.svg`)
      );
    });

    this.router.events.pipe(debounce(() => timer(5000))).subscribe(_ => {
      this.notificationStore.dispatch(new NotificationGetAll());
    });
  }

  ngAfterViewInit(): void {
    this.store.select(getErrorMessage).subscribe(msg => {
      if (msg) {
        this.snackBar.open(msg);
      } else {
        this.snackBar.dismiss();
      }
    });
  }
}
