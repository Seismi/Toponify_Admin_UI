import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb: string;

  constructor(private router: Router) { }

  ngOnInit() { 
    this.breadcrumb = this.router.url.split("?")[0];
  }

}