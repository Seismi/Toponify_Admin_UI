import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  url: string;
  breadcrumb: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.url = this.router.url.split("?")[0];
    this.breadcrumb = this.url.replace(/[^\w\s]/gi, ' ');
  }

}