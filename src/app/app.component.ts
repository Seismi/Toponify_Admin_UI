import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
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
      'sys-transactional'
    ];

    customIcons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/node-icons/${icon}.svg`)
      );
    });
  }
}
