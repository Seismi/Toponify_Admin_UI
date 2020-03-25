import { AfterViewInit, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { State } from '@app/core/store';
import { getErrorMessage } from '@app/core/store/selectors/error.selectors';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  constructor(
    private snackBar: MatSnackBar,
    private store: Store<State>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    const customIcons = [
      'data_set-master-data',
      'data_set-physical',
      'data_set-virtual',
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
      'transformation'
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
