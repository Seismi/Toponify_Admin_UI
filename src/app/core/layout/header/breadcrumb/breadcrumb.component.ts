import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'smi-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

  breadcrumb: string;

  constructor(router: Router) { 
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const urlDelimitators = new RegExp(/[?//,;&:#$+=]/);
        let currentUrlPath = event.url.slice(1).split(urlDelimitators)[0].replace(/[^\w\s]/gi, ' ');
        this.breadcrumb = currentUrlPath;
      }
    });
  }

}