import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smi-documentation-standards-component',
  templateUrl: 'documentation-standards.component.html',
  styleUrls: ['documentation-standards.component.scss']
})

export class DocumentationStandardsComponent implements OnInit {

  rowSelected = false;

  constructor() { }

  ngOnInit() { }

  onSelectDocumentation() {
    this.rowSelected = true;
  }

}