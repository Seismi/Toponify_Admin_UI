import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smi-organisations',
  templateUrl: 'organisations.component.html',
  styleUrls: ['organisations.component.scss']
})
export class OrganisationsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  emailSupport(): string {
    return location.href = 'mailto:accounts@toponify.com';
  }
}
